/**
 * ColegioCraft 3D - Arcade Educativo de 17 Mini-Juegos
 * Lógica y renderizado con estilo Minecraft retro interactivo.
 */

let activeTimerInterval = null;

function clearMinigameTimers() {
    if (activeTimerInterval) {
        clearInterval(activeTimerInterval);
        activeTimerInterval = null;
    }
}

function showMinigameFeedback(isSuccess, messageHtml, stationIdToReward) {
    const fb = document.getElementById('mg-feedback');
    if (!fb) return;
    fb.classList.remove('hidden');

    if (isSuccess) {
        playSound('success');
        window.minigamePoints = (window.minigamePoints || 0) + 35;
        window.totalScore = (window.totalScore || 0) + 35;
        if (stationIdToReward && window.awardStationMedal) {
            window.awardStationMedal(stationIdToReward, UNIT_MINIGAMES[stationIdToReward].title);
        }
        if (window.updateHUD) window.updateHUD();
        const scoreDisp = document.getElementById('mg-score-display');
        if (scoreDisp) scoreDisp.textContent = `🏅 Puntos de Mini-Juegos: ${window.minigamePoints}`;

        fb.className = 'mt-3 p-3 rounded-lg text-center font-extrabold text-xs sm:text-sm mc-parchment border-2 border-emerald-600 text-emerald-950';
        fb.innerHTML = messageHtml;
        if (window.renderMinigameNavigation) window.renderMinigameNavigation();
    } else {
        playSound('wrong');
        fb.className = 'mt-3 p-3 rounded-lg text-center font-extrabold text-xs sm:text-sm mc-parchment border-2 border-rose-600 text-rose-950';
        fb.innerHTML = messageHtml;
    }
}

function speakCurrentMinigameInstructions() {
    if (!window.currentMinigameId) return;
    const mg = UNIT_MINIGAMES[window.currentMinigameId];
    if (!mg || !window.speakChileanExpressive) return;
    speakChileanExpressive([
        { text: `${mg.title}.`, pitch: 1.07, rate: 0.99, pauseAfter: 160 },
        { text: mg.instructions, pitch: 1.03, rate: 0.97 }
    ]);
}

function resetCurrentMinigame() {
    if (window.currentMinigameId) {
        loadUnitMinigame(window.currentMinigameId);
    }
}

function nextUnitMinigame() {
    const stations = WORLD_STATIONS[window.currentMinigameSubject || 'historia'];
    if (!stations) return;
    const idx = stations.findIndex(s => s.id === window.currentMinigameId);
    const nextIdx = (idx + 1) % stations.length;
    window.currentMinigameId = stations[nextIdx].id;
    if (window.renderMinigameNavigation) window.renderMinigameNavigation();
    loadUnitMinigame(window.currentMinigameId);
}

function loadUnitMinigame(mgId) {
    clearMinigameTimers();
    const mg = UNIT_MINIGAMES[mgId];
    if (!mg) return;

    const emojiEl = document.getElementById('mg-header-emoji');
    const titleEl = document.getElementById('mg-header-title');
    const textEl = document.getElementById('mg-instructions-text');
    const pillEl = document.getElementById('mg-type-pill');
    const feedbackEl = document.getElementById('mg-feedback');

    if (emojiEl) emojiEl.textContent = mg.emoji;
    if (titleEl) titleEl.textContent = mg.title;
    if (textEl) textEl.textContent = mg.instructions;
    if (pillEl) pillEl.textContent = mg.mechanicName;
    if (feedbackEl) feedbackEl.classList.add('hidden');

    const stage = document.getElementById('mg-stage');
    if (!stage) return;
    stage.innerHTML = '';

    if (mg.type === 'odd_one_out') renderOddOneOutGame(mg, stage);
    else if (mg.type === 'memory_pairs') renderMemoryPairsGame(mg, stage);
    else if (mg.type === 'shell_game') renderShellGame(mg, stage);
    else if (mg.type === 'fill_blank') renderFillBlankGame(mg, stage);
    else if (mg.type === 'maze_key') renderMazeKeyGame(mg, stage);
    else if (mg.type === 'anagram') renderAnagramGame(mg, stage);
    else if (mg.type === 'match_columns') renderMatchColumnsGame(mg, stage);
    else if (mg.type === 'simon_says') renderSimonSaysGame(mg, stage);
    else if (mg.type === 'sudoku_4x4') renderSudoku4x4Game(mg, stage);
    else if (mg.type === 'fast_classifier') renderFastClassifierGame(mg, stage);
    else if (mg.type === 'sequence_order') renderSequenceOrderGame(mg, stage);
    else if (mg.type === 'true_false_timer') renderTrueFalseTimerGame(mg, stage);
    else if (mg.type === 'comic_parts') renderComicPartsGame(mg, stage);
    else if (mg.type === 'word_search') renderWordSearchGame(mg, stage);
    else if (mg.type === 'hangman') renderHangmanGame(mg, stage);
    else if (mg.type === 'balloon_hunt') renderBalloonHuntGame(mg, stage);
    else if (mg.type === 'mini_crossword') renderMiniCrosswordGame(mg, stage);

    speakCurrentMinigameInstructions();
}

