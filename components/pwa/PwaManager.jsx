'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { createBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function PwaManager() {
  const router = useRouter();
  const [codeUpdateAvailable, setCodeUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [dbNotification, setDbNotification] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallToast, setShowInstallToast] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [toastProgress, setToastProgress] = useState(100);
  
  const currentVersionRef = useRef(null);
  const swRegistrationRef = useRef(null);
  const isIosDevice =
    typeof navigator !== 'undefined' &&
    (/iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

  // 1. Registro do Service Worker e Checagem Automática de Atualizações
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detecta se já está instalado em modo standalone
    const checkStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');

    // Captura o evento nativo de instalação do PWA
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setShowInstallToast(false);
      setDeferredPrompt(null);
      sessionStorage.setItem('educa_pwa_toast_dismissed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Exibe breve toast ao abrir a página se não estiver instalado e não tiver sido dispensado na sessão
    const isDismissed = sessionStorage.getItem('educa_pwa_toast_dismissed');
    let toastTimer;
    if (!checkStandalone && !isDismissed) {
      toastTimer = setTimeout(() => {
        setIsStandalone(checkStandalone);
        setIsIos(isIosDevice);
        setShowInstallToast(true);
      }, 1500);
    }

    // Registro do Service Worker com bypass de cache HTTP
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { updateViaCache: 'none' })
        .then((registration) => {
          swRegistrationRef.current = registration;

          // Se já há um Service Worker esperando na fila para assumir
          if (registration.waiting && navigator.serviceWorker.controller) {
            setCodeUpdateAvailable(true);
          }

          // Monitora se há um novo Service Worker sendo baixado ou instalado
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setCodeUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((err) => {
          console.error('[PWA SW Registration Error]', err);
        });

      // Escuta mudanças de controlador (quando skipWaiting ativa a nova versão)
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }

    // Checagem inteligente de versão da API (/api/version) e verificação no SW
    const checkAppVersion = async () => {
      try {
        // Força checagem de atualização do worker no navegador/servidor
        if (swRegistrationRef.current) {
          swRegistrationRef.current.update().catch(() => {});
        }

        const res = await fetch(`/api/version?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache, no-store' },
        });
        if (!res.ok) return;
        const data = await res.json();
        
        if (!currentVersionRef.current) {
          currentVersionRef.current = data.version;
          sessionStorage.setItem('educa_app_version', data.version);
        } else if (currentVersionRef.current !== data.version) {
          console.log('[PWA] Nova versão detectada:', data.version);
          setCodeUpdateAvailable(true);
        }
      } catch (e) {
        console.debug('[PWA] Falha ao verificar versão:', e);
      }
    };

    // Checagem inicial
    checkAppVersion();

    // Polling a cada 30 segundos
    const interval = setInterval(checkAppVersion, 30000);

    // Eventos ao retornar ao app no celular (desbloqueio de tela, mudança de aba, retorno online)
    const onForeground = () => {
      checkAppVersion();
      // Atualiza também dados do router para garantir que notícias/cronogramas não fiquem defasados
      router.refresh();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        onForeground();
      }
    };

    window.addEventListener('focus', onForeground);
    window.addEventListener('online', onForeground);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('focus', onForeground);
      window.removeEventListener('online', onForeground);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearInterval(interval);
      if (toastTimer) clearTimeout(toastTimer);
    };
  }, [router, isIosDevice]);

  // 2. Supabase Realtime: Notícias, Escolas, Banners, Eventos, Cronogramas e Mensagem do Dia em Tempo Real
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let supabase;
    try {
      supabase = createBrowserClient();
    } catch (err) {
      console.warn('[PWA Supabase Realtime] Falha ao instanciar cliente:', err);
      return;
    }

    if (!supabase) return;

    // Inscrição multicanal para refletir alterações de qualquer tabela instantaneamente
    const channel = supabase
      .channel('portal-realtime-all-tables')
      // Tabela de Notícias
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'news' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newStory = payload.new;
            setDbNotification({
              type: 'news',
              title: 'Nova Notícia Publicada!',
              message: newStory.title || 'Uma nova matéria acabou de sair no portal.',
              slug: newStory.slug,
            });
          }
          router.refresh();
        }
      )
      // Tabela de Escolas (Guia das Escolas da Rede)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'schools' },
        () => {
          router.refresh();
        }
      )
      // Tabela de Banners
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'banners' },
        () => {
          router.refresh();
        }
      )
      // Tabela de Eventos
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        () => {
          router.refresh();
        }
      )
      // Tabela de Cronogramas Setoriais (DIRE, Ensino, Transporte, etc.)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cronogramas' },
        () => {
          router.refresh();
        }
      )
      // Tabela de Mensagem do Dia
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'mensagens_dia' },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  // Função para aplicar a atualização do código instantaneamente
  const applyCodeUpdate = async () => {
    setIsUpdating(true);

    try {
      // 1. Limpa todas as instâncias legadas de CacheStorage
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
    } catch (e) {
      console.warn('[PWA] Limpeza de cache:', e);
    }

    // 2. Notifica o Service Worker para assumir o controle imediatamente
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          if (reg.waiting) {
            reg.waiting.postMessage({ type: 'SKIP_WAITING' });
            reg.waiting.postMessage({ type: 'CLEAR_CACHE' });
          } else if (reg.active) {
            reg.active.postMessage({ type: 'CLEAR_CACHE' });
          }
        }
      } catch (e) {
        console.warn('[PWA] Erro ao comunicar com Service Worker:', e);
      }
    }

    // 3. Força o recarregamento limpo da página
    setTimeout(() => {
      window.location.reload();
    }, 250);
  };

  // 3. Temporizador do Toast de Instalação (com pausa ao passar o mouse ou abrir instruções)
  useEffect(() => {
    if (!showInstallToast || isPaused || showInstructions) return;

    const interval = setInterval(() => {
      setToastProgress((prev) => {
        if (prev <= 1) {
          setShowInstallToast(false);
          sessionStorage.setItem('educa_pwa_toast_dismissed', 'true');
          clearInterval(interval);
          return 0;
        }
        return prev - 1.25; // Aproximadamente 8 segundos (80 passos de 100ms)
      });
    }, 100);

    return () => clearInterval(interval);
  }, [showInstallToast, isPaused, showInstructions]);

  // Função para dispensar o toast
  const dismissToast = () => {
    setShowInstallToast(false);
    sessionStorage.setItem('educa_pwa_toast_dismissed', 'true');
  };

  // Função para instalar o app ou abrir guia de instalação
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setShowInstallToast(false);
          setDeferredPrompt(null);
          sessionStorage.setItem('educa_pwa_toast_dismissed', 'true');
        }
      } catch (err) {
        console.error('[PWA Install Error]', err);
      }
    } else {
      // Abre/fecha as instruções para iOS ou navegadores sem evento automático
      setIsPaused(true);
      setShowInstructions((prev) => !prev);
    }
  };

  return (
    <>
      {/* ── NOTIFICAÇÃO 1: ATUALIZAÇÃO DE CÓDIGO NO SERVIDOR (DEPLOY NOVO) ── */}
      {codeUpdateAvailable && (
        <div className="fixed bottom-5 right-5 left-5 md:left-auto md:w-96 z-50 bg-primary text-white p-4 rounded-xl shadow-2xl border border-white/20 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-xl">system_update</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm leading-tight text-white">Nova versão do Portal SEE</h4>
              <p className="text-xs text-white/80 mt-1">
                Uma nova versão com melhorias e correções já está pronta. Atualize agora sem perder nada!
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1 border-t border-white/10">
            <button
              disabled={isUpdating}
              onClick={() => setCodeUpdateAvailable(false)}
              className="px-3 py-1.5 text-xs text-white/70 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              Depois
            </button>
            <button
              disabled={isUpdating}
              onClick={applyCodeUpdate}
              className="px-4 py-1.5 text-xs font-semibold bg-secondary hover:bg-secondary/90 disabled:bg-secondary/60 text-white rounded-lg transition-all shadow cursor-pointer flex items-center gap-1.5"
            >
              <span className={`material-symbols-outlined text-[16px] ${isUpdating ? 'animate-spin' : ''}`}>
                {isUpdating ? 'progress_activity' : 'refresh'}
              </span>
              {isUpdating ? 'Atualizando...' : 'Atualizar Agora'}
            </button>
          </div>
        </div>
      )}

      {/* ── NOTIFICAÇÃO 2: NOVA NOTÍCIA OU ATUALIZAÇÃO DO SUPABASE ── */}
      {dbNotification && (
        <div className="fixed top-5 right-5 left-5 md:left-auto md:w-96 z-50 bg-surface-container-lowest text-on-surface p-4 rounded-xl shadow-2xl border border-secondary/40 flex flex-col gap-3 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">newspaper</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-secondary tracking-wider uppercase">
                  {dbNotification.title}
                </span>
                <button
                  onClick={() => setDbNotification(null)}
                  className="text-on-surface-variant hover:text-on-surface text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs font-medium text-on-surface line-clamp-2 mt-1">
                {dbNotification.message}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/30">
            {dbNotification.slug && (
              <button
                onClick={() => {
                  const targetSlug = dbNotification.slug;
                  setDbNotification(null);
                  router.push(`/noticias/${targetSlug}`);
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-white rounded-lg transition-all shadow cursor-pointer flex items-center gap-1"
              >
                Ler notícia
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            )}
            <button
              onClick={() => {
                setDbNotification(null);
                router.refresh();
              }}
              className="px-3 py-1.5 text-xs font-semibold bg-secondary/15 text-secondary hover:bg-secondary/25 rounded-lg transition-all cursor-pointer"
            >
              Ver no portal
            </button>
          </div>
        </div>
      )}

      {/* ── BREVE TOAST DE INSTALAÇÃO DO PWA AO ABRIR A PÁGINA ── */}
      {showInstallToast && !isStandalone && (
        <aside
          role="dialog"
          aria-label="Instalar aplicativo Educa Brasiléia"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50 bg-surface-container-lowest/95 backdrop-blur-md text-on-surface rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="p-4 pb-3.5">
            <div className="flex items-start gap-3">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-sm border border-outline-variant/30 shrink-0 bg-primary/5 flex items-center justify-center">
                <Image
                  src="/icon-192.png"
                  alt="Educa SEE"
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-sm font-bold text-primary tracking-tight">
                      Educa Brasiléia
                    </h4>
                    <span className="text-[10px] font-semibold bg-secondary/10 text-secondary border border-secondary/20 px-1.5 py-0.5 rounded-full">
                      App Oficial
                    </span>
                  </div>
                  <button
                    onClick={dismissToast}
                    aria-label="Fechar notificação"
                    className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-full p-1 transition-colors -mr-1 -mt-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
                <p className="text-xs text-on-surface-variant mt-1 leading-snug">
                  Instale o aplicativo para ter acesso instantâneo às notícias e avisos escolares na sua tela inicial.
                </p>
              </div>
            </div>

            {/* Guia passo a passo quando aberto para iOS ou sem evento nativo */}
            {showInstructions && (
              <div className="mt-3 p-3 bg-surface-container-low rounded-xl text-xs text-on-surface border border-outline-variant/30 animate-in fade-in duration-200">
                <p className="font-semibold text-primary mb-1.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">info</span>
                  Como adicionar à sua tela inicial:
                </p>
                {isIos ? (
                  <ol className="list-decimal list-inside space-y-1 text-on-surface-variant text-[11px] leading-relaxed">
                    <li>
                      Toque no botão <strong>Compartilhar</strong>{' '}
                      <span className="material-symbols-outlined inline-block text-[14px] align-middle">ios_share</span>{' '}
                      na barra do Safari
                    </li>
                    <li>
                      Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>{' '}
                      <span className="material-symbols-outlined inline-block text-[14px] align-middle">add_box</span>
                    </li>
                    <li>
                      Toque em <strong>Adicionar</strong> no canto superior direito
                    </li>
                  </ol>
                ) : (
                  <ol className="list-decimal list-inside space-y-1 text-on-surface-variant text-[11px] leading-relaxed">
                    <li>
                      Toque no menu de opções <strong>(⋮)</strong> do navegador
                    </li>
                    <li>
                      Selecione <strong>&ldquo;Instalar aplicativo&rdquo;</strong> ou <strong>&ldquo;Adicionar à tela inicial&rdquo;</strong>
                    </li>
                    <li>Confirme a instalação</li>
                  </ol>
                )}
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex items-center justify-end gap-2 mt-3 pt-2.5 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={dismissToast}
                className="px-3 py-1.5 text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
              >
                Agora não
              </button>
              <button
                type="button"
                onClick={handleInstallClick}
                className="px-3.5 py-1.5 text-xs font-semibold bg-secondary hover:bg-secondary/90 text-white rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {deferredPrompt ? 'download' : (showInstructions ? 'check' : 'install_mobile')}
                </span>
                {deferredPrompt ? 'Instalar App' : (showInstructions ? 'Fechar Guia' : 'Como Instalar')}
              </button>
            </div>
          </div>

          {/* Barra de progresso do auto-dismiss (pausa com hover/touch/instruções) */}
          {!showInstructions && (
            <div className="w-full bg-outline-variant/20 h-1 overflow-hidden">
              <div
                className="h-full bg-secondary transition-[width] ease-linear duration-100"
                style={{ width: `${toastProgress}%` }}
              />
            </div>
          )}
        </aside>
      )}
    </>
  );
}
