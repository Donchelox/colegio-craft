/**
 * ColegioCraft 3D - Gestor de Interfaz de Usuario (HUD, Modales y Brújula)
 * Estilo Minecraft Retro Clásico con micro-animaciones y soporte móvil.
 */

window.completedStations = new Set();
window.totalScore = 0;
window.minigamePoints = 0;
window.selectedBlockIndex = 0;
window.currentNpc = null;
window.nearestTarget = null;
window.currentWorld = 'lobby';

window.currentMinigameSubject = 'historia';
window.currentMinigameId = 'hist_aymara';

window.currentQuizSubject = 'historia';
window.currentQuizIdx = 0;
window.quizCorrectCount = 0;

// Actualización del HUD superior
function updateHUD() {
    const medalsEl = document.getElementById('hud-medals');
    const starsEl = document.getElementById('hud-stars');
    const xpFillEl = document.getElementById('hud-xp-fill');

    const totalStations = Object.values(WORLD_STATIONS).reduce((acc, list) => acc + list.length, 0);
    const count = window.completedStations.size;

    if (medalsEl) medalsEl.innerHTML = `<i class="fa-solid fa-medal mr-1 text-amber-400"></i>Medallas: ${count}/${totalStations}`;
    if (starsEl) starsEl.innerHTML = `<i class="fa-solid fa-star mr-1 text-yellow-300"></i>Puntos: ${window.totalScore}`;

    if (xpFillEl) {
        const percent = Math.min(100, Math.round((count / Math.max(1, totalStations)) * 100));
        xpFillEl.style.width = `${percent}%`;
    }
}

// Actualización de la Brújula / Radar (Dirección y Coordenadas)
function updateCompassHUD(playerPos, yawAngle) {
    const needle = document.getElementById('compass-needle');
    const coordsEl = document.getElementById('compass-coords');
    const dirEl = document.getElementById('compass-direction');

    if (needle) {
        needle.style.transform = `rotate(${-yawAngle * (180 / Math.PI)}deg)`;
    }

    if (coordsEl && playerPos) {
        coordsEl.textContent = `XYZ: ${Math.round(playerPos.x)}, ${Math.round(playerPos.y)}, ${Math.round(playerPos.z)}`;
    }

    if (dirEl) {
        // Normalizar ángulo en 8 puntos cardinales
        let deg = (yawAngle * (180 / Math.PI)) % 360;
        if (deg < 0) deg += 360;
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
        const idx = Math.round(deg / 45) % 8;
        dirEl.textContent = directions[idx];
    }
}

// Notificación Toast educativa estilo Minecraft
function showToast(icon, text) {
    const toast = document.getElementById('toast-msg');
    const iconEl = document.getElementById('toast-icon');
    const textEl = document.getElementById('toast-text');
    if (!toast || !iconEl || !textEl) return;

    iconEl.textContent = icon;
    textEl.textContent = text;
    toast.classList.remove('opacity-0', 'translate-y-2');
    toast.classList.add('opacity-100', 'translate-y-0');

    setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-2');
    }, 3200);
}

// Otorgar medalla al completar una estación
function awardStationMedal(stationId, name) {
    if (!window.completedStations.has(stationId)) {
        window.completedStations.add(stationId);
        window.totalScore += 50;
        updateHUD();
        showToast('🏅', `¡Ganaste la Medalla de ${name}! (+50 Puntos)`);
        playSound('success');

        const checkEl = document.getElementById(`check-${stationId}`);
        if (checkEl) checkEl.classList.remove('hidden');
    }
}

// Selección de bloque en la Hotbar
function selectBlock(index) {
    window.selectedBlockIndex = index;
    for (let i = 0; i < 6; i++) {
        const slot = document.getElementById(`slot-${i}`);
        if (slot) {
            if (i === index) slot.classList.add('active');
            else slot.classList.remove('active');
        }
    }
    const infoBanner = document.getElementById('block-info-banner');
    if (infoBanner && VOXEL_BLOCKS[index]) {
        infoBanner.textContent = `${VOXEL_BLOCKS[index].name}: ${VOXEL_BLOCKS[index].desc}`;
    }
    playSound('place');
}