// 1. EL INTRUSO (Odd One Out)
function renderOddOneOutGame(mg, stage) {
    let roundIdx = 0;
    function drawRound() {
        const r = mg.rounds[roundIdx];
        stage.innerHTML = `
            <div class="text-center mb-3">
                <span class="pixel-font text-[10px] text-amber-900 bg-amber-200 border border-amber-600 px-3 py-1 rounded">Ronda ${roundIdx + 1} de ${mg.rounds.length}</span>
                <h3 class="text-sm sm:text-base font-extrabold text-slate-900 mt-2">${r.prompt}</h3>
            </div>
            <div id="odd-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto w-full"></div>
        `;
        const grid = stage.querySelector('#odd-grid');
        r.items.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'mc-btn mc-parchment p-3.5 rounded flex items-center gap-3 font-bold text-left';
            btn.innerHTML = `<span class="text-3xl">${item.emoji}</span> <span class="text-xs sm:text-sm font-bold text-slate-900">${item.label}</span>`;
            btn.onclick = () => {
                if (item.isIntruder) {
                    showMinigameFeedback(true, `🎉 ${item.reason}`, mg.stationId);
                    speakChileanExpressive(item.reason);
                    if (roundIdx + 1 < mg.rounds.length) {
                        setTimeout(() => { roundIdx++; document.getElementById('mg-feedback').classList.add('hidden'); drawRound(); }, 2200);
                    }
                } else {
                    showMinigameFeedback(false, `💡 "${item.label}" SÍ pertenece. ¡Busca el que NO corresponde!`);
                    speakChileanExpressive('Ese sí pertenece al grupo. ¡Busca el intruso!');
                }
            };
            grid.appendChild(btn);
        });
    }
    drawRound();
}

// 2. MEMORICE DE PARES
function renderMemoryPairsGame(mg, stage) {
    const deck = [...mg.pairs, ...mg.pairs]
        .map((card, i) => ({ ...card, uid: i }))
        .sort(() => Math.random() - 0.5);
    let flipped = [];
    let matched = new Set();
    let lock = false;

    stage.innerHTML = `<div id="mem-grid" class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-lg mx-auto w-full"></div>`;
    const grid = stage.querySelector('#mem-grid');

    function refreshBoard() {
        grid.innerHTML = '';
        deck.forEach(card => {
            const isUp = flipped.includes(card) || matched.has(card.id);
            const btn = document.createElement('button');
            btn.className = isUp
                ? 'mc-btn mc-btn-green h-24 rounded flex flex-col items-center justify-center p-2 font-extrabold'
                : 'mc-btn mc-btn-gold h-24 rounded flex flex-col items-center justify-center p-2 font-extrabold';
            btn.innerHTML = isUp
                ? `<span class="text-3xl">${card.emoji}</span><span class="text-[11px] mt-1 text-center font-bold">${card.text}</span>`
                : `<span class="text-3xl">❓</span><span class="pixel-font text-[9px] mt-1">VOLTEAR</span>`;
            btn.onclick = () => {
                if (lock || isUp) return;
                playSound('place');
                flipped.push(card);
                refreshBoard();
                if (flipped.length === 2) {
                    lock = true;
                    if (flipped[0].id === flipped[1].id) {
                        matched.add(flipped[0].id);
                        flipped = [];
                        lock = false;
                        playSound('success');
                        refreshBoard();
                        if (matched.size === mg.pairs.length) {
                            showMinigameFeedback(true, '🏅 ¡Seco! Encontraste todos los pares de los pueblos Lickanantay y Diaguita.', mg.stationId);
                            speakChileanExpressive('¡Seco! Encontraste todas las parejas del desierto y los valles.');
                        }
                    } else {
                        setTimeout(() => {
                            flipped = [];
                            lock = false;
                            refreshBoard();
                        }, 800);
                    }
                }
            };
            grid.appendChild(btn);
        });
    }
    refreshBoard();
}

// 3. ¿DÓNDE QUEDÓ? (Toldos Costeros)
function renderShellGame(mg, stage) {
    let winningCup = Math.floor(Math.random() * 3);
    let canPick = false;

    stage.innerHTML = `
        <div class="text-center mb-3">
            <p id="shell-status" class="text-sm font-extrabold text-sky-950">¡Mira dónde se esconde la Balsa de Lobo Marino (🦭)!</p>
        </div>
        <div id="shell-cups" class="grid grid-cols-3 gap-3 max-w-sm mx-auto w-full my-2"></div>
        <div class="text-center mt-3">
            <button id="shell-mix-btn" class="mc-btn mc-btn-gold pixel-font text-xs px-4 py-2 rounded">🔀 MEZCLAR TOLDOS</button>
        </div>
    `;
    const cupsContainer = stage.querySelector('#shell-cups');
    const statusEl = stage.querySelector('#shell-status');

    function drawCups(revealAll = false, chosenIdx = -1) {
        cupsContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const showPrize = (revealAll || chosenIdx === i) && i === winningCup;
            const btn = document.createElement('button');
            btn.className = 'mc-btn mc-parchment p-3 rounded flex flex-col items-center justify-center h-28';
            btn.innerHTML = showPrize
                ? `<span class="text-4xl animate-bounce">🦭</span><span class="pixel-font text-[9px] text-emerald-900 font-extrabold mt-1">¡BALSA!</span>`
                : `<span class="text-4xl">⛺</span><span class="pixel-font text-[9px] text-slate-800 font-bold mt-1">TOLDO ${i + 1}</span>`;
            btn.onclick = () => {
                if (!canPick) return;
                canPick = false;
                drawCups(true, i);
                if (i === winningCup) {
                    showMinigameFeedback(true, `🎉 ${mg.fact}`, mg.stationId);
                    speakChileanExpressive(mg.fact);
                } else {
                    showMinigameFeedback(false, `❌ Estaba en el Toldo ${winningCup + 1}. ¡Presiona "Mezclar Toldos" para intentarlo de nuevo!`);
                    speakChileanExpressive(`¡Uy! Estaba en el toldo número ${winningCup + 1}. ¡Inténtalo de nuevo!`);
                }
            };
            cupsContainer.appendChild(btn);
        }
    }

    drawCups(true);
    stage.querySelector('#shell-mix-btn').onclick = () => {
        playSound('jump');
        document.getElementById('mg-feedback').classList.add('hidden');
        winningCup = Math.floor(Math.random() * 3);
        statusEl.textContent = '🔀 Mezclando toldos por la costa... ¡Atento!';
        drawCups(false);
        setTimeout(() => {
            canPick = true;
            statusEl.textContent = '👉 ¡Toca el toldo donde quedó la Balsa Chango!';
        }, 600);
    };
}

