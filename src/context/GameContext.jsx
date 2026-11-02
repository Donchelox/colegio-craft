import React, { createContext, useContext, useState, useCallback } from 'react';
import { playSound, speakChileanExpressive } from '../services/audioService';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [currentWorld, setCurrentWorld] = useState('lobby');
  const [playerStats, setPlayerStats] = useState({
    health: 10,
    maxHealth: 10,
    xp: 65,
    level: 2,
    coins: 50
  });

  const [activeModal, setActiveModal] = useState('welcome');
  const [currentStationData, setCurrentStationData] = useState(null);
  const [currentMinigameData, setCurrentMinigameData] = useState(null);
  const [hotbarSlot, setHotbarSlot] = useState(0);
  const [compassInfo, setCompassInfo] = useState({
    yaw: 0,
    coords: { x: 0, y: 0, z: 0 },
    cardinal: 'N'
  });
  const [toast, setToast] = useState(null);
  const [toastTimeout, setToastTimeout] = useState(null);

  const showToast = useCallback((emoji, text) => {
    if (toastTimeout) clearTimeout(toastTimeout);
    setToast({ emoji, text, id: Date.now() });
    const timer = setTimeout(() => {
      setToast(null);
    }, 4500);
    setToastTimeout(timer);
  }, [toastTimeout]);

  const addXP = useCallback((amount) => {
    setPlayerStats(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      if (newXp >= 100) {
        newLevel += Math.floor(newXp / 100);
        newXp = newXp % 100;
        playSound('success');
        showToast('⭐', `¡SUBISTE DE NIVEL! Ahora eres Nivel ${newLevel} de 2° Básico.`);
      }
      return { ...prev, xp: newXp, level: newLevel };
    });
  }, [showToast]);

  const addCoins = useCallback((amount) => {
    setPlayerStats(prev => ({ ...prev, coins: prev.coins + amount }));
    playSound('coin');
  }, []);

  const enterWorld = useCallback((worldKey) => {
    setCurrentWorld(worldKey);
    playSound('teleport');

    const worldNames = {
      historia: '🏺 Puerta 1: Historia y Geografía (Pueblos Originarios)',
      ciencias: '🔬 Puerta 2: Ciencias Naturales (Cuerpo, Animales y Agua)',
      lenguaje: '📚 Puerta 3: Lenguaje y Comunicación (Cómic y Palabras)',
      matematicas: '🔢 Puerta 4: Matemáticas (Decenas y Geometría 3D)'
    };

    if (worldNames[worldKey]) {
      showToast('🚀', `Viajando a: ${worldNames[worldKey]}`);
      speakChileanExpressive(`¡Viajando al Mundo de ${worldKey}!`);
    }
  }, [showToast]);

  const returnToLobby = useCallback(() => {
    setCurrentWorld('lobby');
    playSound('teleport');
    showToast('🏰', 'Regresaste al Lobby Central.');
    speakChileanExpressive('¡Regresaste al Lobby Central con las cuatro puertas mágicas!');
  }, [showToast]);

  const openStationModal = useCallback((station) => {
    setCurrentStationData(station);
    setActiveModal('station');
    playSound('click');
    if (station && station.story) {
      speakChileanExpressive([
        { text: station.name, pitch: 1.1, rate: 1.0, pauseAfter: 200 },
        { text: station.story, pitch: 1.03, rate: 0.98 }
      ]);
    }
  }, []);

  const openMinigame = useCallback((minigame) => {
    setCurrentMinigameData(minigame);
    setActiveModal('minigame');
    playSound('success');
  }, []);

  const closeModals = useCallback(() => {
    setActiveModal(null);
    setCurrentStationData(null);
    setCurrentMinigameData(null);
  }, []);

  const value = {
    currentWorld,
    playerStats,
    activeModal,
    currentStationData,
    currentMinigameData,
    hotbarSlot,
    compassInfo,
    toast,
    setCompassInfo,
    setHotbarSlot,
    setActiveModal,
    enterWorld,
    returnToLobby,
    openStationModal,
    openMinigame,
    closeModals,
    showToast,
    addXP,
    addCoins
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame debe usarse dentro de un GameProvider');
  }
  return context;
}