// Acciones de colocar y romper bloques del usuario
function placeVoxelBlock() {
    if (!playerGroup) return;
    const forwardDist = 3.2;
    const dirX = -Math.sin(playerGroup.rotation.y);
    const dirZ = -Math.cos(playerGroup.rotation.y);
    const bx = Math.round(playerGroup.position.x + dirX * forwardDist);
    const bz = Math.round(playerGroup.position.z + dirZ * forwardDist);

    let by = 0.5;
    userBlocks.forEach(b => {
        if (Math.round(b.position.x) === bx && Math.round(b.position.z) === bz) {
            by = Math.max(by, b.position.y + 1.0);
        }
    });

    const blockData = VOXEL_BLOCKS[window.selectedBlockIndex || 0];
    const mesh = addVoxel(scene, bx, by, bz, 1, 1, 1, blockData.color, blockData.emissive || 0x000000);
    userBlocks.push(mesh);
    playSound('place');
    spawnBlockParticles(bx, by, bz, blockData.color);
    showToast('🧱', `Construiste: ${blockData.name.split(':')[0]}`);
}

function removeVoxelBlock() {
    if (userBlocks.length === 0) {
        showToast('⛏️', 'Primero coloca bloques con "Poner Bloque (E)" para poder romperlos.');
        return;
    }
    const removed = userBlocks.pop();
    spawnBlockParticles(removed.position.x, removed.position.y, removed.position.z, 0xa8a29e);
    scene.remove(removed);
    playSound('break');
}

function jumpPlayer() {
    if (isGrounded) {
        playerVelocityY = 0.25;
        isGrounded = false;
        playSound('jump');
    }
}

// Modal 1: Diálogo con Estación / Guardián NPC
function openNpcModal(station) {
    window.currentNpc = station;
    playSound('place');

    document.getElementById('npc-emoji').textContent = station.emoji;
    document.getElementById('npc-zone-badge').textContent = station.zone;
    document.getElementById('npc-lifestyle-badge').textContent = station.badge;
    document.getElementById('npc-name').textContent = station.name;
    document.getElementById('npc-story').textContent = station.story;

    if (station.boxTitles) {
        document.getElementById('npc-box1-title').textContent = station.boxTitles[0];
        document.getElementById('npc-box2-title').textContent = station.boxTitles[1];
        document.getElementById('npc-box3-title').textContent = station.boxTitles[2];
    }

    document.getElementById('npc-house').textContent = station.house;
    document.getElementById('npc-food').textContent = station.food;
    document.getElementById('npc-skill').textContent = station.skill;
    document.getElementById('npc-question').textContent = station.question;

    const mg = UNIT_MINIGAMES[station.id];
    if (mg) {
        document.getElementById('npc-minigame-icon').textContent = mg.emoji;
        document.getElementById('npc-minigame-title').textContent = `${mg.mechanicName}: ${mg.title}`;
    }

    const statusEl = document.getElementById('npc-medal-status');
    if (window.completedStations.has(station.id)) {
        statusEl.innerHTML = '🏅 ¡Medalla Ganada!';
        statusEl.className = 'pixel-font text-[10px] bg-emerald-500 text-slate-950 font-extrabold px-3 py-1 rounded';
    } else {
        statusEl.textContent = 'Pendiente';
        statusEl.className = 'pixel-font text-[10px] bg-slate-800 px-3 py-1 rounded text-slate-300';
    }

    const optionsEl = document.getElementById('npc-options');
    optionsEl.innerHTML = '';
    const feedbackEl = document.getElementById('npc-feedback');
    feedbackEl.classList.add('hidden');

    station.options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.className = 'mc-btn mc-panel-dark w-full text-left font-semibold text-xs sm:text-sm p-3.5 rounded';
        btn.textContent = opt.text;
        btn.onclick = () => checkNpcAnswer(station, opt.correct, btn);
        optionsEl.appendChild(btn);
    });

    const modal = document.getElementById('npc-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    speakCurrentNpc();
}