// 4. COMPLETA LA ORACIÓN
function renderFillBlankGame(mg, stage) {
    let idx = 0;
    function drawSentence() {
        const item = mg.sentences[idx];
        stage.innerHTML = `
            <div class="text-center mb-3">
                <span class="pixel-font text-[10px] text-emerald-900 bg-emerald-100 border border-emerald-500 px-3 py-1 rounded">Oración ${idx + 1} de ${mg.sentences.length}</span>
            </div>
            <p class="text-sm sm:text-base font-extrabold text-slate-900 mc-parchment p-4 rounded text-center mb-4 leading-relaxed">
                ${item.before} <span class="pixel-font text-purple-700 underline px-1">[ ¿? ]</span> ${item.after}
            </p>
            <div id="blank-opts" class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-md mx-auto w-full"></div>
        `;
        const opts = stage.querySelector('#blank-opts');
        item.options.forEach(w => {
            const btn = document.createElement('button');
            btn.className = 'mc-btn mc-btn-green py-3 px-4 rounded text-xs sm:text-sm font-extrabold';
            btn.textContent = w;
            btn.onclick = () => {
                if (w === item.answer) {
                    showMinigameFeedback(true, `✅ ¡Correcto! La palabra es "${w}".`, mg.stationId);
                    speakChileanExpressive(`¡Súper bien! La palabra correcta es ${w}.`);
                    if (idx + 1 < mg.sentences.length) {
                        setTimeout(() => { idx++; document.getElementById('mg-feedback').classList.add('hidden'); drawSentence(); }, 1600);
                    }
                } else {
                    showMinigameFeedback(false, '💡 Esa palabra no completa bien la oración. ¡Prueba otra!');
                }
            };
            opts.appendChild(btn);
        });
    }
    drawSentence();
}

// 5. LABERINTO CON LLAVE (Fuego en la Dalca)
function renderMazeKeyGame(mg, stage) {
    const map = [
        [0, 0, 1, 2, 0],
        [1, 0, 1, 0, 1],
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 3]
    ];
    let px = 0, py = 0;
    let hasFireKey = false;

    function drawMaze() {
        stage.innerHTML = `
            <div class="text-center mb-2 text-xs sm:text-sm font-extrabold ${hasFireKey ? 'text-emerald-700' : 'text-amber-800'}">
                ${hasFireKey ? '🔥 ¡Fuego en la Dalca listo! Ahora navega a la Isla Austral (🏝️)' : '1° Navega hacia el Fuego (🔥) para abrigarte'}
            </div>
            <div id="maze-grid" class="grid grid-cols-5 gap-1.5 max-w-xs mx-auto w-full mb-3"></div>
            <div class="flex justify-center gap-2">
                <button onclick="window.moveMaze(0,-1)" class="mc-btn mc-btn-blue px-4 py-2 text-base"><i class="fa-solid fa-arrow-up"></i></button>
                <button onclick="window.moveMaze(-1,0)" class="mc-btn mc-btn-blue px-4 py-2 text-base"><i class="fa-solid fa-arrow-left"></i></button>
                <button onclick="window.moveMaze(0,1)" class="mc-btn mc-btn-blue px-4 py-2 text-base"><i class="fa-solid fa-arrow-down"></i></button>
                <button onclick="window.moveMaze(1,0)" class="mc-btn mc-btn-blue px-4 py-2 text-base"><i class="fa-solid fa-arrow-right"></i></button>
            </div>
        `;
        const grid = stage.querySelector('#maze-grid');
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 5; x++) {
                const cell = document.createElement('div');
                const isPlayer = (x === px && y === py);
                const val = map[y][x];
                cell.className = `h-11 rounded flex items-center justify-center text-2xl border-2 ${
                    val === 1 ? 'bg-slate-400 border-slate-600' : 'bg-sky-100 border-sky-400'
                }`;
                if (isPlayer) cell.textContent = '🛶';
                else if (val === 1) cell.textContent = '🧊';
                else if (val === 2 && !hasFireKey) cell.textContent = '🔥';
                else if (val === 3) cell.textContent = hasFireKey ? '🏝️' : '🔒';
                grid.appendChild(cell);
            }
        }
    }

    window.moveMaze = (dx, dy) => {
        const nx = px + dx, ny = py + dy;
        if (nx < 0 || nx >= 5 || ny < 0 || ny >= 4) return;
        if (map[ny][nx] === 1) {
            showMinigameFeedback(false, '🧊 ¡Cuidado con el témpano de hielo! Rodea por el canal.');
            return;
        }
        px = nx; py = ny;
        playSound('place');
        if (map[py][px] === 2 && !hasFireKey) {
            hasFireKey = true;
            playSound('jump');
            showMinigameFeedback(true, '🔥 ¡Encendiste fuego dentro de la Dalca como los Chonos y Yaganes! Ahora ve a la Isla 🏝️.');
        } else if (map[py][px] === 3) {
            if (hasFireKey) {
                showMinigameFeedback(true, '🏅 ¡Llegaste a la Isla Austral abrigado con el fuego de tu Dalca! Ganaste la medalla.', mg.stationId);
                speakChileanExpressive('¡Excelente navegante! Llegaste a la isla austral.');
            } else {
                showMinigameFeedback(false, '🔒 ¡Hace mucho frío! Primero busca el Fuego (🔥) para tu Dalca.');
            }
        }
        drawMaze();
    };
    drawMaze();
}

