# ColegioCraft 3D - Mundos de Aprendizaje (2° Básico) 🏰🎮

Plataforma educativa 3D inspirada en **Minecraft** y la estética voxel estilizada de **Crossy Road / LEGO**, diseñada específicamente para niños de **2° Básico** en Chile.

---

## 🌟 Novedades y Mejoras Implementadas

### 1. Gráficos 3D Voxel Estilizados (Tipo Crossy Road / LEGO)
- **Iluminación Suave y Sombras PCF**: Sol cálido direccional combinado con luz hemisférica celeste para un acabado visual suave y limpio.
- **Nubes Voxel Flotantes**: Nubes tridimensionales que cruzan el horizonte suavemente sobre los 4 mundos.
- **Modelo de Jugador Detallado**: Explorador con uniforme escolar, mochila con broche dorado, ojos pixelados parpadeantes, balanceo natural al correr e idle con respiración.
- **Efectos de Partículas 3D**: Explosión de partículas al colocar o romper bloques, chispas místicas en los portales y polvo de impacto al saltar.
- **Los 4 Mundos Renovados**:
  - **Lobby Central**: Gran plaza adoquinada con farolas encendidas, 4 portales mágicos con vórtice de luz y fuente de agua central animada.
  - **Mundo 1 (Historia y Geografía)**: Cordillera con cumbres nevadas, terrazas agrícolas andinas, balsa Chango inflable, Ruka Mapuche, araucarias y Dalca con fuego interior.
  - **Mundo 2 (Ciencias Naturales)**: Gran corazón 3D animado latiendo a 70 latidos por minuto, esqueleto de sostén, laguna con rana sobre hoja de loto y mariposa con alas animadas.
  - **Mundo 3 (Lenguaje y Comunicación)**: Viñeta gigante de cómic con globo de diálogo, lupa de información explícita, árbol de palabras y castillo de cuentos.
  - **Mundo 4 (Matemáticas)**: Torres de decenas (10 pisos), unidades sueltas, símbolo de suma (+) y figuras geométricas en 3D (cubo y pirámide).

### 2. HUD y UI Estilo Minecraft Clásico Retro
- **Interfaz Auténtica de Piedra y Madera**: Paneles con bisel 3D retro (`mc-panel`), pergamino para lecturas (`mc-parchment`) y botones con respuesta táctil (`mc-btn`).
- **Hotbar Clásica de 6 Slots**: Ranuras con relieve tridimensional, selección activa iluminada y teclas rápidas (1 al 6).
- **Brújula y Radar de Coordenadas**: Brújula funcional en la esquina superior derecha que rota con el rumbo del jugador y muestra coordenadas XYZ en tiempo real.
- **Barra de Experiencia y Corazones**: 5 corazones clásicos de energía y barra de nivel de 2° Básico.
- **Música Ambiental Relajante**: Melodías suaves acústicas generadas con Tone.js para acompañar el estudio.
- **Voz Chilena Natural (`es-CL`)**: Narración auditiva de contenidos, preguntas e instrucciones pensada especialmente para estudiantes en etapa de lectura.

---

## 📁 Estructura del Proyecto

```text
Colegio Craft/
├── index.html                           # Estructura principal y HUD modular
├── colegiocraft_3d_mundos_de_2_b_sico.html # Archivo autocontenido listo para Gemini
├── package.json                         # Scripts de ejecución local
├── README.md                            # Guía de uso y documentación
├── css/
│   └── styles.css                       # Estilos Minecraft retro y animaciones
└── js/
    ├── content.js                       # Base de datos académica (4 asignaturas y 17 juegos)
    ├── audio.js                         # Tone.js, música ambiental y voz chilena
    ├── engine3d.js                      # Motor 3D Three.js voxel estilizado y nubes
    ├── minigames.js                     # Controladores de los 17 mini-juegos educativos
    ├── ui.js                            # Gestor de HUD, brújula, hotbar y modales
    └── main.js                          # Bucle principal, físicas y cambio de mundos
```

---

## 🚀 Cómo Ejecutar el Juego

### Opción 1: Servidor Local (Recomendado)
Desde la terminal en esta carpeta:
```bash
npm start
# O directamente con Python:
python3 -m http.server 8080
```
Luego abre tu navegador en: [http://localhost:8080](http://localhost:8080)

### Opción 2: Archivo Autocontenido
Abre directamente con doble clic en tu navegador el archivo:
`colegiocraft_3d_mundos_de_2_b_sico.html`
*(Este archivo contiene todo el código y estilos empaquetados en un solo lugar, ideal para compartir o adjuntar en prompts de Gemini).*

---

## ⌨️ Controles

- **Moverse**: `W, A, S, D` o Flechas del teclado (o D-Pad táctil en pantalla).
- **Mirar / Girar Cámara**: Clic y arrastrar con el ratón o deslizar en pantalla táctil.
- **Saltar**: Barra espaciadora (o botón Saltar).
- **Poner Bloque**: Tecla `E` (o botón Poner Bloque).
- **Romper Bloque**: Tecla `Q` (o botón Romper).
- **Seleccionar Bloque**: Teclas `1` a `6` o tocar los casilleros de la barra inferior.
- **Interactuar con Puerta o Guardián**: Clic directo en el cartel 3D o presionar el botón contextual al acercarse.