function checkNpcAnswer(station, isCorrect, btnEl) {
    const feedbackEl = document.getElementById('npc-feedback');
    feedbackEl.classList.remove('hidden');

    if (isCorrect) {
        playSound('success');
        btnEl.className = 'mc-btn mc-btn-green w-full text-left font-extrabold text-xs sm:text-sm p-3.5 rounded';
        feedbackEl.className = 'mt-3 text-xs sm:text-sm font-bold p-3 rounded mc-parchment border-2 border-emerald-600 text-emerald-950';
        feedbackEl.innerHTML = `🎉 ¡Seco! ¡Excelente respuesta! Ganaste la medalla de <strong>${station.name}</strong>. ¡Juega también su Mini-Juego!`;

        speakChileanExpressive([
            { text: '¡Seco! ¡Te pasaste!', pitch: 1.1, rate: 1.02, pauseAfter: 140 },
            { text: `Respuesta súper correcta. Ganaste la medalla de ${station.name}.`, pitch: 1.04, rate: 0.99 }
        ]);

        awardStationMedal(station.id, station.name);
    } else {
        playSound('wrong');
        btnEl.className = 'mc-btn mc-btn-red w-full text-left font-bold text-xs sm:text-sm p-3.5 rounded';
        feedbackEl.className = 'mt-3 text-xs sm:text-sm font-bold p-3 rounded mc-parchment border-2 border-rose-600 text-rose-950';
        feedbackEl.textContent = '💡 ¡Casi casi! Revisa las tarjetas de arriba e intenta con otra alternativa.';
        speakChileanExpressive('¡Uy, casi casi! Mira bien las pistas de arriba y prueba con otra alternativa.');
    }
}