// 6. ANAGRAMAS (Ordena la palabra)
function renderAnagramGame(mg, stage) {
    let wIdx = 0;
    function loadWord() {
        const item = mg.words[wIdx];
        const letters = item.word.split('').sort(() => Math.random() - 0.5);
        let typed = '';

        function drawAnagram() {
            stage.innerHTML = `
                <div class="text-center mb-2">
                    <span class="text-4xl">${item.emoji}</span>
                    <p class="text-xs sm:text-sm font-bold text-slate-800 mt-1">${item.hint}</p>
                </div>
                <div class="mc-parchment p-3 text-center text-xl sm:text-2xl font-extrabold tracking-widest text-slate-900 mb-3 min-h-[50px]">
                    ${typed || '_ '.repeat(item.word.length)}
                </div>
                <div id="anagram-letters" class="flex flex-wrap justify-center gap-2"></div>
            `;
            const container = stage.querySelector('#anagram-letters');
            letters.forEach((ch, idx) => {
                const btn = document.createElement('button');
                btn.className = 'mc-btn mc-btn-gold pixel-font text-base w-11 h-11 rounded';
                btn.textContent = ch;
                btn.onclick = () => {
                    playSound('place');
                    typed += ch;
                    letters.splice(idx, 1);
                    drawAnagram();
                    if (typed.length === item.word.length) {
                        if (typed === item.word) {
                            showMinigameFeedback(true, `🎉 ¡Armaste la palabra ${item.word}!`, mg.stationId);
                            speakChileanExpressive(`¡Súper! Armaste la palabra ${item.word}.`);
                            if (wIdx + 1 < mg.words.length) {
                                setTimeout(() => { wIdx++; document.getElementById('mg-feedback').classList.add('hidden'); loadWord(); }, 1700);
                            }
                        } else {
                            showMinigameFeedback(false, '🔄 Las letras quedaron en otro orden. ¡Intentémoslo de nuevo!');
                            setTimeout(loadWord, 1200);
                        }
                    }
                };
                container.appendChild(btn);
            });
        }
        drawAnagram();
    }
    loadWord();
}

