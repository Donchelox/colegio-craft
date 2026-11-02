import React from 'react';
import { useGame } from '../../context/GameContext';
import { initAudio, playSound, speakChileanExpressive } from '../../services/audioService';

export default function WelcomeModal() {
  const { closeModals, showToast } = useGame();

  const handleStart = () => {
    initAudio();
    playSound('success');
    closeModals();
    showToast('🏰', '¡Camina hacia cualquiera de las 4 Puertas Mágicas para explorar!');
    speakChileanExpressive([
      { text: '¡Bienvenido a Colegio Craft tres D!', pitch: 1.08, rate: 1.0, pauseAfter: 180 },
      { text: 'Aquí tienes los cuatro mundos de segundo básico, listos y sincronizados con tus libros de Notebook LM.', pitch: 1.03, rate: 0.98 }
    ]);
  };

  return (
    <div className="mc-dialog-overlay select-none animate-fadeIn">
      <div className="mc-panel w-full max-w-lg p-5 sm:p-6 shadow-2xl text-center">
        {/* Encabezado */}
        <div className="mc-header-wood p-3 rounded mb-4">
          <span className="text-3xl block mb-1">🏰</span>
          <h1 className="pixel-font text-sm sm:text-base text-amber-200 font-extrabold tracking-tight">
            COLEGIO CRAFT 3D
          </h1>
          <p className="text-xs text-amber-300/80 font-medium mt-0.5">
            Mundos de Aprendizaje Voxel • 2° Básico
          </p>
        </div>

        {/* Pergamino descriptivo */}
        <div className="mc-parchment p-4 rounded text-xs sm:text-sm text-stone-800 space-y-2.5 mb-5 text-left leading-relaxed">
          <p>
            ¡Hola explorador! Conoce a tu personaje: un niño deportista listo para aprender viajando por mundos tridimensionales inspirados en <strong>Minecraft</strong> y <strong>Crossy Road</strong>.
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="bg-amber-100/80 p-2 rounded border border-amber-300">
              <strong>🏺 Historia:</strong> Pueblos Originarios
            </div>
            <div className="bg-emerald-100/80 p-2 rounded border border-emerald-300">
              <strong>🔬 Ciencias:</strong> Cuerpo y Animales
            </div>
            <div className="bg-fuchsia-100/80 p-2 rounded border border-fuchsia-300">
              <strong>📚 Lenguaje:</strong> Cómics y Vocabulario
            </div>
            <div className="bg-sky-100/80 p-2 rounded border border-sky-300">
              <strong>🔢 Matemáticas:</strong> Decenas y 3D
            </div>
          </div>
          <div className="p-2 bg-emerald-50 rounded border border-emerald-400 text-[11px] text-emerald-950 font-bold flex items-center gap-2">
            <span>⚡</span>
            <span>¡Sincronización activa con Google NotebookLM!</span>
          </div>
        </div>

        {/* Botón Comenzar */}
        <button
          onClick={handleStart}
          className="w-full mc-btn mc-btn-green py-3 rounded-lg pixel-font text-xs sm:text-sm font-extrabold shadow-xl hover:scale-[1.02] transition-transform"
        >
          ¡COMENZAR AVENTURA!
        </button>
      </div>
    </div>
  );
}
