# ColegioCraft 3D - Mundos de Aprendizaje (2° Básico) 🏰🎮

Plataforma educativa interactiva en **React.js** y **Three.js** con estética voxel estilo **Minecraft** y **Crossy Road**, diseñada para niños de **2° Básico** en Chile con **sincronización dinámica de conocimientos desde Google NotebookLM**.

---

## 🌟 Novedades y Características Principales

### 1. Arquitectura Moderna en React.js + Vite + Three.js
- **Motor Gráfico Voxel en Three.js**: Integrado mediante React Canvas Ref con sombras suaves PCF, iluminación diorama cálida y cielo con nubes procedimentales.
- **Personaje Voxel Infantil (Camiseta Arsenal)**: Modelado de micro-voxel con uniforme de fútbol rojo y blanco, pantalón corto azul marino, zapatillas deportivas y peinado a capas con flequillo.
- **Orientación Correcta hacia Adelante**: Rostro, ojos, nariz y pecho mirando hacia `-Z` para que la cámara en 3ra persona siga su espalda mientras corre hacia el horizonte.
- **HUD Minecraft Retro**: Paneles de piedra (`mc-panel`), pergamino de estudio (`mc-parchment`), barra de 10 corazones, barra de XP con nivel, coordenadas y brújula.
- **Audio Tone.js & Voz Chilena (`es-CL`)**: Efectos acústicos, música relajante C418 y síntesis de voz chilena natural para apoyo a la lectura infantil.

---

### 2. Sincronización Dinámica con Google NotebookLM ⚡
La aplicación permite mantener siempre actualizados los contenidos del juego directamente desde tus notas, libros y resúmenes de **NotebookLM**:

1. **Gestor de Importación en la App**:
   - Pega directamente guías de estudio, preguntas frecuentes o quizzes exportados desde NotebookLM.
   - Sube archivos `.md`, `.txt` o `.json`.
   - El analizador inteligente (`notebooklmSync.js`) detecta la asignatura, genera nuevas estaciones 3D y actualiza las preguntas de comprobación en tiempo real.
2. **Sincronización Remota (Nube / GitHub / API)**:
   - Configura una URL remota (por ejemplo, el archivo raw en GitHub o una API).
   - Presiona **"Sincronizar Ahora"** para descargar las últimas actualizaciones de los libros sin necesidad de recompilar.
3. **Persistencia Local**:
   - Los datos se guardan en el navegador (`localStorage`) para jugar offline.
   - Incluye botón para descargar respaldo JSON y para restaurar los contenidos oficiales de 2° Básico cuando quieras.

---

## 📁 Estructura del Proyecto

```text
Colegio Craft/
├── index.html                           # Entry point HTML de Vite
├── vite.config.js                       # Configuración de Vite con React
├── package.json                         # Dependencias (react, three, tone, vite)
├── src/
│   ├── main.jsx                         # Punto de montaje React
│   ├── App.jsx                          # Componente raíz y enrutador de modales
│   ├── context/
│   │   ├── KnowledgeContext.jsx         # Estado global de contenidos y sync con NotebookLM
│   │   └── GameContext.jsx              # Estado del jugador, mundo activo y HUD
│   ├── components/
│   │   ├── Canvas3D.jsx                 # Motor Three.js, personaje niño y mundos dinámicos
│   │   ├── HUD.jsx                      # Interfaz Minecraft, corazones, XP y brújula
│   │   └── modals/
│   │       ├── NotebookLMSyncModal.jsx  # Hub de sincronización de NotebookLM
│   │       ├── NotebookModal.jsx        # Cuaderno de estudio interactivo con voz
│   │       ├── NpcStationModal.jsx      # Diálogo con NPCs y trivias de comprobación
│   │       ├── MinigameModal.jsx        # Ejecutor de mini-juegos educativos
│   │       └── WelcomeModal.jsx         # Pantalla de bienvenida
│   ├── services/
│   │   ├── audioService.js              # Sintetizadores Tone.js y Web Speech es-CL
│   │   └── notebooklmSync.js            # Parser y sincronizador de NotebookLM
│   ├── data/
│   │   ├── defaultCurriculum.js         # Base de datos curricular 2° Básico
│   │   └── notebooklm-latest.json       # Endpoint de ejemplo para sync remota
│   └── styles/
│       └── minecraft.css                # Estilos retro de Minecraft y Tailwind
```

---

## 🚀 Cómo Ejecutar Localmente

```bash
# 1. Instalar dependencias (si es primera vez)
npm install

# 2. Iniciar servidor de desarrollo con Vite
npm run dev

# 3. Compilar para producción
npm run build
```

---

## 🔗 Repositorio Git
- **GitHub:** [https://github.com/Donchelox/colegio-craft](https://github.com/Donchelox/colegio-craft)
