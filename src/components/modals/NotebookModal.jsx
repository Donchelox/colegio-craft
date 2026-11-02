import React, { useState } from 'react';
import { useKnowledge } from '../../context/KnowledgeContext';
import { useGame } from '../../context/GameContext';
import { playSound, speakChileanExpressive, stopSpeaking } from '../../services/audioService';

export default function NotebookModal() {
  const { closeModals } = useGame();
  const { knowledgeBase } = useKnowledge();
  const [selectedSubject, setSelectedSubject] = useState('historia');

  const subjects = [
    { key: 'historia', name: '🏺 Historia', color: 'mc-btn-gold' },
    { key: 'ciencias', name: '🔬 Ciencias', color: 'mc-btn-green' },
    { key: 'lenguaje', name: '📚 Lenguaje', color: 'mc-btn-blue' },
    { key: 'matematicas', name: '🔢 Matemáticas', color: 'mc-btn-wood' }
  ];

  const handleSpeakSummary = () => {
    playSound('click');
    const texts = {
      historia: [
        { text: 'Resumen de Historia y Geografía de segundo básico.', pitch: 1.08, rate: 1.0, pauseAfter: 200 },
        { text: 'Los pueblos originarios de Chile se dividen en nómadas y sedentarios. Los nómadas como los Changos, Chonos y Selknam se trasladaban cazando y pescando. Los sedentarios como los Aymaras y Mapuches vivían en aldeas fijas cultivando la tierra.', pitch: 1.03, rate: 0.98 }
      ],
      ciencias: [
        { text: 'Resumen de Ciencias Naturales.', pitch: 1.08, rate: 1.0, pauseAfter: 200 },
        { text: 'El corazón bombea sangre setenta veces por minuto. El ejercicio durante sesenta minutos al día fortalece nuestros huesos y músculos. Los animales vertebrados tienen columna vertebral, y los invertebrados como los insectos y arañas son artrópodos con patas articuladas.', pitch: 1.03, rate: 0.98 }
      ],
      lenguaje: [
        { text: 'Resumen de Lenguaje y Comunicación.', pitch: 1.08, rate: 1.0, pauseAfter: 200 },
        { text: 'El cómic es un texto literario con viñetas, globos de diálogo y onomatopeyas. Para localizar información explícita, primero leemos el texto, luego la pregunta, buscamos y subrayamos la respuesta en el texto.', pitch: 1.03, rate: 0.98 }
      ],
      matematicas: [
        { text: 'Resumen de Matemáticas de segundo básico.', pitch: 1.08, rate: 1.0, pauseAfter: 200 },
        { text: 'Una decena equivale a diez unidades. El cubo geométrico tiene seis caras cuadradas idénticas, ocho vértices y doce aristas.', pitch: 1.03, rate: 0.98 }
      ]
    };

    speakChileanExpressive(texts[selectedSubject] || texts.historia);
  };

  const currentStations = knowledgeBase.stations[selectedSubject] || [];

  return (
    <div className="mc-dialog-overlay select-none animate-fadeIn">
      <div className="mc-panel w-full max-w-2xl max-h-[92vh] flex flex-col p-4 sm:p-5 shadow-2xl">
        {/* Cabecera */}
        <div className="mc-header-wood p-2.5 rounded flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <div>
              <h2 className="pixel-font text-xs sm:text-sm text-amber-200 font-extrabold tracking-tight">
                CUADERNO DE ESTUDIO OFICIAL
              </h2>
              <div className="text-[11px] text-amber-300/80">
                Alineado al currículum nacional y sincronizado con NotebookLM
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

        {/* Pestañas de Asignaturas */}
        <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1">
          {subjects.map(s => (
            <button
              key={s.key}
              onClick={() => {
                stopSpeaking();
                playSound('click');
                setSelectedSubject(s.key);
              }}
              className={`mc-btn text-xs font-bold px-3 py-1.5 rounded flex-1 whitespace-nowrap ${
                selectedSubject === s.key ? s.color : 'mc-btn-stone opacity-75'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Barra de audio lectura */}
        <div className="flex items-center justify-between mc-panel-dark px-3 py-2 rounded mb-3">
          <span className="text-xs text-slate-200 font-semibold">
            Voz Chilena Natural de Apoyo al Estudio:
          </span>
          <button
            onClick={handleSpeakSummary}
            className="mc-btn mc-btn-blue text-[11px] font-bold px-3 py-1 rounded flex items-center gap-1.5 shadow"
          >
            <span>🔊</span>
            <span>Escuchar Resumen</span>
          </button>
        </div>

        {/* Contenido temático en pergamino */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {currentStations.map((st, i) => (
            <div key={st.id || i} className="mc-parchment p-3.5 rounded shadow">
              <div className="flex items-center justify-between mb-1.5">
                <div className="pixel-font text-[11px] text-amber-950 font-extrabold flex items-center gap-1.5">
                  <span>{st.emoji || '⭐'}</span>
                  <span>{st.name}</span>
                </div>
                {st.badge && (
                  <span className="bg-amber-800 text-amber-100 text-[9px] px-2 py-0.5 rounded font-bold">
                    {st.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-800 leading-relaxed mb-2">
                {st.story}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                {st.house && (
                  <div className="bg-amber-100/70 p-2 rounded border border-amber-300/80">
                    <strong>{st.boxTitles?.[0] || 'Tema 1'}:</strong> {st.house}
                  </div>
                )}
                {st.food && (
                  <div className="bg-amber-100/70 p-2 rounded border border-amber-300/80">
                    <strong>{st.boxTitles?.[1] || 'Tema 2'}:</strong> {st.food}
                  </div>
                )}
                {st.skill && (
                  <div className="bg-amber-100/70 p-2 rounded border border-amber-300/80">
                    <strong>{st.boxTitles?.[2] || 'Tema 3'}:</strong> {st.skill}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
