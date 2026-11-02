import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  LOBBY_DOORS,
  WORLD_STATIONS,
  UNIT_MINIGAMES,
  SUBJECT_QUIZZES
} from '../data/defaultCurriculum';
import { parseNotebookLMContent, syncFromRemoteUrl } from '../services/notebooklmSync';

const STORAGE_KEY = 'colegiocraft_knowledge_v2';
const DEFAULT_SYNC_URL = 'https://raw.githubusercontent.com/Donchelox/colegio-craft/main/src/data/notebooklm-latest.json';

const KnowledgeContext = createContext(null);

export function KnowledgeProvider({ children }) {
  const [knowledgeBase, setKnowledgeBase] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          doors: parsed.doors || LOBBY_DOORS,
          stations: parsed.stations || WORLD_STATIONS,
          minigames: parsed.minigames || UNIT_MINIGAMES,
          quizzes: parsed.quizzes || SUBJECT_QUIZZES,
          syncMetadata: parsed.syncMetadata || {
            lastSyncedAt: null,
            source: 'default_curriculum',
            syncUrl: DEFAULT_SYNC_URL,
            autoSync: true,
            syncedTopicsCount: 0
          }
        };
      }
    } catch (e) {
      console.warn('Error al cargar base de datos guardada, usando defaults:', e);
    }

    return {
      doors: LOBBY_DOORS,
      stations: WORLD_STATIONS,
      minigames: UNIT_MINIGAMES,
      quizzes: SUBJECT_QUIZZES,
      syncMetadata: {
        lastSyncedAt: null,
        source: 'default_curriculum',
        syncUrl: DEFAULT_SYNC_URL,
        autoSync: true,
        syncedTopicsCount: 0
      }
    };
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState(null);

  // Persistir cambios en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(knowledgeBase));
    } catch (e) {
      console.warn('No se pudo guardar en localStorage:', e);
    }
  }, [knowledgeBase]);

  // Aplicar datos parseados de NotebookLM a la base de conocimientos
  const applyImportedData = useCallback((importedData) => {
    setKnowledgeBase(prev => {
      const subject = importedData.subject || 'historia';
      const prevSubjectStations = prev.stations[subject] || [];

      // Mapear nuevas estaciones
      const newStations = (importedData.stations || []).map((st, idx) => ({
        ...st,
        pos: st.pos || {
          x: ((idx % 3) - 1) * 12,
          y: 0,
          z: -18 + idx * 8
        },
        color: st.color || 0x0284c7
      }));

      // Fusionar estaciones: reemplazar por id o agregar al final
      const mergedStations = [...prevSubjectStations];
      newStations.forEach(ns => {
        const existingIdx = mergedStations.findIndex(s => s.id === ns.id || s.name.toLowerCase() === ns.name.toLowerCase());
        if (existingIdx >= 0) {
          mergedStations[existingIdx] = { ...mergedStations[existingIdx], ...ns };
        } else {
          mergedStations.push(ns);
        }
      });

      // Fusionar preguntas de Quiz
      const prevQuizzes = prev.quizzes[subject] || [];
      const newQuestions = (importedData.questions || []).map(q => ({
        q: q.question,
        options: q.options.map((o, i) => `${String.fromCharCode(65 + i)}) ${o.text}`),
        correct: q.options.findIndex(o => o.correct) >= 0 ? q.options.findIndex(o => o.correct) : 0,
        explanation: '¡Excelente respuesta basada en los apuntes de NotebookLM!'
      }));

      const mergedQuizzes = [...prevQuizzes, ...newQuestions];

      const newMetadata = {
        ...prev.syncMetadata,
        lastSyncedAt: new Date().toISOString(),
        source: importedData.source || 'notebooklm_import',
        syncedTopicsCount: (prev.syncMetadata.syncedTopicsCount || 0) + newStations.length
      };

      return {
        ...prev,
        stations: {
          ...prev.stations,
          [subject]: mergedStations
        },
        quizzes: {
          ...prev.quizzes,
          [subject]: mergedQuizzes
        },
        syncMetadata: newMetadata
      };
    });
  }, []);

  // 1. Sincronizar desde texto / Markdown / JSON pegado
  const syncFromText = useCallback(async (rawText) => {
    setIsSyncing(true);
    setSyncStatusMessage('Procesando apuntes de NotebookLM...');
    try {
      const parsed = parseNotebookLMContent(rawText);
      applyImportedData(parsed);
      setSyncStatusMessage(`¡Éxito! Se sincronizaron temas para: ${parsed.subject.toUpperCase()}`);
      return { success: true, parsed };
    } catch (err) {
      setSyncStatusMessage(`Error: ${err.message}`);
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, [applyImportedData]);

  // 2. Sincronizar desde archivo (.md, .txt, .json)
  const syncFromFile = useCallback(async (file) => {
    setIsSyncing(true);
    setSyncStatusMessage(`Leyendo archivo ${file.name}...`);
    try {
      const text = await file.text();
      const parsed = parseNotebookLMContent(text);
      applyImportedData(parsed);
      setSyncStatusMessage(`¡Archivo ${file.name} sincronizado con éxito!`);
      return { success: true, parsed };
    } catch (err) {
      setSyncStatusMessage(`Error: ${err.message}`);
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, [applyImportedData]);

  // 3. Sincronizar desde URL remota
  const syncFromUrl = useCallback(async (urlToSync) => {
    const targetUrl = urlToSync || knowledgeBase.syncMetadata.syncUrl;
    if (!targetUrl) throw new Error('No se especificó URL para sincronizar');

    setIsSyncing(true);
    setSyncStatusMessage(`Consultando libros en ${targetUrl}...`);
    try {
      const parsed = await syncFromRemoteUrl(targetUrl);
      applyImportedData(parsed);
      setSyncStatusMessage('¡Sincronización remota completada con éxito!');
      return { success: true, parsed };
    } catch (err) {
      setSyncStatusMessage(`Fallo de conexión: ${err.message}`);
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, [knowledgeBase.syncMetadata.syncUrl, applyImportedData]);

  // 4. Restaurar valores por defecto (2° Básico)
  const resetToDefaults = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setKnowledgeBase({
      doors: LOBBY_DOORS,
      stations: WORLD_STATIONS,
      minigames: UNIT_MINIGAMES,
      quizzes: SUBJECT_QUIZZES,
      syncMetadata: {
        lastSyncedAt: null,
        source: 'default_curriculum',
        syncUrl: DEFAULT_SYNC_URL,
        autoSync: true,
        syncedTopicsCount: 0
      }
    });
    setSyncStatusMessage('Se restauró el currículum base oficial de 2° Básico.');
  }, []);

  // 5. Descargar respaldo JSON de conocimientos
  const exportKnowledgeJson = useCallback(() => {
    const jsonStr = JSON.stringify(knowledgeBase, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `colegiocraft-conocimientos-notebooklm-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [knowledgeBase]);

  const value = {
    knowledgeBase,
    isSyncing,
    syncStatusMessage,
    syncFromText,
    syncFromFile,
    syncFromUrl,
    resetToDefaults,
    exportKnowledgeJson,
    setSyncStatusMessage
  };

  return (
    <KnowledgeContext.Provider value={value}>
      {children}
    </KnowledgeContext.Provider>
  );
}

export function useKnowledge() {
  const context = useContext(KnowledgeContext);
  if (!context) {
    throw new Error('useKnowledge debe usarse dentro de un KnowledgeProvider');
  }
  return context;
}