// 7. CONECTA PARES (Órganos y Funciones)
function renderMatchColumnsGame(mg, stage) {
    let selectedLeft = null;
    let solved = new Set();
    const rights = [...mg.pairs].sort(() => Math.random() - 0.5);

    function drawColumns() {
        stage.innerHTML = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="cols-wrap"></div>`;
        const wrap = stage.querySelector('#cols-wrap');
        const leftCol = document.createElement('div');
        leftCol.className = 'flex flex-col gap-2';
        const rightCol = document.createElement('div');
        rightCol.className = 'flex flex-col gap-2';

        mg.pairs.forEach((p) => {
            const isDone = solved.has(p.left);
            const isSel = selectedLeft === p.left;
            const btn = document.createElement('button');
            btn.className = `mc-btn p-3 rounded font-extrabold text-xs sm:text-sm text-left ${
                isDone ? 'mc-btn-green' : isSel ? 'mc-btn-gold' : 'mc-btn-red'
            }`;
            btn.textContent = `${p.left} ${isDone ? '✅' : ''}`;
            btn.onclick = () => {
                if (isDone) return;
                playSound('place');
                selectedLeft = p.left;
                drawColumns();
            };
            leftCol.appendChild(btn);
        });

        rights.forEach(p => {
            const isDone = solved.has(p.left);
            const btn = document.createElement('button');
            btn.className = `mc-btn p-3 rounded font-bold text-xs sm:text-sm text-left ${
                isDone ? 'mc-btn-green' : 'mc-parchment text-slate-800'
            }`;
            btn.textContent = p.right;
            btn.onclick = () => {
                if (isDone || !selectedLeft) return;
                if (p.left === selectedLeft) {
                    solved.add(p.left);
                    selectedLeft = null;
                    playSound('success');
                    drawColumns();
                    if (solved.size === mg.pairs.length) {
                        showMinigameFeedback(true, '🏅 ¡Conectaste todos los órganos del cuerpo humano con su función!', mg.stationId);
                        speakChileanExpressive('¡Excelente! Conectaste todos los órganos del cuerpo que trabajan en equipo.');
                    }
                } else {
                    showMinigameFeedback(false, '💡 Esa función corresponde a otro órgano. ¡Prueba con otro!');
                }
            };
            rightCol.appendChild(btn);
        });

        wrap.appendChild(leftCol);
        wrap.appendChild(rightCol);
    }
    drawColumns();
}

// 8. SIMÓN DICE (Ejercicio Saludable)
function renderSimonSaysGame(mg, stage) {
    const pads = [
        { id: 0, emoji: '🏃', label: 'Correr', color: 'mc-btn-red' },
        { id: 1, emoji: '🤸', label: 'Saltar', color: 'mc-btn-gold' },
        { id: 2, emoji: '🚴', label: 'Bicicleta', color: 'mc-btn-green' },
        { id: 3, emoji: '⚽', label: 'Fútbol', color: 'mc-btn-blue' }
    ];
    let sequence = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
    let userStep = 0;

    stage.innerHTML = `
        <div class="text-center mb-3">
            <p id="simon-status" class="text-xs sm:text-sm font-extrabold text-slate-900">Observa la secuencia de 3 ejercicios y repítela:</p>
        </div>
        <div id="simon-grid" class="grid grid-cols-2 gap-3 max-w-sm mx-auto w-full mb-3"></div>
        <div class="text-center">
            <button id="simon-replay" class="mc-btn mc-btn-purple pixel-font text-[10px] px-4 py-2">👀 REPETIR SECUENCIA</button>
        </div>
    `;
    const grid = stage.querySelector('#simon-grid');

    pads.forEach(p => {
        const btn = document.createElement('button');
        btn.id = `simon-btn-${p.id}`;
        btn.className = `mc-btn ${p.color} p-4 rounded text-center flex flex-col items-center justify-center h-24`;
        btn.innerHTML = `<span class="text-3xl">${p.emoji}</span><span class="pixel-font text-[10px] mt-1">${p.label}</span>`;
        btn.onclick = () => {
            playSound('jump');
            if (p.id === sequence[userStep]) {
                userStep++;
                if (userStep === sequence.length) {
                    showMinigameFeedback(true, '🏅 ¡Seco! Recordaste la secuencia de 60 minutos de ejercicio diario.', mg.stationId);
                    speakChileanExpressive('¡Seco! Recordaste la secuencia de actividad física.');
                }
            } else {
                userStep = 0;
                showMinigameFeedback(false, '❌ ¡Secuencia incorrecta! Presiona "Repetir secuencia" para volver a intentarlo.');
            }
        };
        grid.appendChild(btn);
    });

    function playSequence() {
        let i = 0;
        const interval = setInterval(() => {
            if (i >= sequence.length) {
                clearInterval(interval);
                return;
            }
            const btn = document.getElementById(`simon-btn-${sequence[i]}`);
            if (btn) {
                btn.style.filter = 'brightness(1.8)';
                playSound('place');
                setTimeout(() => { btn.style.filter = 'none'; }, 400);
            }
            i++;
        }, 700);
    }

    stage.querySelector('#simon-replay').onclick = playSequence;
    setTimeout(playSequence, 500);
}

// 9. SUDOKU VISUAL 4x4
function renderSudoku4x4Game(mg, stage) {
    const icons = ['🐟', '🐸', '🦎', '🦅'];
    const puzzle = [
        ['🐟', '🐸', '', '🦅'],
        ['', '🦅', '🐟', ''],
        ['🐸', '', '🦅', ''],
        ['', '🦎', '', '🐟']
    ];
    const solution = [
        ['🐟', '🐸', '🦎', '🦅'],
        ['🦎', '🦅', '🐟', '🐸'],
        ['🐸', '🐟', '🦅', '🦎'],
        ['🦅', '🦎', '🐸', '🐟']
    ];

    stage.innerHTML = `
        <div id="sudoku-grid" class="grid grid-cols-4 gap-1.5 max-w-xs mx-auto w-full mb-3"></div>
        <div class="text-center">
            <span class="text-xs font-bold text-slate-800">Toca cada casilla vacía para cambiar de animal.</span>
        </div>
    `;
    const grid = stage.querySelector('#sudoku-grid');

    puzzle.forEach((row, r) => {
        row.forEach((cell, c) => {
            const btn = document.createElement('button');
            const isFixed = cell !== '';
            btn.className = `h-12 rounded flex items-center justify-center text-2xl font-bold border-2 ${
                isFixed ? 'mc-btn mc-btn-green cursor-not-allowed' : 'mc-btn mc-parchment'
            }`;
            btn.textContent = cell;

            if (!isFixed) {
                btn.onclick = () => {
                    const currentIdx = icons.indexOf(btn.textContent);
                    const nextIcon = icons[(currentIdx + 1) % icons.length];
                    btn.textContent = nextIcon;
                    playSound('place');

                    let allCorrect = true;
                    grid.querySelectorAll('button').forEach((b, idx) => {
                        const rr = Math.floor(idx / 4);
                        const cc = idx % 4;
                        if (b.textContent !== solution[rr][cc]) allCorrect = false;
                    });
                    if (allCorrect) {
                        showMinigameFeedback(true, '🏅 ¡Completaste el Sudoku de Animales Vertebrados!', mg.stationId);
                        speakChileanExpressive('¡Increíble! Completaste el sudoku de animales vertebrados.');
                    }
                };
            }
            grid.appendChild(btn);
        });
    });
}

// 10. CLASIFICADOR RÁPIDO: INSECTOS VS ARÁCNIDOS
function renderFastClassifierGame(mg, stage) {
    let itemIdx = 0;

    function drawItem() {
        const item = mg.items[itemIdx];
        stage.innerHTML = `
            <div class="text-center mb-3">
                <span class="pixel-font text-[10px] text-purple-900 bg-purple-100 border border-purple-500 px-3 py-1 rounded">Animal ${itemIdx + 1} de ${mg.items.length}</span>
            </div>
            <div class="mc-parchment p-4 rounded text-center max-w-md mx-auto mb-4">
                <span class="text-5xl">${item.emoji}</span>
                <h3 class="text-base font-extrabold text-slate-900 mt-2">${item.name}</h3>
                <p class="text-xs text-slate-700 mt-1">${item.desc}</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto w-full">
                <button id="btn-bin-insecto" class="mc-btn mc-btn-green py-3 text-xs sm:text-sm font-extrabold">🦋 INSECTO (6 patas)</button>
                <button id="btn-bin-aracnido" class="mc-btn mc-btn-purple py-3 text-xs sm:text-sm font-extrabold">🕷️ ARÁCNIDO (8 patas)</button>
            </div>
        `;

        const checkChoice = (choice) => {
            if (choice === item.answer) {
                playSound('success');
                itemIdx++;
                if (itemIdx < mg.items.length) {
                    showMinigameFeedback(true, `✅ ¡Correcto! ${item.name} es un ${choice}.`);
                    setTimeout(() => { document.getElementById('mg-feedback').classList.add('hidden'); drawItem(); }, 1200);
                } else {
                    showMinigameFeedback(true, '🏅 ¡Clasificaste todos los artrópodos por su cantidad de patas!', mg.stationId);
                    speakChileanExpressive('¡Seco! Clasificaste todos los insectos y arácnidos.');
                }
            } else {
                showMinigameFeedback(false, `💡 Recuerda contar sus patas: Insectos = 6 patas, Arácnidos = 8 patas.`);
            }
        };

        stage.querySelector('#btn-bin-insecto').onclick = () => checkChoice('Insecto');
        stage.querySelector('#btn-bin-aracnido').onclick = () => checkChoice('Arácnido');
    }
    drawItem();
}

// 11. ORDENA LA SECUENCIA: METAMORFOSIS
function renderSequenceOrderGame(mg, stage) {
    const shuffled = [...mg.steps].sort(() => Math.random() - 0.5);
    let selectedOrder = [];

    stage.innerHTML = `
        <div class="text-center mb-3">
            <span class="pixel-font text-[10px] text-emerald-900 bg-emerald-100 border border-emerald-500 px-3 py-1 rounded">Toca las tarjetas en orden del 1 al 4</span>
        </div>
        <div id="seq-grid" class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-lg mx-auto w-full"></div>
    `;
    const grid = stage.querySelector('#seq-grid');

    shuffled.forEach(step => {
        const btn = document.createElement('button');
        btn.className = 'mc-btn mc-parchment p-3 rounded flex flex-col items-center justify-center h-28';
        btn.innerHTML = `<span class="text-3xl">${step.emoji}</span><span class="text-[11px] font-bold text-slate-900 mt-1">${step.title}</span>`;
        btn.onclick = () => {
            if (selectedOrder.includes(step.order)) return;
            selectedOrder.push(step.order);
            playSound('place');
            btn.classList.remove('mc-parchment');
            btn.classList.add('mc-btn-green');
            btn.innerHTML += `<span class="pixel-font text-[9px] mt-1">#${selectedOrder.length}</span>`;

            if (selectedOrder.length === mg.steps.length) {
                const isCorrect = selectedOrder.every((val, idx) => val === idx + 1);
                if (isCorrect) {
                    showMinigameFeedback(true, '🏅 ¡Seco! Ordenaste correctamente las 4 etapas de la mariposa: Huevo, Oruga, Crisálida y Adulta.', mg.stationId);
                    speakChileanExpressive('¡Perfecto! Ese es el ciclo de vida de la mariposa.');
                } else {
                    showMinigameFeedback(false, '🔄 El orden no fue el correcto. ¡Inténtalo de nuevo!');
                    setTimeout(() => renderSequenceOrderGame(mg, stage), 1600);
                }
            }
        };
        grid.appendChild(btn);
    });
}

