/**
 * ColegioCraft 3D - Bucle Principal y Coordinación del Juego
 * Ciclo de renderizado, animaciones, físicas de jugador y cambio de mundos.
 */

let clock = new THREE.Clock();
let blinkTimer = 0;

// Cambia entre el Lobby y cualquiera de los Mundos
window.enterWorld = function (worldKey, silent = false) {
    window.currentWorld = worldKey;
    if (!silent) playSound('teleport');

    // Limpiar mundo previo
    while (worldContentGroup.children.length > 0) {
        worldContentGroup.remove(worldContentGroup.children[0]);
    }
    userBlocks.forEach(b => scene.remove(b));
    userBlocks = [];
    interactiveTargets = [];
    animatedObjects = [];
    document.getElementById('labels-container').innerHTML = '';

    // Posicionar jugador
    playerGroup.position.set(0, 0, 6);
    cameraYaw = 0;

    const zoneEmoji = document.getElementById('zone-emoji');
    const zoneTitle = document.getElementById('zone-title');

    if (worldKey === 'lobby') {
        scene.background = new THREE.Color(0x38bdf8);
        scene.fog = new THREE.FogExp2(0xbae6fd, 0.007);
        buildLobbyWorld();
        if (zoneEmoji) zoneEmoji.textContent = '🏰';
        if (zoneTitle) zoneTitle.textContent = 'LOBBY CENTRAL: Acércate o haz clic en una de las 4 Puertas para entrar a su Mundo';

        if (!silent) {
            showToast('🚪', 'Estás en el Lobby Central. Explora las 4 Puertas Mágicas.');
            speakChileanExpressive('Regresamos al Lobby Central del colegio. Elige cualquiera de las cuatro puertas para entrar a un mundo.');
        }
    } else if (worldKey === 'historia') {
        scene.background = new THREE.Color(0x7dd3fc);
        scene.fog = new THREE.FogExp2(0xbae6fd, 0.007);
        buildHistoriaWorld();
        buildWorldReturnPortal(0, 12);
        buildStationsForWorld('historia');
        window.currentMinigameSubject = 'historia';
        window.currentQuizSubject = 'historia';
        if (zoneEmoji) zoneEmoji.textContent = '🏺';
        if (zoneTitle) zoneTitle.textContent = 'MUNDO 1: HISTORIA Y GEOGRAFÍA • Pueblos Originarios de Chile';

        if (!silent) {
            showToast('🏺', 'Entraste a la Puerta 1: Pueblos Originarios de Chile.');
            speakChileanExpressive([
                { text: '¡Cruzaste la Puerta de Historia y Geografía!', pitch: 1.08, rate: 1.0, pauseAfter: 160 },
                { text: 'Aquí cada estación tiene su propia trivia y un mini juego para aprender sobre los pueblos originarios.', pitch: 1.03, rate: 0.98 }
            ]);
        }
    } else if (worldKey === 'ciencias') {
        scene.background = new THREE.Color(0x6ee7b7);
        scene.fog = new THREE.FogExp2(0xa7f3d0, 0.008);
        buildCienciasWorld();
        buildWorldReturnPortal(0, 12);
        buildStationsForWorld('ciencias');
        window.currentMinigameSubject = 'ciencias';
        window.currentQuizSubject = 'ciencias';
        if (zoneEmoji) zoneEmoji.textContent = '🔬';
        if (zoneTitle) zoneTitle.textContent = 'MUNDO 2: CIENCIAS NATURALES • Cuerpo Humano, Animales y Laboratorio del Agua';

        if (!silent) {
            showToast('🔬', 'Entraste a la Puerta 2: Ciencias Naturales.');
            speakChileanExpressive([
                { text: '¡Bienvenido al Mundo de Ciencias Naturales!', pitch: 1.08, rate: 1.0, pauseAfter: 160 },
                { text: 'Explora el corazón latiendo en tres D, los animales vertebrados e invertebrados y el laboratorio del agua.', pitch: 1.03, rate: 0.98 }
            ]);
        }
    } else if (worldKey === 'lenguaje') {
        scene.background = new THREE.Color(0xf0abfc);
        scene.fog = new THREE.FogExp2(0xf5d0fe, 0.008);
        buildLenguajeWorld();
        buildWorldReturnPortal(0, 13);
        buildStationsForWorld('lenguaje');
        window.currentMinigameSubject = 'lenguaje';
        window.currentQuizSubject = 'lenguaje';
        if (zoneEmoji) zoneEmoji.textContent = '📚';
        if (zoneTitle) zoneTitle.textContent = 'MUNDO 3: LENGUAJE Y COMUNICACIÓN • Cómic, Localizar Información, Vocabulario y Cuentos';

        if (!silent) {
            showToast('📚', 'Entraste a la Puerta 3: Lenguaje y Comunicación.');
            speakChileanExpressive([
                { text: '¡Entraste al Mundo de Lenguaje y Comunicación!', pitch: 1.08, rate: 1.0, pauseAfter: 160 },
                { text: 'Juega con el cómic, la lupa de información explícita, el ahorcado y las familias de palabras.', pitch: 1.03, rate: 0.98 }
            ]);
        }
    } else if (worldKey === 'matematicas') {
        scene.background = new THREE.Color(0x93c5fd);
        scene.fog = new THREE.FogExp2(0xbfdbfe, 0.0075);
        buildMatematicasWorld();
        buildWorldReturnPortal(0, 12);
        buildStationsForWorld('matematicas');
        window.currentMinigameSubject = 'matematicas';
        window.currentQuizSubject = 'matematicas';
        if (zoneEmoji) zoneEmoji.textContent = '🔢';
        if (zoneTitle) zoneTitle.textContent = 'MUNDO 4: MATEMÁTICAS • Decenas, Cálculo Mental y Geometría 3D';

        if (!silent) {
            showToast('🔢', 'Entraste a la Puerta 4: Matemáticas 2° Básico.');
            speakChileanExpressive([
                { text: '¡Bienvenido al Mundo de Matemáticas!', pitch: 1.08, rate: 1.0, pauseAfter: 160 },
                { text: 'Aprende sobre decenas, sumas, restas y cuerpos geométricos en tres D.', pitch: 1.03, rate: 0.98 }
            ]);
        }
    }

    updateHUD();
};

