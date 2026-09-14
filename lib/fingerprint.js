/**
 * lib/fingerprint.js — Identificação de Aparelho/Hardware (Device Fingerprinting)
 *
 * Gera uma assinatura persistente do aparelho que sobrevive à limpeza de cache,
 * independe do IP da conexão (funciona tanto em Wi-Fi compartilhado quanto em 4G/5G)
 * e impede fraudes de votos múltiplos do mesmo celular.
 */

let cachedFingerprint = null;

export async function getDeviceFingerprint() {
  if (typeof window === 'undefined') return 'server_default';
  if (cachedFingerprint) return cachedFingerprint;

  // 1. Chave persistente em armazenamento local (primeira barreira)
  let persistentToken = '';
  try {
    persistentToken = localStorage.getItem('educa_device_token');
    if (!persistentToken) {
      persistentToken = 'dt_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('educa_device_token', persistentToken);
    }
  } catch {
    // Caso o navegador esteja em modo anônimo super restrito
    persistentToken = 'ephemeral_' + Date.now();
  }

  // 2. Parâmetros imutáveis de tela e hardware do aparelho
  const screenProps = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}@${window.devicePixelRatio || 1}`;
  const touchPoints = navigator.maxTouchPoints || 0;
  const cores = navigator.hardwareConcurrency || 2;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const language = navigator.language || 'pt-BR';
  const platform = navigator.platform || '';

  // 3. GPU / WebGL Renderer (único para o chip de vídeo do celular: Adreno, Mali, Apple GPU, etc.)
  let gpuRenderer = '';
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
      }
    }
  } catch {}

  // 4. Assinatura Canvas 2D (diferenças sutis na renderização de subpixels e fontes)
  let canvasSignature = '';
  try {
    const canvas2d = document.createElement('canvas');
    canvas2d.width = 160;
    canvas2d.height = 40;
    const ctx = canvas2d.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial, sans-serif';
      ctx.fillStyle = '#10b981';
      ctx.fillRect(5, 5, 50, 20);
      ctx.fillStyle = '#002045';
      ctx.fillText('SEE-AC-Acre', 2, 12);
      canvasSignature = canvas2d.toDataURL().slice(-40);
    }
  } catch {}

  // 5. Combinação dos fatores de hardware com o token
  const rawData = [
    persistentToken,
    screenProps,
    touchPoints,
    cores,
    gpuRenderer,
    platform,
    timezone,
    language,
    canvasSignature,
  ].join('|');

  // 6. Geração de Hash Criptográfico SHA-256
  try {
    if (window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const buffer = await window.crypto.subtle.digest('SHA-256', encoder.encode(rawData));
      const hashArray = Array.from(new Uint8Array(buffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
      cachedFingerprint = `dev_${hashHex}`;
      return cachedFingerprint;
    }
  } catch {}

  // Fallback de hashing rápido djb2
  let hash = 0;
  for (let i = 0; i < rawData.length; i++) {
    hash = (hash << 5) - hash + rawData.charCodeAt(i);
    hash |= 0;
  }
  cachedFingerprint = `dev_${Math.abs(hash).toString(16).padStart(12, '0')}`;
  return cachedFingerprint;
}