// 12. VERDADERO O FALSO CONTRA EL RELOJ (El Agua)
function renderTrueFalseTimerGame(mg, stage) {
    let qIdx = 0;
    let timeLeft = 12;

    function drawQuestion() {
        clearMinigameTimers();
        timeLeft = 12;
        const q = mg.questions[qIdx];

        stage.innerHTML = `
            <div class="flex items-center justify-between max-w-md mx-auto mb-3">
                <span class="pixel-font text-[10px] text-sky-900 bg-sky-100 border border-sky-500 px-3 py-1 rounded">Pregunta ${qIdx + 1} de ${mg.questions.length}</span>
                <span id="tf-timer" class="pixel-font text-[10px] text-rose-700 bg-rose-100 border border-rose-500 px-3 py-1 rounded">⏱️ ${timeLeft}s</span>
            </div>
            <div class="mc-parchment p-4 rounded text-center max-w-md mx-auto mb-4">
                <p class="text-sm sm:text-base font-extrabold text-slate-900 leading-relaxed">${q.text}</p>
            </div>
            <div class="grid grid-cols-2 gap-3 max-w-md mx-auto w-full">
                <button id="btn-tf-true" class="mc-btn mc-btn-green py-3 text-xs sm:text-sm font-extrabold">VERDADERO</button>
                <button id="btn-tf-false" class="mc-btn mc-btn-red py-3 text-xs sm:text-sm font-extrabold">FALSO</button>
            </div>
        `;

        activeTimerInterval = setInterval(() => {
            timeLeft--;
            const timerEl = document.getElementById('tf-timer');
            if (timerEl) timerEl.textContent = `⏱️ ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearMinigameTimers();
                showMinigameFeedback(false, '⏰ ¡Se acabó el tiempo! Pasando a la siguiente...');
                setTimeout(nextQuestion, 1400);
            }
        }, 1000);

        function checkTF(answer) {
            clearMinigameTimers();
            if (answer === q.isTrue) {
                playSound('success');
                showMinigameFeedback(true, '✅ ¡Respuesta correcta!');
            } else {
                playSound('wrong');
                showMinigameFeedback(false, '💡 ¡Uy! Revisa las propiedades del agua.');
            }
            setTimeout(nextQuestion, 1400);
        }

        function nextQuestion() {
            qIdx++;
            if (qIdx < mg.questions.length) {
                drawQuestion();
            } else {
                showMinigameFeedback(true, '🏅 ¡Completaste el Desafío del Agua con éxito!', mg.stationId);
                speakChileanExpressive('¡Excelente científico del agua!');
            }
        }

        stage.querySelector('#btn-tf-true').onclick = () => checkTF(true);
        stage.querySelector('#btn-tf-false').onclick = () => checkTF(false);
    }
    drawQuestion();
}

// 13. SILUETAS DEL CÓMIC
function renderComicPartsGame(mg, stage) {
    let cIdx = 0;
    function drawChallenge() {
        const item = mg.challenges[cIdx];
        stage.innerHTML = `
            <div class="text-center mb-3">
                <span class="pixel-font text-[10px] text-fuchsia-900 bg-fuchsia-100 border border-fuchsia-500 px-3 py-1 rounded">Desafío ${cIdx + 1} de ${mg.challenges.length}</span>
            </div>
            <div class="mc-parchment p-4 rounded text-center max-w-md mx-auto mb-4">
                <div class="text-lg sm:text-xl font-extrabold text-purple-900 mb-2">${item.visual}</div>
                <p class="text-xs sm:text-sm font-bold text-slate-800">${item.question}</p>
            </div>
            <div id="comic-opts" class="grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-md mx-auto w-full"></div>
        `;
        const opts = stage.querySelector('#comic-opts');
        item.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'mc-btn mc-btn-purple py-3 px-2 text-xs font-extrabold';
            btn.textContent = opt;
            btn.onclick = () => {
                if (opt === item.answer) {
                    playSound('success');
                    cIdx++;
                    if (cIdx < mg.challenges.length) {
                        showMinigameFeedback(true, `✅ ¡Correcto! Es un ${opt}.`);
                        setTimeout(() => { document.getElementById('mg-feedback').classList.add('hidden'); drawChallenge(); }, 1200);
                    } else {
                        showMinigameFeedback(true, '🏅 ¡Identificaste todas las partes y siluetas del cómic!', mg.stationId);
                        speakChileanExpressive('¡Seco para los cómics!');
                    }
                } else {
                    showMinigameFeedback(false, '💡 Esa parte tiene otro propósito en la historieta.');
                }
            };
            opts.appendChild(btn);
        });
    }
    drawChallenge();
}

// 14. SOPA DE LETRAS VISUAL (Detective Lector)
function renderWordSearchGame(mg, stage) {
    let foundWords = new Set();
    stage.innerHTML = `
        <div class="text-center mb-2">
            <span class="pixel-font text-[10px] text-sky-900 bg-sky-100 border border-sky-500 px-3 py-1 rounded">Toca las palabras que encuentres en las filas</span>
        </div>
        <div id="ws-grid" class="flex flex-col gap-1 max-w-xs mx-auto mb-3"></div>
        <div id="ws-targets" class="flex flex-wrap justify-center gap-2 max-w-md mx-auto"></div>
    `;
    const targetsEl = stage.querySelector('#ws-targets');
    mg.targets.forEach(t => {
        const badge = document.createElement('span');
        badge.id = `target-${t.word}`;
        badge.className = 'pixel-font text-[9px] bg-slate-200 border border-slate-500 text-slate-800 px-2 py-1 rounded';
        badge.textContent = `${t.word} 🔍`;
        targetsEl.appendChild(badge);
    });

    const gridEl = stage.querySelector('#ws-grid');
    mg.gridRows.forEach((row) => {
        const rowEl = document.createElement('div');
        rowEl.className = 'flex justify-center gap-1';
        row.forEach(letter => {
            const btn = document.createElement('button');
            btn.className = 'mc-btn mc-parchment w-8 h-8 rounded text-xs font-extrabold';
            btn.textContent = letter;
            btn.onclick = () => {
                playSound('place');
                btn.classList.add('mc-btn-gold');
                // Detectar si la fila contiene una palabra objetivo
                const fullRow = row.join('');
                mg.targets.forEach(t => {
                    if (fullRow.includes(t.word) && !foundWords.has(t.word)) {
                        foundWords.add(t.word);
                        playSound('success');
                        const b = document.getElementById(`target-${t.word}`);
                        if (b) {
                            b.className = 'pixel-font text-[9px] bg-emerald-500 text-slate-950 font-extrabold px-2 py-1 rounded';
                            b.textContent = `${t.word} ✅`;
                        }
                        if (foundWords.size === mg.targets.length) {
                            showMinigameFeedback(true, '🏅 ¡Encontraste todas las palabras para Localizar Información Explícita!', mg.stationId);
                            speakChileanExpressive('¡Excelente detective lector!');
                        }
                    }
                });
            };
            rowEl.appendChild(btn);
        });
        gridEl.appendChild(rowEl);
    });
}

// 15. EL AHORCADO: ADIVINA POR EL CONTEXTO
function renderHangmanGame(mg, stage) {
    let wIdx = 0;
    function drawHangman() {
        const item = mg.words[wIdx];
        let guessed = new Set();
        let mistakes = 0;
        const maxMistakes = 6;

        function refresh() {
            const displayWord = item.word.split('').map(l => guessed.has(l) ? l : '_').join(' ');
            stage.innerHTML = `
                <div class="text-center mb-2">
                    <span class="pixel-font text-[10px] text-purple-900 bg-purple-100 border border-purple-500 px-3 py-1 rounded">Pistas de Contexto (${wIdx + 1}/${mg.words.length})</span>
                </div>
                <div class="mc-parchment p-3 rounded text-center max-w-md mx-auto mb-3">
                    <p class="text-xs sm:text-sm font-bold text-slate-900">${item.context}</p>
                </div>
                <div class="pixel-font text-xl text-center font-extrabold tracking-widest text-slate-900 mb-2">
                    ${displayWord}
                </div>
                <div class="text-center text-xs font-bold text-rose-700 mb-3">Errores: ${mistakes}/${maxMistakes}</div>
                <div id="hm-keyboard" class="flex flex-wrap justify-center gap-1 max-w-sm mx-auto"></div>
            `;
            const kb = stage.querySelector('#hm-keyboard');
            'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('').forEach(letter => {
                const btn = document.createElement('button');
                btn.className = `mc-btn w-7 h-7 text-[10px] font-bold rounded ${guessed.has(letter) ? 'opacity-40 cursor-not-allowed' : ''}`;
                btn.textContent = letter;
                btn.disabled = guessed.has(letter);
                btn.onclick = () => {
                    guessed.add(letter);
                    if (item.word.includes(letter)) {
                        playSound('place');
                        const isWin = item.word.split('').every(l => guessed.has(l));
                        if (isWin) {
                            showMinigameFeedback(true, `🎉 ¡Descubriste la palabra "${item.word}" usando el contexto!`, mg.stationId);
                            if (wIdx + 1 < mg.words.length) {
                                setTimeout(() => { wIdx++; drawHangman(); }, 1800);
                            }
                        }
                    } else {
                        playSound('wrong');
                        mistakes++;
                        if (mistakes >= maxMistakes) {
                            showMinigameFeedback(false, `❌ ¡Se acabaron los intentos! La palabra era "${item.word}".`);
                            setTimeout(drawHangman, 2000);
                            return;
                        }
                    }
                    refresh();
                };
                kb.appendChild(btn);
            });
        }
        refresh();
    }
    drawHangman();
}

// 16. CAZA DE GLOBOS: FAMILIA DE PALABRAS
function renderBalloonHuntGame(mg, stage) {
    let poppedCorrect = new Set();
    stage.innerHTML = `
        <div class="text-center mb-3">
            <span class="pixel-font text-[10px] text-emerald-900 bg-emerald-100 border border-emerald-500 px-3 py-1 rounded">Revienta los globos de la familia de "${mg.rootWord}"</span>
        </div>
        <div id="balloon-grid" class="flex flex-wrap justify-center gap-2.5 max-w-md mx-auto"></div>
    `;
    const grid = stage.querySelector('#balloon-grid');
    mg.balloons.forEach((b) => {
        const btn = document.createElement('button');
        btn.className = 'mc-btn mc-btn-gold py-3 px-4 rounded text-xs font-extrabold flex items-center gap-1.5';
        btn.innerHTML = `<span>🎈</span> <span>${b.text}</span>`;
        btn.onclick = () => {
            if (b.isFamily) {
                playSound('jump');
                poppedCorrect.add(b.text);
                btn.className = 'mc-btn mc-btn-green py-3 px-4 rounded text-xs font-extrabold opacity-70 cursor-not-allowed';
                btn.innerHTML = `<span>💥</span> <span>${b.text}</span>`;
                btn.disabled = true;

                const totalFamily = mg.balloons.filter(x => x.isFamily).length;
                if (poppedCorrect.size === totalFamily) {
                    showMinigameFeedback(true, '🏅 ¡Cazaste todas las palabras de la familia de "PAN"!', mg.stationId);
                    speakChileanExpressive('¡Excelente cazador de palabras!');
                }
            } else {
                playSound('wrong');
                showMinigameFeedback(false, `💡 "${b.text}" no pertenece a la familia de "${mg.rootWord}".`);
            }
        };
        grid.appendChild(btn);
    });
}

// 17. CRUCIGRAMA INFANTIL DE TEXTOS LITERARIOS
function renderMiniCrosswordGame(mg, stage) {
    let completedRows = new Set();
    stage.innerHTML = `
        <div class="text-center mb-3">
            <span class="pixel-font text-[10px] text-fuchsia-900 bg-fuchsia-100 border border-fuchsia-500 px-3 py-1 rounded">Crucigrama Infantil Ilustrado</span>
        </div>
        <div id="cw-rows" class="flex flex-col gap-3 max-w-md mx-auto"></div>
    `;
    const container = stage.querySelector('#cw-rows');
    mg.rows.forEach((r, idx) => {
        const rowBox = document.createElement('div');
        rowBox.className = 'mc-parchment p-3 rounded';
        rowBox.innerHTML = `
            <p class="text-xs font-bold text-slate-900 mb-2">${r.clue}</p>
            <div class="flex gap-2" id="cw-opts-${idx}"></div>
        `;
        const optsContainer = rowBox.querySelector(`#cw-opts-${idx}`);
        r.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'mc-btn mc-btn-purple text-xs font-extrabold px-3 py-1.5 rounded';
            btn.textContent = opt;
            btn.onclick = () => {
                if (opt === r.answer) {
                    playSound('success');
                    completedRows.add(idx);
                    btn.className = 'mc-btn mc-btn-green text-xs font-extrabold px-3 py-1.5 rounded';
                    if (completedRows.size === mg.rows.length) {
                        showMinigameFeedback(true, '🏅 ¡Completaste el Crucigrama Infantil de Textos Literarios!', mg.stationId);
                        speakChileanExpressive('¡Seco para los textos literarios!');
                    }
                } else {
                    playSound('wrong');
                    showMinigameFeedback(false, '💡 Esa palabra no coincide con la pista del crucigrama.');
                }
            };
            optsContainer.appendChild(btn);
        });
        container.appendChild(rowBox);
    });
}