function interactWithNearestTarget() {
    if (!window.nearestTarget) return;
    if (window.nearestTarget.type === 'door') {
        window.enterWorld(window.nearestTarget.data.targetWorld);
    } else if (window.nearestTarget.type === 'npc') {
        window.openNpcModal(window.nearestTarget.data);
    }
}

function speakWelcomeIntro() {
    initAudio();
    speakChileanExpressive([
        { text: '¡Hola, explorador! Bienvenido a Colegio Craft tres D, tu mundo de aventuras de segundo básico.', pitch: 1.08, rate: 1.0, pauseAfter: 200 },
        { text: 'Aquí estás en el Lobby Central con cuatro puertas mágicas.', pitch: 1.04, rate: 0.98, pauseAfter: 180 },
        { text: 'En la Puerta uno aprenderás sobre los Pueblos Originarios en Historia.', pitch: 1.03, rate: 0.98, pauseAfter: 180 },
        { text: 'En la Puerta dos explorarás el corazón, los animales vertebrados e invertebrados y el agua en Ciencias Naturales.', pitch: 1.03, rate: 0.98, pauseAfter: 180 },
        { text: 'En la Puerta tres descubrirás el cómic, los cuentos y el vocabulario en Lenguaje. ¡Y en la Puerta cuatro practicarás Matemáticas!', pitch: 1.05, rate: 0.98 }
    ]);
}

function startGame() {
    initAudio();
    playSound('success');
    const modal = document.getElementById('welcome-modal');
    if (modal) modal.classList.add('hidden');
    showToast('🏰', '¡Camina hacia cualquiera de las 4 Puertas del Lobby o haz clic en ellas para viajar!');
    speakChileanExpressive('¡A jugar! Camina hacia una de las cuatro puertas mágicas o haz clic sobre su cartel para viajar a ese mundo.');
}

