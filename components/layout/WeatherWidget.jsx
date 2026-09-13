'use client';

import { useState, useEffect } from 'react';

/**
 * Animated SVG Weather Icons
 * Desenhados com precisão vetorial e micro-animações CSS puras para dar vida à interface.
 */

function AnimatedSunIcon({ size = 20 }) {
  return (
    <span className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Raios girando suavemente */}
        <g className="animate-[spin_12s_linear_infinite] origin-center">
          <line x1="12" y1="1" x2="12" y2="4" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="20" x2="12" y2="23" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <line x1="1" y1="12" x2="4" y2="12" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <line x1="20" y1="12" x2="23" y2="12" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
        </g>
        {/* Núcleo do Sol pulsante */}
        <circle cx="12" cy="12" r="5" fill="#f59e0b" className="animate-pulse" />
        <circle cx="12" cy="12" r="4" fill="#fde047" />
      </svg>
    </span>
  );
}

function AnimatedRainIcon({ size = 20 }) {
  return (
    <span className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Nuvem suave */}
        <path
          d="M17.5 14a4.5 4.5 0 0 0-.5-8.97A6 6 0 0 0 6 9.5a4.5 4.5 0 0 0 .5 8.97h11z"
          fill="#94a3b8"
          opacity="0.9"
        />
        {/* Gotas de chuva caindo em loop suave */}
        <g stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round">
          <line x1="8" y1="16" x2="7" y2="20" className="animate-[bounce_1s_infinite_ease-in-out]" />
          <line x1="12" y1="17" x2="11" y2="21" className="animate-[bounce_1.2s_infinite_ease-in-out_200ms]" />
          <line x1="16" y1="16" x2="15" y2="20" className="animate-[bounce_1s_infinite_ease-in-out_400ms]" />
        </g>
      </svg>
    </span>
  );
}

function AnimatedPartlyCloudyIcon({ size = 20 }) {
  return (
    <span className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Sol atrás */}
        <g className="animate-[spin_16s_linear_infinite] origin-[16px_8px]">
          <circle cx="16" cy="8" r="4.5" fill="#f59e0b" />
          <line x1="16" y1="1" x2="16" y2="3" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="21" y1="8" x2="23" y2="8" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="19.5" y1="4.5" x2="21" y2="3" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
        </g>
        {/* Nuvem flutuando suavemente */}
        <path
          d="M15 17a3.5 3.5 0 0 0-.4-6.98A4.5 4.5 0 0 0 6 12a3.5 3.5 0 0 0 .4 6.98h8.6z"
          fill="#cbd5e1"
          className="animate-[pulse_4s_ease-in-out_infinite]"
        />
      </svg>
    </span>
  );
}

function AnimatedCloudyIcon({ size = 20 }) {
  return (
    <span className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 16a4 4 0 0 0-.5-7.97A5.5 5.5 0 0 0 7 11a4 4 0 0 0 .5 7.97H18z"
          fill="#94a3b8"
          className="animate-[pulse_3s_ease-in-out_infinite]"
        />
      </svg>
    </span>
  );
}

function AnimatedStormIcon({ size = 20 }) {
  return (
    <span className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <path
          d="M17 13a4 4 0 0 0-.4-7.98A5 5 0 0 0 7 8.5a4 4 0 0 0 .4 7.98h9.6z"
          fill="#475569"
        />
        {/* Raio piscando */}
        <polygon
          points="13,11 10,16 12,16 11,21 15,14 13,14"
          fill="#eab308"
          stroke="#ca8a04"
          strokeWidth="0.5"
          className="animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"
        />
      </svg>
    </span>
  );
}

/**
 * Retorna o ícone animado e rótulo correspondente ao código WMO do Open-Meteo.
 */
function getWeatherVisual(code) {
  if (code === 0) {
    return { icon: <AnimatedSunIcon />, label: 'Ensolarado' };
  }
  if (code === 1 || code === 2) {
    return { icon: <AnimatedPartlyCloudyIcon />, label: 'Parcialmente Nublado' };
  }
  if (code === 3) {
    return { icon: <AnimatedCloudyIcon />, label: 'Nublado' };
  }
  if (code >= 51 && code <= 67) {
    return { icon: <AnimatedRainIcon />, label: 'Chuva Leve' };
  }
  if (code >= 80 && code <= 82) {
    return { icon: <AnimatedRainIcon />, label: 'Pancadas de Chuva' };
  }
  if (code >= 95) {
    return { icon: <AnimatedStormIcon />, label: 'Trovoadas' };
  }
  // Padrão Acre / Brasiléia (clima tropical com sol e nuvens)
  return { icon: <AnimatedPartlyCloudyIcon />, label: 'Tempo Bom' };
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState({
    temp: 28,
    code: 1,
    city: 'Brasiléia, AC',
    loaded: false,
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchWeather() {
      try {
        // Coordenadas geográficas de Brasiléia - Acre
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-11.0161&longitude=-68.7472&current=temperature_2m,weather_code&timezone=America%2FRio_Branco'
        );
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data.current) {
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            code: data.current.weather_code,
            city: 'Brasiléia, AC',
            loaded: true,
          });
        }
      } catch {
        // Mantém fallback elegante silenciosamente
      }
    }

    fetchWeather();
    return () => { isMounted = false; };
  }, []);

  const visual = getWeatherVisual(weather.code);

  return (
    <div
      className="inline-flex items-center gap-2 text-[12px] font-medium text-slate-200 shrink-0 hover:text-white transition-colors cursor-default"
      title={`Previsão em tempo real: ${visual.label} em ${weather.city}`}
    >
      {visual.icon}
      <span className="font-semibold text-white tracking-wide">{weather.temp}°C</span>
      <span className="text-slate-300 hidden sm:inline text-[11px] opacity-85">Brasiléia</span>
    </div>
  );
}
