import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useKnowledge } from '../context/KnowledgeContext';
import { toggleAmbientBgm, toggleVoice, playSound } from '../services/audioService';

export default function HUD() {
  const {
    currentWorld,
    playerStats,
    compassInfo,
    hotbarSlot,
    setHotbarSlot,
    setActiveModal,
    toast,
    returnToLobby
  } = useGame();

  const { knowledgeBase } = useKnowledge();
  const [bgmActive, setBgmActive] = useState(false);
  const [voiceActive, setVoiceActive] = useState(true);

  const worldTitles = {
    lobby: { icon: '🏰', title: 'LOBBY CENTRAL: 4 PUERTAS MÁGICAS' },
    historia: { icon: '🏺', title: 'MUNDO 1: HISTORIA • Pueblos Originarios de Chile' },
    ciencias: { icon: '🔬', title: 'MUNDO 2: CIENCIAS • Cuerpo Humano, Animales y Agua' },
    lenguaje: { icon: '📚', title: 'MUNDO 3: LENGUAJE • El Cómic, Localizar Info y Vocabulario' },
    matematicas: { icon: '🔢', title: 'MUNDO 4: MATEMÁTICAS • Decenas y Geometría 3D' }
  };

  const currentInfo = worldTitles[currentWorld] || worldTitles.lobby;

  const handleToggleBgm = () => {
    const nextState = toggleAmbientBgm(setBgmActive);
    playSound('click');
  };

  const handleToggleVoice = () => {
    const next = toggleVoice();
    setVoiceActive(next);
    playSound('click');
  };

  const hotbarItems = [
    { icon: '🏺', name: 'Historia' },
    { icon: '🔬', name: 'Ciencias' },
    { icon: '📚', name: 'Lenguaje' },
    { icon: '🔢', name: 'Matemáticas' },
    { icon: '📖', name: 'Cuaderno' },
    { icon: '⚡', name: 'NotebookLM' }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-2 sm:p-4">
      {/* 1. MIRA CENTRAL */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-80">
        <div className="w-5 h-5 relative flex items-center justify-center">
          <div className="w-4 h-0.5 bg-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"></div>
          <div className="h-4 w-0.5 bg-white absolute drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"></div>
        </div>
      </div>

      {/* 2. HEADER SUPERIOR RETRO */}
      <header className="flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        {/* Logo, Nivel y Medallas */}
        <div className="flex items-center gap-2 mc-panel-dark px-3 py-1.5 rounded shadow-xl">
          <span className="text-xl">⛏️</span>
          <div>
            <div className="pixel-font text-xs sm:text-sm text-amber-400 font-extrabold flex items-center gap-2">
              COLEGIO CRAFT 3D
              <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded pixel-font">
                NV {playerStats.level}
              </span>
            </div>
            <div className="text-[11px] text-slate-300 font-medium">
              2° Básico • Chile 🇨🇱
            </div>
          </div>
        </div>

        {/* Zona Actual y Brújula */}
        <div className="flex items-center gap-2">
          <div className="mc-panel-dark px-3 py-1.5 rounded flex items-center gap-2 shadow-xl">
            <span className="text-lg">{currentInfo.icon}</span>
            <div className="text-left">
              <div className="pixel-font text-[10px] text-amber-300 font-bold max-w-[200px] sm:max-w-xs truncate">
                {currentInfo.title}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                COORD: X:{compassInfo.coords.x} Y:{compassInfo.coords.y} Z:{compassInfo.coords.z} [{compassInfo.cardinal}]
              </div>
            </div>
          </div>

          {currentWorld !== 'lobby' && (
            <button
              onClick={returnToLobby}
              className="mc-btn mc-btn-gold text-[10px] px-2.5 py-1.5 rounded font-extrabold flex items-center gap-1 shadow-lg"
            >
              🏰 VOLVER AL LOBBY
            </button>
          )}
        </div>

        {/* Botones de Acción y Sincronización NotebookLM */}
        <div className="flex items-center gap-1.5">
          {/* Botón Sincronizar NotebookLM */}
          <button
            onClick={() => {
              playSound('click');
              setActiveModal('notebooklm_sync');
            }}
            className="mc-btn mc-btn-green text-[10px] px-2.5 py-1.5 rounded font-extrabold flex items-center gap-1.5 shadow-lg relative"
            title="Sincronizar libros y contenidos desde Google NotebookLM"
          >
            <span className="text-sm">⚡</span>
            <span>NOTEBOOK LM</span>
            {knowledgeBase.syncMetadata?.lastSyncedAt && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse absolute -top-1 -right-1"></span>
            )}
          </button>

          {/* Cuaderno de Estudio */}
          <button
            onClick={() => {
              playSound('click');
              setActiveModal('notebook');
            }}
            className="mc-btn mc-btn-wood text-[10px] px-2.5 py-1.5 rounded font-extrabold flex items-center gap-1 shadow-lg"
            title="Abrir Cuaderno de Estudio"
          >
            <span>📖</span>
            <span className="hidden sm:inline">CUADERNO</span>
          </button>

          {/* Toggle Música */}
          <button
            onClick={handleToggleBgm}
            className={`mc-btn text-[10px] px-2 py-1.5 rounded font-extrabold ${bgmActive ? 'mc-btn-blue' : 'mc-btn-stone'}`}
            title="Música ambiental relajante C418"
          >
            <span>{bgmActive ? '🎵 ON' : '🎵 OFF'}</span>
          </button>

          {/* Toggle Voz Chilena */}
          <button
            onClick={handleToggleVoice}
            className={`mc-btn text-[10px] px-2 py-1.5 rounded font-extrabold ${voiceActive ? 'mc-btn-stone' : 'opacity-60'}`}
            title="Voz Chilena Natural (es-CL)"
          >
            <span>{voiceActive ? '🔊' : '🔇'}</span>
          </button>
        </div>
      </header>

      {/* 3. TOAST FLOTANTE */}
      {toast && (
        <div className="self-center mc-panel-dark px-4 py-2.5 rounded-lg border-2 border-amber-400 shadow-2xl flex items-center gap-3 animate-bounce pointer-events-auto max-w-md">
          <span className="text-2xl">{toast.emoji}</span>
          <span className="text-xs sm:text-sm font-semibold text-slate-100">{toast.text}</span>
        </div>
      )}

      {/* 4. SECCIÓN INFERIOR: CORAZONES, XP Y HOTBAR */}
      <footer className="flex flex-col items-center gap-1.5 pointer-events-auto">
        {/* Barra de Corazones y Monedas */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {[...Array(playerStats.health)].map((_, i) => (
              <span key={i} className="text-base text-rose-500 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] animate-pulse">
                ❤️
              </span>
            ))}
          </div>

          <div className="mc-panel-dark px-2 py-0.5 rounded text-[11px] font-bold text-amber-300 flex items-center gap-1">
            <span>🪙</span>
            <span>{playerStats.coins} Monedas</span>
          </div>
        </div>

        {/* Barra de Experiencia */}
        <div className="w-64 sm:w-80 h-3 bg-stone-900 border border-black rounded relative overflow-hidden flex items-center justify-center">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-green-400 transition-all duration-300 absolute left-0 top-0"
            style={{ width: `${playerStats.xp}%` }}
          ></div>
          <span className="pixel-font text-[9px] text-lime-300 font-extrabold relative z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">
            {playerStats.level}
          </span>
        </div>

        {/* Hotbar con 6 ranuras */}
        <div className="flex items-center gap-1 mc-panel-dark p-1.5 rounded-lg shadow-2xl">
          {hotbarItems.map((item, index) => {
            const isSelected = hotbarSlot === index;
            return (
              <button
                key={index}
                onClick={() => {
                  playSound('click');
                  setHotbarSlot(index);
                  if (item.name === 'Cuaderno') setActiveModal('notebook');
                  else if (item.name === 'NotebookLM') setActiveModal('notebooklm_sync');
                  else if (item.name === 'Historia') currentWorld !== 'historia' && returnToLobby();
                }}
                className={`w-10 h-10 sm:w-12 sm:h-12 flex flex-col items-center justify-center rounded transition-all ${
                  isSelected
                    ? 'border-2 border-white bg-stone-700 -translate-y-1 shadow-lg'
                    : 'border-2 border-stone-800 bg-stone-900 opacity-80 hover:opacity-100'
                }`}
              >
                <span className="text-base sm:text-lg">{item.icon}</span>
                <span className="text-[8px] text-slate-300 font-bold">{index + 1}</span>
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
}
