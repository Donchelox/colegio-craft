import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { KnowledgeProvider } from './context/KnowledgeContext';
import Canvas3D from './components/Canvas3D';
import HUD from './components/HUD';
import WelcomeModal from './components/modals/WelcomeModal';
import NotebookLMSyncModal from './components/modals/NotebookLMSyncModal';
import NotebookModal from './components/modals/NotebookModal';
import NpcStationModal from './components/modals/NpcStationModal';
import MinigameModal from './components/modals/MinigameModal';
import './styles/minecraft.css';

function GameScreen() {
  const { activeModal } = useGame();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none font-sans">
      {/* Motor Gráfico Three.js */}
      <Canvas3D />

      {/* Interfaz de Usuario / HUD Minecraft Clásico Retro */}
      <HUD />

      {/* Modales Interactivos */}
      {activeModal === 'welcome' && <WelcomeModal />}
      {activeModal === 'notebooklm_sync' && <NotebookLMSyncModal />}
      {activeModal === 'notebook' && <NotebookModal />}
      {activeModal === 'station' && <NpcStationModal />}
      {activeModal === 'minigame' && <MinigameModal />}
    </div>
  );
}

export default function App() {
  return (
    <KnowledgeProvider>
      <GameProvider>
        <GameScreen />
      </GameProvider>
    </KnowledgeProvider>
  );
}
