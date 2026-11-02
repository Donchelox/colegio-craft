import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useKnowledge } from '../../context/KnowledgeContext';
import { playSound, speakChileanExpressive, stopSpeaking } from '../../services/audioService';

export default function NpcStationModal() {
  const { currentStationData, closeModals, addXP, addCoins, openMinigame } = useGame();
  const { knowledgeBase } = useKnowledge();

  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (!currentStationData) return null;

  const st = currentStationData;
  const minigame = knowledgeBase.minigames?.[st.id];

  const handleSelectOption = (idx, opt) => {
    if (answered) return;
    setSelectedOption(idx);
    setAnswered(true);

    if (opt.correct) {
      setIsCorrect(true);
      playSound('success');
      addXP(20);
      addCoins(10);
      speakChileanExpressive('¡Seco! ¡Respuesta correcta! Ganaste veinte puntos de experiencia y diez monedas.');
    } else {
      setIsCorrect(false);
      playSound('wrong');
      speakChileanExpressive('¡Casi! Revisa el texto de arriba e inténtalo de nuevo.');
    }
  };

  const handleLaunchMinigame = () => {
    if (minigame) {
      openMinigame(minigame);
    }
  };

  return (
    <div className="mc-dialog-overlay select-none animate-fadeIn">
      <div className="mc-panel w-full max-w-xl max-h-[92vh] flex flex-col p-4 sm:p-5 shadow-2xl">
        {/* Cabecera */}
        <div className="mc-header-wood p-2.5 rounded flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{st.emoji || '🏛️'}</span>
            <div>
              <h2 className="pixel-font text-xs sm:text-sm text-amber-200 font-extrabold tracking-tight">
                {st.name}
              </h2>
              <div className="text-[11px] text-amber-300/80 font-bold">
                {st.zone || 'ESTACIÓN DE APRENDIZAJE'} • {st.badge || '2° BÁSICO'}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              stopSpeaking();
              playSound('click');
              closeModals();
            }}
            className="mc-btn mc-btn-red text-xs px-2.5 py-1 rounded font-extrabold"
          >
            ✕
          </button>
        </div>

        {/* Contenido en scroll */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {/* Historia / Explicación del NPC */}
          <div className="mc-parchment p-3 rounded text-xs sm:text-sm text-stone-900 leading-relaxed">
            {st.story}
          </div>

          {/* Cajas de detalle temático */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            {st.house && (
              <div className="mc-panel-dark p-2 rounded text-slate-200">
                <strong className="text-amber-400 block mb-0.5">{st.boxTitles?.[0] || 'Dato 1'}</strong>
                {st.house}
              </div>
            )}
            {st.food && (
              <div className="mc-panel-dark p-2 rounded text-slate-200">
                <strong className="text-emerald-400 block mb-0.5">{st.boxTitles?.[1] || 'Dato 2'}</strong>
                {st.food}
              </div>
            )}
            {st.skill && (
              <div className="mc-panel-dark p-2 rounded text-slate-200">
                <strong className="text-sky-400 block mb-0.5">{st.boxTitles?.[2] || 'Dato 3'}</strong>
                {st.skill}
              </div>
            )}
          </div>

          {/* Pregunta de Trivia Interactiva */}
          {st.question && (
            <div className="mc-parchment p-3 rounded">
              <div className="pixel-font text-[10px] text-amber-950 font-extrabold mb-2">
                ❓ PREGUNTA DE COMPROBACIÓN:
              </div>
              <p className="text-xs text-stone-900 font-bold mb-3">
                {st.question}
              </p>

              <div className="space-y-1.5">
                {(st.options || []).map((opt, i) => {
                  let btnColor = 'mc-btn-stone';
                  if (answered) {
                    if (opt.correct) btnColor = 'mc-btn-green';
                    else if (selectedOption === i) btnColor = 'mc-btn-red';
                  }

                  return (
                    <button
                      key={i}
                      disabled={answered}
                      onClick={() => handleSelectOption(i, opt)}
                      className={`w-full text-left p-2 rounded text-xs font-semibold mc-btn ${btnColor} transition-all`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className={`mt-2.5 p-2 rounded text-xs font-bold ${isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}>
                  {isCorrect
                    ? '🎉 ¡CORRECTO! +20 XP y +10 Monedas ganadas.'
                    : '❌ ¡Incorrecto! Vuelve a leer la explicación arriba.'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botón para lanzar Mini-Juego de la Estación */}
        {minigame && (
          <div className="pt-3 border-t border-stone-500">
            <button
              onClick={handleLaunchMinigame}
              className="w-full mc-btn mc-btn-gold py-2.5 rounded font-extrabold pixel-font text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <span>🎮</span>
              <span>JUGAR MINI-JUEGO: {minigame.title}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