// Bucle de animación y renderizado
function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // 1. Movimiento del jugador
    const speed = 0.23;
    let moveZ = 0, moveX = 0;
    if (keys.up) moveZ -= 1;
    if (keys.down) moveZ += 1;
    if (keys.left) moveX -= 1;
    if (keys.right) moveX += 1;

    const isMoving = (moveX !== 0 || moveZ !== 0);
    if (isMoving && playerGroup) {
        const angle = Math.atan2(moveX, moveZ) + cameraYaw;
        playerGroup.rotation.y = angle + Math.PI;
        playerGroup.position.x += Math.sin(angle) * speed;
        playerGroup.position.z += Math.cos(angle) * speed;

        // Límites del mundo
        playerGroup.position.x = Math.max(-27, Math.min(27, playerGroup.position.x));
        playerGroup.position.z = Math.max(-48, Math.min(44, playerGroup.position.z));

        // Animación de balanceo de extremidades tipo Crossy Road / LEGO
        const swing = Math.sin(elapsed * 13) * 0.65;
        playerLeftLeg.rotation.x = swing;
        playerRightLeg.rotation.x = -swing;
        playerLeftArm.rotation.x = -swing;
        playerRightArm.rotation.x = swing;

        // Cabeza con leve inclinación al correr
        if (playerHead) playerHead.rotation.y = Math.sin(elapsed * 6.5) * 0.08;
    } else if (playerGroup) {
        // Idle: Respiración suave
        playerLeftLeg.rotation.x = 0;
        playerRightLeg.rotation.x = 0;
        playerLeftArm.rotation.x = 0;
        playerRightArm.rotation.x = 0;
        if (playerHead) playerHead.position.y = 1.95 + Math.sin(elapsed * 3) * 0.02;
    }

    // Parpadeo de ojos del jugador
    blinkTimer += 0.016;
    if (playerEyes) {
        if (blinkTimer > 3.5 && blinkTimer < 3.65) {
            playerEyes.scale.y = 0.1;
        } else {
            playerEyes.scale.y = 1.0;
            if (blinkTimer >= 3.65) blinkTimer = 0;
        }
    }

    // 2. Salto y gravedad
    if (playerGroup) {
        playerGroup.position.y += playerVelocityY;
        if (playerGroup.position.y > 0) {
            playerVelocityY -= 0.015;
        } else {
            if (!isGrounded && playerVelocityY < -0.1) {
                spawnBlockParticles(playerGroup.position.x, 0, playerGroup.position.z, 0x4ade80);
            }
            playerGroup.position.y = 0;
            playerVelocityY = 0;
            isGrounded = true;
        }
    }

    // 3. Seguimiento de cámara en 3ra persona con suave interpolación
    if (playerGroup) {
        const camDist = 11.5;
        const camX = playerGroup.position.x + Math.sin(cameraYaw) * camDist * Math.cos(cameraPitch);
        const camZ = playerGroup.position.z + Math.cos(cameraYaw) * camDist * Math.cos(cameraPitch);
        const camY = playerGroup.position.y + 2.4 + Math.sin(cameraPitch) * camDist;

        camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.18);
        camera.lookAt(playerGroup.position.x, playerGroup.position.y + 2.0, playerGroup.position.z);

        // Actualizar brújula y coordenadas
        updateCompassHUD(playerGroup.position, cameraYaw);
    }

    // 4. Nubes flotantes que cruzan el cielo lentamente
    if (cloudGroup) {
        cloudGroup.children.forEach(c => {
            c.position.x += 0.025;
            if (c.position.x > 85) c.position.x = -85;
        });
    }

    // 5. Partículas activas (desvanecimiento y física)
    for (let i = particleSystems.length - 1; i >= 0; i--) {
        const ps = particleSystems[i];
        ps.life -= 0.025;
        ps.group.children.forEach(p => {
            if (p.velocity) {
                p.position.add(p.velocity);
                p.velocity.y -= 0.008; // Gravedad en partículas
            }
        });
        if (ps.life <= 0) {
            scene.remove(ps.group);
            particleSystems.splice(i, 1);
        }
    }

    // 6. Objetos 3D animados
    animatedObjects.forEach((item) => {
        if (item.type === 'heartbeat') {
            const beat = 1 + Math.pow(Math.sin(elapsed * 3.6), 6) * 0.24;
            item.mesh.scale.set(beat, beat, beat);
        } else if (item.type === 'boat') {
            item.mesh.position.y = item.baseY + Math.sin(elapsed * 2.2 + item.phase) * 0.15;
            item.mesh.rotation.z = Math.sin(elapsed * 1.5 + item.phase) * 0.06;
        } else if (item.type === 'portal') {
            item.mesh.scale.x = 1 + Math.sin(elapsed * 3.2 + item.phase) * 0.05;
        } else if (item.type === 'pulse') {
            const sc = item.baseScale + Math.sin(elapsed * 4) * 0.16;
            item.mesh.scale.set(sc, 0.5, sc);
        }
    });

    // 7. Proyección de etiquetas y detección de proximidad
    let closest = null;
    let closestDist = 6.4;

    interactiveTargets.forEach((item) => {
        if (item.ring) item.ring.rotation.y = elapsed * 0.8;
        if (!playerGroup) return;
        const dist = playerGroup.position.distanceTo(item.group.position);

        // Si camina directo a la puerta (< 2.4 unidades)
        if (item.type === 'door' && dist < 2.4) {
            window.enterWorld(item.data.targetWorld);
            return;
        }

        if (dist < closestDist) {
            closestDist = dist;
            closest = item;
        }

        const labelEl = document.getElementById(`label-${item.data.id}`);
        if (labelEl) {
            const heightOffset = item.type === 'door' ? 9.2 : 3.6;
            const headPos = item.group.position.clone().add(new THREE.Vector3(0, heightOffset, 0));
            headPos.project(camera);
            if (headPos.z < 1 && dist < 58) {
                const x = (headPos.x * 0.5 + 0.5) * window.innerWidth;
                const y = (-(headPos.y * 0.5) + 0.5) * window.innerHeight;
                labelEl.style.left = `${x}px`;
                labelEl.style.top = `${y}px`;
                labelEl.style.display = 'block';
            } else {
                labelEl.style.display = 'none';
            }
        }
    });

    window.nearestTarget = closest;
    const promptBtn = document.getElementById('nearby-prompt');
    if (window.nearestTarget && promptBtn) {
        promptBtn.classList.remove('hidden');
        const promptText = document.getElementById('nearby-prompt-text');
        if (promptText) {
            if (window.nearestTarget.type === 'door') {
                promptText.textContent = `Entrar a ${window.nearestTarget.data.name} ${window.nearestTarget.data.emoji}`;
            } else {
                promptText.textContent = `Hablar con ${window.nearestTarget.data.name} ${window.nearestTarget.data.emoji}`;
            }
        }
    } else if (promptBtn) {
        promptBtn.classList.add('hidden');
    }

    renderer.render(scene, camera);
}

// Inicialización general al cargar la ventana
window.onload = function () {
    initThreeEngine();
    window.enterWorld('lobby', true);
    updateHUD();
    selectBlock(0);

    // Controles táctiles móviles
    const bindHoldButton = (id, keyName) => {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.addEventListener('mousedown', () => keys[keyName] = true);
        btn.addEventListener('mouseup', () => keys[keyName] = false);
        btn.addEventListener('mouseleave', () => keys[keyName] = false);
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); keys[keyName] = true; });
        btn.addEventListener('touchend', (e) => { e.preventDefault(); keys[keyName] = false; });
    };

    bindHoldButton('btn-up', 'up');
    bindHoldButton('btn-down', 'down');
    bindHoldButton('btn-left', 'left');
    bindHoldButton('btn-right', 'right');

    const jumpBtn = document.getElementById('btn-jump');
    if (jumpBtn) jumpBtn.addEventListener('click', jumpPlayer);

    animate();
};
