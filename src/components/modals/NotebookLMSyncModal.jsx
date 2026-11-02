import React, { useState } from 'react';
import { useKnowledge } from '../../context/KnowledgeContext';
import { useGame } from '../../context/GameContext';
import { playSound, speakChileanExpressive } from '../../services/audioService';

export default function NotebookLMSyncModal() {
  const {
    knowledgeBase,
    isSyncing,
    syncStatusMessage,
    syncFromText,
    syncFromFile,
    syncFromUrl,
    resetToDefaults,
    exportKnowledgeJson
  } = useKnowledge();

  const { closeModals, showToast, addXP } = useGame();

  const [activeTab, setActiveTab] = useState('paste'); // 'paste' | 'url' | 'manage'
  const [inputText, setInputText] = useState('');
  const [remoteUrl, setRemoteUrl] = useState(
    knowledgeBase.syncMetadata?.syncUrl || 'https://raw.githubusercontent.com/Donchelox/colegio-craft/main/src/data/notebooklm-latest.json'
  );
  const [syncFeedback, setSyncFeedback] = useState(null);

  // Ejemplo precargado para facilitar la prueba inmediata
  const handleLoadSample = () => {
    const sample = `# Guía de Estudio NotebookLM: Pueblos Originarios de Chile
## Unidad: Pueblos Nómadas y Sedentarios
### El Pueblo Selk'nam de Tierra del Fuego
- **Vivienda**: Construían chozas cónicas hechas con ramas y pieles de guanaco.
- **Vestimenta y Ceremonia**: Cazaban con arco y flecha y pintaban sus cuerpos en la ceremonia del Hain.
- **Herencia**: Cristina Calderón y las tradiciones del extremo sur.

1. ¿Qué forma tenían las viviendas del pueblo Selk'nam?
a) Forma cuadrada de ladrillos
b) Forma cónica hecha con ramas y pieles (Correcta)
c) Edificios de cristal`;

    setInputText(sample);
    playSound('click');
  };

  const handleProcessText = async () => {
    if (!inputText.trim()) {
      setSyncFeedback({ type: 'error', msg: 'Pega primero los apuntes o la guía de estudio generada por NotebookLM.' });
      playSound('wrong');
      return;
    }

    try {
      const res = await syncFromText(inputText);
      playSound('success');
      addXP(25);
      showToast('⚡', `¡Conocimientos de NotebookLM sincronizados con éxito! (+25 XP)`);
      speakChileanExpressive('¡Excelente! Se sincronizaron los nuevos contenidos de NotebookLM al juego.');
      setSyncFeedback({
        type: 'success',
        msg: `¡Éxito! Se actualizaron temas y preguntas para ${res.parsed.subject.toUpperCase()} en 3D.`
      });
    } catch (e) {
      playSound('wrong');
      setSyncFeedback({ type: 'error', msg: `Error: ${e.message}` });
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await syncFromFile(file);
      playSound('success');
      addXP(25);
      showToast('📄', `¡Archivo ${file.name} sincronizado con éxito!`);
      setSyncFeedback({
        type: 'success',
        msg: `¡Archivo cargado! Se incorporaron ${res.parsed.stations.length} estaciones y ${res.parsed.questions.length} preguntas.`
      });
    } catch (err) {
      playSound('wrong');
      setSyncFeedback({ type: 'error', msg: `Error al leer archivo: ${err.message}` });
    }
  };

  const handleSyncRemote = async () => {
    if (!remoteUrl.trim()) {
      setSyncFeedback({ type: 'error', msg: 'Ingresa una URL válida.' });
      return;
    }

    try {
      const res = await syncFromUrl(remoteUrl);
      playSound('success');
      addXP(30);
      showToast('🌐', '¡Sincronización en la nube completada! (+30 XP)');
      speakChileanExpressive('¡Sincronización remota exitosa! El juego ahora tiene la última versión de tus libros.');
      setSyncFeedback({
        type: 'success',
        msg: `¡Sincronizado desde la nube! ${res.parsed.title || 'Libro actualizado'}.`
      });
    } catch (err) {
      playSound('wrong');
      setSyncFeedback({ type: 'error', msg: err.message });
    }
  };

  const handleReset = () => {
    if (window.confirm('¿Seguro que deseas restaurar los contenidos oficiales de 2° Básico?')) {
      resetToDefaults();
      playSound('place');
      showToast('🔄', 'Currículum restaurado a valores por defecto.');
    }
  };

  return (
    <div className="mc-dialog-overlay select-none animate-fadeIn">
      <div className="mc-panel w-full max-w-2xl max-h-[92vh] flex flex-col p-3 sm:p-5 shadow-2xl">
        {/* Cabecera Minecraft Roble */}
        <div className="mc-header-wood p-2.5 rounded flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <div>
              <h2 className="pixel-font text-xs sm:text-sm text-amber-200 font-extrabold tracking-tight">
                SINCRONIZADOR NOTEBOOK LM
              </h2>
              <div className="text-[11px] text-amber-300/80">
                Conecta los libros y cuadernos de estudio con ColegioCraft 3D
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              playSound('click');
              closeModals();
            }}
            className="mc-btn mc-btn-red text-xs px-2.5 py-1 rounded font-extrabold"
          >
            ✕
          </button>
        </div>

        {/* Pestañas Superiores */}
        <div className="flex items-center gap-1.5 mb-3">
          <button
            onClick={() => {
              playSound('click');
              setActiveTab('paste');
            }}
            className={`mc-btn text-[11px] font-bold px-3 py-1.5 rounded flex-1 ${
              activeTab === 'paste' ? 'mc-btn-green' : 'mc-btn-stone'
            }`}
          >
            📥 Pegar / Subir Apuntes
          </button>
          <button
            onClick={() => {
              playSound('click');
              setActiveTab('url');
            }}
            className={`mc-btn text-[11px] font-bold px-3 py-1.5 rounded flex-1 ${
              activeTab === 'url' ? 'mc-btn-green' : 'mc-btn-stone'
            }`}
          >
            🌐 URL Remota (Nube)
          </button>
          <button
            onClick={() => {
              playSound('click');
              setActiveTab('manage');
            }}
            className={`mc-btn text-[11px] font-bold px-3 py-1.5 rounded flex-1 ${
              activeTab === 'manage' ? 'mc-btn-green' : 'mc-btn-stone'
            }`}
          >
            📚 Libros y Respaldo
          </button>
        </div>

        {/* Mensaje de Estado / Feedback */}
        {syncFeedback && (
          <div
            className={`p-2 rounded text-xs font-bold mb-3 flex items-center justify-between ${
              syncFeedback.type === 'success'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                : 'bg-rose-950 text-rose-300 border border-rose-600'
            }`}
          >
            <span>{syncFeedback.msg}</span>
            <button onClick={() => setSyncFeedback(null)} className="text-white hover:text-amber-300 px-1">
              ✕
            </button>
          </div>
        )}

        {/* CONTENIDO PESTAÑA 1: PEGAR / SUBIR APUNTES */}
        {activeTab === 'paste' && (
          <div className="flex-1 overflow-y-auto space-y-3">
            <div className="mc-parchment p-3 rounded text-xs text-amber-950 leading-relaxed">
              <strong>¿Cómo funciona?</strong> Abre tu libreta en <strong>Google NotebookLM</strong>, genera una <em>Guía de Estudio</em>, <em>Preguntas Frecuentes</em> o <em>Quiz</em>, y copia el texto aquí (o sube el archivo descargado).
            </div>

            <div className="flex items-center justify-between">
              <label className="pixel-font text-[10px] text-stone-800 font-extrabold">
                CONTENIDO DE NOTEBOOK LM (MARKDOWN / TEXTO / JSON):
              </label>
              <button
                onClick={handleLoadSample}
                className="mc-btn mc-btn-gold text-[10px] font-bold px-2 py-0.5 rounded"
              >
                Cargar Ejemplo
              </button>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="# Guía de Estudio NotebookLM: ...&#10;## Unidad: ...&#10;### Tema...&#10;- Concepto...&#10;&#10;1. ¿Pregunta?&#10;a) Opción&#10;b) Opción (Correcta)"
              className="w-full h-44 p-3 bg-stone-900 border-2 border-stone-700 text-stone-100 rounded font-mono text-xs focus:outline-none focus:border-amber-400"
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="mc-btn mc-btn-stone text-xs font-bold px-3 py-1.5 rounded cursor-pointer flex items-center gap-1.5">
                <span>📁</span>
                <span>Subir archivo (.md, .txt, .json)</span>
                <input
                  type="file"
                  accept=".md,.txt,.json,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleProcessText}
                disabled={isSyncing}
                className="mc-btn mc-btn-green text-xs font-extrabold px-5 py-2 rounded flex items-center gap-2 shadow-lg"
              >
                <span>{isSyncing ? '⏳' : '⚡'}</span>
                <span>{isSyncing ? 'SINCRONIZANDO...' : 'SINCRONIZAR AL JUEGO 3D'}</span>
              </button>
            </div>
          </div>
        )}

        {/* CONTENIDO PESTAÑA 2: URL REMOTA / API */}
        {activeTab === 'url' && (
          <div className="flex-1 overflow-y-auto space-y-4">
            <div className="mc-parchment p-3 rounded text-xs text-amber-950 leading-relaxed">
              <strong>Auto-Actualización desde la Nube:</strong> Configura una URL de GitHub Raw, Google Apps Script o API donde publiques las exportaciones de NotebookLM. La app descargará los cambios automáticamente.
            </div>

            <div>
              <label className="block pixel-font text-[10px] text-stone-800 font-extrabold mb-1">
                URL REMOTA DE SINCRONIZACIÓN (JSON O MARKDOWN):
              </label>
              <input
                type="url"
                value={remoteUrl}
                onChange={(e) => setRemoteUrl(e.target.value)}
                placeholder="https://raw.githubusercontent.com/.../notebooklm-latest.json"
                className="w-full p-2.5 bg-stone-900 border-2 border-stone-700 text-stone-100 rounded font-mono text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="mc-panel-dark p-3 rounded space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Última sincronización:</span>
                <strong className="text-amber-300">
                  {knowledgeBase.syncMetadata?.lastSyncedAt
                    ? new Date(knowledgeBase.syncMetadata.lastSyncedAt).toLocaleString()
                    : 'Sin sincronizaciones aún'}
                </strong>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Temas sincronizados:</span>
                <strong className="text-emerald-400">
                  {knowledgeBase.syncMetadata?.syncedTopicsCount || 0} temas nuevos
                </strong>
              </div>
            </div>

            <button
              onClick={handleSyncRemote}
              disabled={isSyncing}
              className="w-full mc-btn mc-btn-blue text-xs font-extrabold py-2.5 rounded flex items-center justify-center gap-2 shadow-lg"
            >
              <span>{isSyncing ? '⏳' : '🔄'}</span>
              <span>{isSyncing ? 'CONSULTANDO LIBROS EN LA NUBE...' : 'SINCRONIZAR AHORA DESDE LA URL'}</span>
            </button>
          </div>
        )}

        {/* CONTENIDO PESTAÑA 3: GESTIÓN Y RESPALDO */}
        {activeTab === 'manage' && (
          <div className="flex-1 overflow-y-auto space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {['historia', 'ciencias', 'lenguaje', 'matematicas'].map(subj => {
                const count = (knowledgeBase.stations[subj] || []).length;
                const qCount = (knowledgeBase.quizzes[subj] || []).length;
                return (
                  <div key={subj} className="mc-parchment p-3 rounded">
                    <div className="pixel-font text-[10px] text-amber-950 font-extrabold uppercase">
                      {subj}
                    </div>
                    <div className="text-xs text-slate-800 mt-1">
                      • {count} Estaciones 3D<br />
                      • {qCount} Preguntas Quiz
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-400">
              <button
                onClick={exportKnowledgeJson}
                className="mc-btn mc-btn-gold text-xs font-bold px-4 py-2 rounded flex-1 flex items-center justify-center gap-2"
              >
                <span>💾</span>
                <span>DESCARGAR RESPALDO JSON</span>
              </button>

              <button
                onClick={handleReset}
                className="mc-btn mc-btn-red text-xs font-bold px-4 py-2 rounded flex-1 flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>RESTAURAR 2° BÁSICO</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