function closeNpcModal() {
    stopAllSpeech();
    const modal = document.getElementById('npc-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function openUnitMinigameFromNpc() {
    if (!window.currentNpc) return;
    const stId = window.currentNpc.id;
    closeNpcModal();
    openMinigameById(stId);
}

function speakCurrentNpc() {
    if (!window.currentNpc) return;
    const s = window.currentNpc;
    speakChileanExpressive([
        { text: `${s.name}.`, pitch: 1.07, rate: 0.99, pauseAfter: 180 },
        { text: s.story, pitch: 1.02, rate: 0.97, pauseAfter: 220 },
        { text: `${s.house}`, pitch: 1.03, rate: 0.97, pauseAfter: 200 },
        { text: `${s.food}`, pitch: 1.04, rate: 0.97, pauseAfter: 200 },
        { text: `${s.skill}`, pitch: 1.05, rate: 0.98, pauseAfter: 240 },
        { text: `Pregunta para ganar la medalla: ${s.question}`, pitch: 1.07, rate: 0.97 }
    ]);
}

// Modal 2: Centro de 17 Mini-Juegos
function openClassifierModal() {
    playSound('place');
    const defaultSubj = (window.currentWorld === 'ciencias' || window.currentWorld === 'lenguaje' || window.currentWorld === 'matematicas')
        ? window.currentWorld : 'historia';
    selectMinigameSubject(defaultSubj);
    const modal = document.getElementById('classifier-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function openMinigameById(mgId) {
    const mg = UNIT_MINIGAMES[mgId];
    if (!mg) return;
    playSound('place');
    window.currentMinigameSubject = mg.subject;
    window.currentMinigameId = mgId;
    const modal = document.getElementById('classifier-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    renderMinigameNavigation();
    loadUnitMinigame(mgId);
}

function closeClassifierModal() {
    clearMinigameTimers();
    stopAllSpeech();
    const modal = document.getElementById('classifier-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function selectMinigameSubject(subj) {
    window.currentMinigameSubject = subj;
    const stations = WORLD_STATIONS[subj] || [];
    if (stations.length > 0) {
        window.currentMinigameId = stations[0].id;
    }
    renderMinigameNavigation();
    if (window.currentMinigameId) loadUnitMinigame(window.currentMinigameId);
}

function renderMinigameNavigation() {
    ['historia', 'ciencias', 'lenguaje', 'matematicas'].forEach(k => {
        const btn = document.getElementById(`tab-mg-${k}`);
        if (btn) {
            if (k === window.currentMinigameSubject) {
                btn.className = 'mc-btn mc-btn-gold pixel-font text-[10px] px-3 py-2 rounded';
            } else {
                btn.className = 'mc-btn pixel-font text-[10px] px-3 py-2 rounded';
            }
        }
    });

    const unitContainer = document.getElementById('mg-unit-selector');
    if (!unitContainer) return;
    unitContainer.innerHTML = '';
    const stations = WORLD_STATIONS[window.currentMinigameSubject] || [];

    stations.forEach((st, idx) => {
        const mg = UNIT_MINIGAMES[st.id] || { emoji: '🎮', mechanicName: 'Desafío', title: st.name };
        const isSelected = st.id === window.currentMinigameId;
        const isDone = window.completedStations.has(st.id);
        const btn = document.createElement('button');
        btn.className = isSelected
            ? 'mc-btn mc-btn-purple text-xs font-extrabold px-3 py-1.5 rounded flex items-center gap-1.5'
            : 'mc-btn mc-parchment text-slate-900 text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5';
        btn.innerHTML = `<span>${mg.emoji}</span> <span>U${idx + 1}: ${mg.mechanicName.replace(/^[^\s]+\s/, '')}</span> ${isDone ? '🏅' : ''}`;
        btn.onclick = () => {
            window.currentMinigameId = st.id;
            renderMinigameNavigation();
            loadUnitMinigame(st.id);
        };
        unitContainer.appendChild(btn);
    });
}

// Modal 3: Modo Prueba y Tickets de Salida
function openQuizModal() {
    playSound('place');
    window.currentQuizIdx = 0;
    window.quizCorrectCount = 0;
    const modal = document.getElementById('quiz-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    renderQuizSubjectTabs();
    loadQuizQuestion();
}

function closeQuizModal() {
    stopAllSpeech();
    const modal = document.getElementById('quiz-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function switchQuizSubject(subj) {
    window.currentQuizSubject = subj;
    window.currentQuizIdx = 0;
    window.quizCorrectCount = 0;
    renderQuizSubjectTabs();
    loadQuizQuestion();
}

function renderQuizSubjectTabs() {
    ['historia', 'ciencias', 'lenguaje', 'matematicas'].forEach(k => {
        const btn = document.getElementById(`tab-quiz-${k}`);
        if (btn) {
            if (k === window.currentQuizSubject) {
                btn.className = 'mc-btn mc-btn-gold pixel-font text-[10px] px-3 py-1.5 rounded';
            } else {
                btn.className = 'mc-btn pixel-font text-[10px] px-3 py-1.5 rounded';
            }
        }
    });
}

function loadQuizQuestion() {
    const questions = QUIZ_SETS[window.currentQuizSubject || 'historia'];
    if (!questions || window.currentQuizIdx >= questions.length) {
        showQuizFinish(questions ? questions.length : 0);
        return;
    }

    const q = questions[window.currentQuizIdx];
    document.getElementById('quiz-progress').textContent = `Pregunta ${window.currentQuizIdx + 1} de ${questions.length}`;
    document.getElementById('quiz-score-label').textContent = `Puntaje: ${window.quizCorrectCount} correctas`;
    document.getElementById('quiz-question').textContent = q.q;

    const optsEl = document.getElementById('quiz-options');
    optsEl.innerHTML = '';
    const feedbackEl = document.getElementById('quiz-feedback');
    feedbackEl.classList.add('hidden');

    q.options.forEach((optText, optIdx) => {
        const btn = document.createElement('button');
        btn.className = 'mc-btn mc-panel-dark w-full text-left font-semibold text-xs sm:text-sm p-3.5 rounded';
        btn.textContent = optText;
        btn.onclick = () => checkQuizAnswer(optIdx, q, btn);
        optsEl.appendChild(btn);
    });

    speakQuizQuestion();
}

function checkQuizAnswer(chosenIdx, q, btnEl) {
    const feedbackEl = document.getElementById('quiz-feedback');
    feedbackEl.classList.remove('hidden');

    if (chosenIdx === q.correct) {
        playSound('success');
        window.quizCorrectCount++;
        window.totalScore += 20;
        updateHUD();
        document.getElementById('quiz-score-label').textContent = `Puntaje: ${window.quizCorrectCount} correctas`;
        btnEl.className = 'mc-btn mc-btn-green w-full text-left font-extrabold text-xs sm:text-sm p-3.5 rounded';
        feedbackEl.className = 'mt-3 p-3 rounded mc-parchment border-2 border-emerald-600 text-emerald-950 font-bold text-xs sm:text-sm';
        feedbackEl.innerHTML = `🎉 ${q.explanation}`;
        speakChileanExpressive(q.explanation);
    } else {
        playSound('wrong');
        btnEl.className = 'mc-btn mc-btn-red w-full text-left font-bold text-xs sm:text-sm p-3.5 rounded';
        feedbackEl.className = 'mt-3 p-3 rounded mc-parchment border-2 border-rose-600 text-rose-950 font-bold text-xs sm:text-sm';
        feedbackEl.textContent = '💡 ¡Casi! Revisa las alternativas e inténtalo nuevamente.';
    }
}

function nextQuizQuestion() {
    window.currentQuizIdx++;
    loadQuizQuestion();
}

function speakQuizQuestion() {
    const questions = QUIZ_SETS[window.currentQuizSubject];
    if (!questions || !questions[window.currentQuizIdx]) return;
    const q = questions[window.currentQuizIdx];
    speakChileanExpressive([
        { text: `Pregunta número ${window.currentQuizIdx + 1}.`, pitch: 1.07, rate: 0.99, pauseAfter: 150 },
        { text: q.q, pitch: 1.03, rate: 0.97 }
    ]);
}

function showQuizFinish(total) {
    document.getElementById('quiz-question').innerHTML = `
        <div class="text-center py-4">
            <span class="text-5xl">🏆</span>
            <h3 class="text-xl font-extrabold text-slate-900 mt-2">¡Completaste la Prueba!</h3>
            <p class="text-sm font-bold text-emerald-800 mt-1">Obtuviste ${window.quizCorrectCount} de ${total} preguntas correctas.</p>
        </div>
    `;
    document.getElementById('quiz-options').innerHTML = '';
    const fb = document.getElementById('quiz-feedback');
    fb.className = 'mt-3 p-3 rounded mc-parchment border-2 border-emerald-600 text-center font-extrabold text-emerald-950';
    fb.textContent = '¡Excelente preparación para tus pruebas del colegio!';
    speakChileanExpressive('¡Felicitaciones! Completaste todas las preguntas de la prueba.');
}

// Modal 4: Cuadernos de Estudio Interactivos
function openNotebookModal() {
    playSound('place');
    const modal = document.getElementById('notebook-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    showNotebookTab('historia');
}

function closeNotebookModal() {
    stopAllSpeech();
    const modal = document.getElementById('notebook-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function showNotebookTab(subj) {
    ['historia', 'ciencias', 'lenguaje', 'matematicas'].forEach(k => {
        const btn = document.getElementById(`nb-tab-${k}`);
        const content = document.getElementById(`nb-content-${k}`);
        if (k === subj) {
            if (btn) btn.className = 'mc-btn mc-btn-gold pixel-font text-[10px] px-3 py-1.5 rounded';
            if (content) content.classList.remove('hidden');
        } else {
            if (btn) btn.className = 'mc-btn pixel-font text-[10px] px-3 py-1.5 rounded';
            if (content) content.classList.add('hidden');
        }
    });
}

function speakNotebookSummary(subj) {
    if (subj === 'historia') {
        speakChileanExpressive([
            { text: 'Resumen del cuaderno de Historia y Geografía.', pitch: 1.07, rate: 1.0, pauseAfter: 180 },
            { text: 'Los pueblos originarios de Chile se dividían según su forma de vida. Los nómadas se trasladaban buscando alimento, como los Changos, Chonos, Kawésqar, Yaganes y Selk\'nam.', pitch: 1.03, rate: 0.97, pauseAfter: 200 },
            { text: 'Los sedentarios vivían fijos en un lugar y practicaban la agricultura y crianza de animales, como Aymaras, Lickanantay, Diaguitas y Mapuches.', pitch: 1.03, rate: 0.97 }
        ]);
    } else if (subj === 'ciencias') {
        speakChileanExpressive([
            { text: 'Resumen del cuaderno de Ciencias Naturales.', pitch: 1.07, rate: 1.0, pauseAfter: 180 },
            { text: 'El corazón bombea sangre setenta veces por minuto, los pulmones permiten respirar y el esqueleto nos sostiene erguidos. Debemos hacer sesenta minutos de ejercicio al día.', pitch: 1.03, rate: 0.97, pauseAfter: 200 },
            { text: 'Los animales vertebrados tienen columna vertebral y los invertebrados no tienen huesos. Los insectos tienen seis patas y los arácnidos ocho patas.', pitch: 1.03, rate: 0.97 }
        ]);
    } else if (subj === 'lenguaje') {
        speakChileanExpressive([
            { text: 'Resumen del cuaderno de Lenguaje y Comunicación.', pitch: 1.07, rate: 1.0, pauseAfter: 180 },
            { text: 'El cómic es un texto literario que cuenta una historia en viñetas con globos de diálogo y onomatopeyas. Para localizar información explícita seguimos cuatro pasos: leer el texto, leer la pregunta, buscar y subrayar en el texto, y responder.', pitch: 1.03, rate: 0.97 }
        ]);
    } else if (subj === 'matematicas') {
        speakChileanExpressive([
            { text: 'Resumen del cuaderno de Matemáticas.', pitch: 1.07, rate: 1.0, pauseAfter: 180 },
            { text: 'Una decena equivale a diez unidades. Practicamos sumas, restas, cálculo mental y cuerpos geométricos en tres D como el cubo que tiene seis caras.', pitch: 1.03, rate: 0.97 }
        ]);
    }
}
