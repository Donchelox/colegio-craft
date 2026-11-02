/**
 * ColegioCraft 3D - Motor Gráfico Voxel Estilizado de Alta Definición
 * Personaje de Niño con Camiseta de Fútbol Roja (Arsenal) y Zapatillas Deportivas,
 * con vista frontal orientada correctamente hacia adelante (-Z).
 */

let scene, camera, renderer;
let worldContentGroup;
let playerGroup, playerHead, playerEyes, playerLeftArm, playerRightArm, playerLeftLeg, playerRightLeg;
let playerVelocityY = 0;
let isGrounded = true;
let cameraYaw = 0;
let cameraPitch = 0.38;

const keys = { up: false, down: false, left: false, right: false };
let interactiveTargets = [];
let animatedObjects = [];
let userBlocks = [];
let particleSystems = [];
let cloudGroup = null;

const raycaster = new THREE.Raycaster();
const mouseVec = new THREE.Vector2();
const boxGeo = new THREE.BoxGeometry(1, 1, 1);

// Paleta y caché de materiales voxel con acabado suave
const materialCache = new Map();

function getVoxelMaterial(hexColor, roughness = 0.62, emissive = 0x000000, opacity = 1.0) {
    const key = `${hexColor}_${roughness}_${emissive}_${opacity}`;
    if (!materialCache.has(key)) {
        materialCache.set(key, new THREE.MeshStandardMaterial({
            color: hexColor,
            roughness: roughness,
            metalness: 0.04,
            emissive: emissive,
            transparent: opacity < 1.0,
            opacity: opacity
        }));
    }
    return materialCache.get(key);
}

function addVoxel(parent, x, y, z, sx, sy, sz, color, emissive = 0x000000, opacity = 1.0) {
    const mat = getVoxelMaterial(color, 0.60, emissive, opacity);
    const mesh = new THREE.Mesh(boxGeo, mat);
    mesh.position.set(x, y, z);
    mesh.scale.set(sx, sy, sz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
}

// Inicialización del motor Three.js
function initThreeEngine() {
    const canvas = document.getElementById('game-canvas');
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x38bdf8);
    scene.fog = new THREE.FogExp2(0xbae6fd, 0.007);

    camera = new THREE.PerspectiveCamera(56, window.innerWidth / window.innerHeight, 0.1, 260);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Iluminación suave tipo diorama de estudio: Sol cálido + rebote celeste
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x475569, 0.85);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 0.98);
    dirLight.position.set(42, 78, 32);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0003;
    const d = 58;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);

    worldContentGroup = new THREE.Group();
    scene.add(worldContentGroup);

    createVoxelClouds();
    createDetailedVoxelBoy();
    setupEngineControls(canvas);
}

// Nubes voxel estilo diorama
function createVoxelClouds() {
    cloudGroup = new THREE.Group();
    const cloudMat = getVoxelMaterial(0xffffff, 0.9, 0x111111, 0.92);

    for (let c = 0; c < 14; c++) {
        const singleCloud = new THREE.Group();
        const baseWidth = 8 + Math.random() * 12;
        const baseDepth = 5 + Math.random() * 8;
        const posX = (Math.random() - 0.5) * 160;
        const posZ = (Math.random() - 0.5) * 160;
        const posY = 38 + Math.random() * 14;

        for (let b = 0; b < 6; b++) {
            const bx = (Math.random() - 0.5) * baseWidth;
            const bz = (Math.random() - 0.5) * baseDepth;
            const mesh = new THREE.Mesh(boxGeo, cloudMat);
            mesh.scale.set(4 + Math.random() * 4, 1.8, 3 + Math.random() * 3);
            mesh.position.set(bx, 0, bz);
            singleCloud.add(mesh);
        }

        singleCloud.position.set(posX, posY, posZ);
        cloudGroup.add(singleCloud);
    }
    scene.add(cloudGroup);
}

// ==========================================================================
// MODELO DEL NIÑO FUTBOLISTA (ARSENAL) ORIENTADO HACIA ADELANTE (-Z)
// ==========================================================================

function createDetailedVoxelBoy() {
    playerGroup = new THREE.Group();
    playerGroup.position.set(0, 0, 6);

    // Paleta exacta del niño de la imagen
    const skinTone = 0xfbd3b6;      // Piel cálida infantil
    const skinDark = 0xeabb96;      // Sombra sutil de nariz y articulaciones
    const hairDark = 0x1c1917;      // Pelo negro / castaño muy oscuro
    const hairMid = 0x292524;       // Reflejo mechones superiores
    const jerseyRed = 0xdc2626;     // Rojo Arsenal vibrante
    const collarMaroon = 0x881337;  // Granate cuello y franjas
    const white = 0xffffff;         // Blanco mangas y detalles
    const crestGold = 0xf59e0b;     // Escudo dorado
    const shortsNavy = 0x0f172a;    // Pantalones cortos azul marino
    const shoeNavy = 0x1e293b;      // Zapatillas azul marino
    const soleWhite = 0xf8fafc;     // Suela blanca

    // 1. PIERNAS CON ZAPATILLAS DEPORTIVAS (Frente hacia -Z)
    const buildLeg = (isLeft) => {
        const legGroup = new THREE.Group();
        const sideX = isLeft ? -0.22 : 0.22;
        legGroup.position.set(sideX, 0.96, 0);

        // Pantalón corto azul marino deportivo
        addVoxel(legGroup, 0, -0.10, 0, 0.36, 0.26, 0.38, shortsNavy);

        // Pierna / Rodilla al descubierto (Piel)
        addVoxel(legGroup, 0, -0.32, 0, 0.26, 0.22, 0.26, skinTone);
        addVoxel(legGroup, 0, -0.50, 0, 0.24, 0.20, 0.24, skinTone);

        // Zapatilla Deportiva / Sneaker (Puntera hacia -Z, talón hacia +Z)
        // Tobillo / lengüeta
        addVoxel(legGroup, 0, -0.66, -0.02, 0.32, 0.16, 0.36, shoeNavy);
        // Puntera frontal hacia adelante (-Z)
        addVoxel(legGroup, 0, -0.72, -0.13, 0.30, 0.14, 0.18, shoeNavy);
        // Talón hacia atrás (+Z)
        addVoxel(legGroup, 0, -0.70, 0.09, 0.32, 0.18, 0.18, shoeNavy);
        // Cordones blancos en el empeine (-Z)
        addVoxel(legGroup, 0, -0.63, -0.07, 0.20, 0.04, 0.14, white);
        addVoxel(legGroup, 0, -0.68, -0.14, 0.16, 0.04, 0.08, white);
        // Suela gruesa blanca en la base
        addVoxel(legGroup, 0, -0.80, -0.02, 0.36, 0.08, 0.46, soleWhite);

        return legGroup;
    };

    playerLeftLeg = buildLeg(true);
    playerRightLeg = buildLeg(false);
    playerGroup.add(playerLeftLeg);
    playerGroup.add(playerRightLeg);

    // 2. CADERA Y PANTALONES CORTOS
    addVoxel(playerGroup, 0, 1.05, 0, 0.74, 0.26, 0.46, shortsNavy);

    // 3. TORSO: CAMISETA ROJA CON DETALLES DE FÚTBOL
    // Cuerpo principal rojo
    addVoxel(playerGroup, 0, 1.48, 0, 0.72, 0.60, 0.44, jerseyRed);

    // Cuello en V granate
    addVoxel(playerGroup, 0, 1.76, -0.12, 0.32, 0.08, 0.24, collarMaroon);

    // Frente de la camiseta (orientado hacia -Z):
    // Letras del patrocinador ("Emirates FLY BETTER" estilo texto blanco)
    addVoxel(playerGroup, 0, 1.42, -0.23, 0.48, 0.11, 0.03, white);
    addVoxel(playerGroup, 0, 1.28, -0.23, 0.40, 0.08, 0.03, white);

    // Escudo dorado en el pecho izquierdo del niño (x = 0.20, z = -0.23)
    addVoxel(playerGroup, 0.20, 1.58, -0.23, 0.14, 0.16, 0.03, crestGold);
    addVoxel(playerGroup, 0.20, 1.58, -0.24, 0.08, 0.10, 0.03, jerseyRed);

    // Logotipo blanco en el pecho derecho del niño (x = -0.20, z = -0.23)
    addVoxel(playerGroup, -0.20, 1.58, -0.23, 0.12, 0.10, 0.03, white);

    // Cuello del niño
    addVoxel(playerGroup, 0, 1.82, 0, 0.28, 0.18, 0.28, skinTone);

    // 4. BRAZOS CON MANGAS BLANCAS Y RAYAS ROJAS
    const buildArm = (isLeft) => {
        const armGroup = new THREE.Group();
        const sideX = isLeft ? -0.46 : 0.46;
        armGroup.position.set(sideX, 1.70, 0);

        // Manga blanca acampanada (Imagen)
        addVoxel(armGroup, 0, -0.06, 0, 0.32, 0.26, 0.34, white);

        // 3 Rayas granate en la parte superior del hombro
        addVoxel(armGroup, 0, 0.05, -0.08, 0.28, 0.04, 0.05, collarMaroon);
        addVoxel(armGroup, 0, 0.05, 0.00, 0.28, 0.04, 0.05, collarMaroon);
        addVoxel(armGroup, 0, 0.05, 0.08, 0.28, 0.04, 0.05, collarMaroon);

        // Dobladillo granate en el borde de la manga
        addVoxel(armGroup, 0, -0.20, 0, 0.30, 0.05, 0.32, collarMaroon);

        // Brazo y antebrazo de piel
        addVoxel(armGroup, 0, -0.34, 0, 0.22, 0.24, 0.22, skinTone);
        addVoxel(armGroup, 0, -0.54, 0, 0.20, 0.22, 0.20, skinTone);

        // Mano infantil relajada
        addVoxel(armGroup, 0, -0.70, -0.01, 0.22, 0.16, 0.18, skinTone); // Palma
        addVoxel(armGroup, isLeft ? 0.11 : -0.11, -0.70, -0.04, 0.08, 0.10, 0.10, skinTone); // Pulgar hacia adentro
        addVoxel(armGroup, 0, -0.78, -0.02, 0.20, 0.08, 0.16, skinTone); // Dedos hacia adelante (-Z)

        return armGroup;
    };

    playerLeftArm = buildArm(true);
    playerRightArm = buildArm(false);
    playerGroup.add(playerLeftArm);
    playerGroup.add(playerRightArm);

    // 5. CABEZA, ROSTRO SONRIENTE Y CABELLO NEGRO (Frente mirando hacia -Z)
    playerHead = new THREE.Group();
    playerHead.position.set(0, 1.95, 0);

    // Cráneo y rostro base
    addVoxel(playerHead, 0, 0.28, 0, 0.76, 0.72, 0.70, skinTone);

    // Orejas en los lados
    addVoxel(playerHead, -0.40, 0.26, -0.02, 0.08, 0.18, 0.16, skinTone);
    addVoxel(playerHead, 0.40, 0.26, -0.02, 0.08, 0.18, 0.16, skinTone);
    addVoxel(playerHead, -0.41, 0.26, -0.02, 0.06, 0.10, 0.08, skinDark); // Interior oreja
    addVoxel(playerHead, 0.41, 0.26, -0.02, 0.06, 0.10, 0.08, skinDark);

    // Nariz 3D de niño hacia adelante (-Z)
    addVoxel(playerHead, 0, 0.25, -0.38, 0.14, 0.16, 0.12, skinDark);

    // Ojos expresivos de niño mirando hacia adelante (-Z)
    playerEyes = new THREE.Group();

    // Ojo Izquierdo (desde el punto de vista del niño, x = -0.17)
    addVoxel(playerEyes, -0.17, 0.34, -0.36, 0.17, 0.18, 0.04, white);       // Esclerótica
    addVoxel(playerEyes, -0.15, 0.36, -0.38, 0.11, 0.13, 0.04, hairDark);    // Pupila oscura
    addVoxel(playerEyes, -0.13, 0.39, -0.39, 0.04, 0.04, 0.03, white);       // Brillo de mirada

    // Ojo Derecho (x = +0.17)
    addVoxel(playerEyes, 0.17, 0.34, -0.36, 0.17, 0.18, 0.04, white);
    addVoxel(playerEyes, 0.15, 0.36, -0.38, 0.11, 0.13, 0.04, hairDark);
    addVoxel(playerEyes, 0.17, 0.39, -0.39, 0.04, 0.04, 0.03, white);

    playerHead.add(playerEyes);

    // Cejas oscuras definidas
    addVoxel(playerHead, -0.18, 0.46, -0.37, 0.22, 0.08, 0.06, hairDark);
    addVoxel(playerHead, 0.18, 0.46, -0.37, 0.22, 0.08, 0.06, hairDark);

    // Sonrisa alegre de niño con dientes blancos
    addVoxel(playerHead, 0, 0.13, -0.36, 0.26, 0.07, 0.04, white);       // Dientes blancos
    addVoxel(playerHead, 0, 0.09, -0.35, 0.30, 0.04, 0.03, 0xe28a8a);    // Línea labio inferior

    // Cabello negro peinado a capas (Fringe frontal hacia -Z)
    // Flequillo sobre la frente (escalonado como en la imagen)
    addVoxel(playerHead, 0, 0.58, -0.36, 0.78, 0.16, 0.10, hairDark);
    addVoxel(playerHead, -0.22, 0.49, -0.37, 0.12, 0.08, 0.06, hairDark);
    addVoxel(playerHead, -0.06, 0.51, -0.37, 0.12, 0.06, 0.06, hairDark);
    addVoxel(playerHead, 0.10, 0.49, -0.37, 0.12, 0.08, 0.06, hairDark);
    addVoxel(playerHead, 0.24, 0.51, -0.37, 0.10, 0.06, 0.06, hairDark);

    // Parte superior y volumen del peinado
    addVoxel(playerHead, 0, 0.65, -0.04, 0.82, 0.20, 0.74, hairDark);
    addVoxel(playerHead, 0, 0.74, -0.02, 0.74, 0.12, 0.66, hairDark);
    addVoxel(playerHead, -0.08, 0.79, -0.05, 0.46, 0.08, 0.46, hairMid); // Textura superior

    // Laterales y patillas
    addVoxel(playerHead, -0.39, 0.38, -0.08, 0.12, 0.36, 0.36, hairDark);
    addVoxel(playerHead, 0.39, 0.38, -0.08, 0.12, 0.36, 0.36, hairDark);

    // Parte posterior de la cabeza (hacia +Z, lo que ve la cámara desde atrás)
    addVoxel(playerHead, 0, 0.38, 0.36, 0.78, 0.50, 0.16, hairDark);
    addVoxel(playerHead, 0, 0.18, 0.34, 0.68, 0.16, 0.12, hairDark); // Nuca limpia

    playerGroup.add(playerHead);
    scene.add(playerGroup);
}

// ==========================================================================
// ÁRBOLES Y DIORAMA DE VEGETACIÓN DENSA MICRO-VOXEL
// ==========================================================================

function addMicroVoxelTree(group, x, y, z, trunkHeight = 4.5, scale = 1.0) {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(x, y, z);

    const woodDark = 0x57300a;
    const woodMid = 0x78350f;
    const folDark = 0x14532d;
    const folMid = 0x16a34a;
    const folLight = 0x4ade80;

    addVoxel(treeGroup, 0, trunkHeight * 0.4, 0, 0.75 * scale, trunkHeight * 0.8, 0.75 * scale, woodMid);
    addVoxel(treeGroup, 0, trunkHeight * 0.85, 0, 0.9 * scale, trunkHeight * 0.3, 0.9 * scale, woodDark);

    addVoxel(treeGroup, -0.5 * scale, trunkHeight, 0, 0.5 * scale, 0.4 * scale, 0.4 * scale, woodDark);
    addVoxel(treeGroup, 0.5 * scale, trunkHeight, 0, 0.5 * scale, 0.4 * scale, 0.4 * scale, woodDark);
    addVoxel(treeGroup, 0, trunkHeight, -0.5 * scale, 0.4 * scale, 0.4 * scale, 0.5 * scale, woodDark);
    addVoxel(treeGroup, 0, trunkHeight, 0.5 * scale, 0.4 * scale, 0.4 * scale, 0.5 * scale, woodDark);

    const baseCanopyY = trunkHeight + 0.8 * scale;
    const offsets = [
        [0, 0, 0, 3.8, 2.2, 3.8, folDark],
        [-1.2, 0.5, 0, 2.6, 2.0, 2.6, folMid],
        [1.2, 0.6, 0.3, 2.8, 2.2, 2.8, folMid],
        [0, 0.7, -1.2, 2.7, 2.0, 2.7, folMid],
        [0.4, 0.8, 1.2, 2.6, 2.0, 2.6, folMid],
        [-0.6, 1.4, -0.4, 2.8, 1.8, 2.8, folLight],
        [0.6, 1.5, 0.4, 2.6, 1.8, 2.6, folLight],
        [0, 2.2, 0, 2.2, 1.4, 2.2, folLight],
        [0.8, 2.0, -0.6, 1.4, 1.2, 1.4, folLight]
    ];

    offsets.forEach(([ox, oy, oz, sx, sy, sz, col]) => {
        addVoxel(treeGroup, ox * scale, baseCanopyY + oy * scale, oz * scale, sx * scale, sy * scale, sz * scale, col);
    });

    group.add(treeGroup);
    return treeGroup;
}

// Partículas de impacto
function spawnBlockParticles(x, y, z, color) {
    const count = 9;
    const pGroup = new THREE.Group();
    pGroup.position.set(x, y, z);

    for (let i = 0; i < count; i++) {
        const p = addVoxel(pGroup, 0, 0, 0, 0.16, 0.16, 0.16, color);
        p.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.18,
            0.12 + Math.random() * 0.16,
            (Math.random() - 0.5) * 0.18
        );
    }
    scene.add(pGroup);
    particleSystems.push({ group: pGroup, life: 1.0 });
}

// 1. LOBBY CENTRAL CON 4 PUERTAS
function buildLobbyWorld() {
    addVoxel(worldContentGroup, 0, -0.6, 0, 72, 1.2, 72, 0xb45309);
    addVoxel(worldContentGroup, 0, -0.42, 0, 24, 1.0, 24, 0xf1f5f9);

    addVoxel(worldContentGroup, 0, -0.38, -16, 6.5, 1, 18, 0xfde68a);
    addVoxel(worldContentGroup, 16, -0.38, 0, 18, 1, 6.5, 0xa7f3d0);
    addVoxel(worldContentGroup, -16, -0.38, 0, 18, 1, 6.5, 0xf5d0fe);
    addVoxel(worldContentGroup, 0, -0.38, 16, 6.5, 1, 18, 0xbae6fd);

    addVoxel(worldContentGroup, 0, 0.35, 0, 6.4, 0.9, 6.4, 0x64748b);
    addVoxel(worldContentGroup, 0, 0.75, 0, 5.2, 0.4, 5.2, 0x38bdf8, 0x0284c7, 0.85);
    addVoxel(worldContentGroup, 0, 2.0, 0, 1.4, 2.8, 1.4, 0x94a3b8);
    const fountainTop = addVoxel(worldContentGroup, 0, 3.5, 0, 2.2, 0.6, 2.2, 0x38bdf8, 0x0ea5e9, 0.88);
    animatedObjects.push({ mesh: fountainTop, type: 'pulse', baseScale: 2.2 });

    [[-7, -7], [7, -7], [-7, 7], [7, 7]].forEach(([lx, lz]) => {
        addVoxel(worldContentGroup, lx, 1.8, lz, 0.4, 3.6, 0.4, 0x334155);
        addVoxel(worldContentGroup, lx, 3.6, lz, 0.95, 0.95, 0.95, 0xfef08a, 0xf59e0b);
    });

    addMicroVoxelTree(worldContentGroup, -18, 0, -18, 4.8, 1.15);
    addMicroVoxelTree(worldContentGroup, 18, 0, -18, 4.6, 1.1);
    addMicroVoxelTree(worldContentGroup, -18, 0, 18, 4.7, 1.12);
    addMicroVoxelTree(worldContentGroup, 18, 0, 18, 4.9, 1.2);

    const labelsContainer = document.getElementById('labels-container');
    labelsContainer.innerHTML = '';

    LOBBY_DOORS.forEach((door) => {
        const doorGroup = new THREE.Group();
        doorGroup.position.set(door.pos.x, 0, door.pos.z);

        if (Math.abs(door.pos.x) > 0) {
            doorGroup.rotation.y = Math.PI / 2;
        }

        addVoxel(doorGroup, 0, 0.25, 0, 9.2, 0.5, 5.0, 0x1e293b);
        addVoxel(doorGroup, 0, 0.65, 0, 7.8, 0.4, 3.8, door.frameColor);

        addVoxel(doorGroup, -2.9, 4.4, 0, 1.4, 7.4, 1.4, door.color);
        addVoxel(doorGroup, 2.9, 4.4, 0, 1.4, 7.4, 1.4, door.color);
        addVoxel(doorGroup, 0, 8.2, 0, 7.4, 1.5, 1.6, door.color);
        addVoxel(doorGroup, 0, 9.2, 0, 5.0, 1.0, 1.4, door.frameColor);

        const portalGlow = addVoxel(doorGroup, 0, 4.4, 0, 4.4, 7.0, 0.45, door.frameColor, door.color, 0.9);
        animatedObjects.push({ mesh: portalGlow, type: 'portal', phase: Math.random() * 4 });

        worldContentGroup.add(doorGroup);
        interactiveTargets.push({ type: 'door', group: doorGroup, data: door });

        const label = document.createElement('div');
        label.className = 'npc-label';
        label.id = `label-${door.id}`;
        label.onclick = () => window.enterWorld(door.targetWorld);
        label.innerHTML = `
            <div class="mc-nameplate-portal float-bob">
                <div class="flex items-center justify-center gap-2">
                    <span class="text-2xl">${door.emoji}</span>
                    <span class="pixel-font text-xs sm:text-sm text-amber-300 font-extrabold whitespace-nowrap">${door.name}</span>
                </div>
                <div class="text-[11px] font-bold text-slate-200 mt-0.5">${door.subtitle}</div>
                <div class="mc-btn mc-btn-gold text-[10px] font-extrabold px-3 py-1 mt-1 rounded">
                    ¡ENTRAR AQUÍ (Clic)!
                </div>
            </div>
        `;
        labelsContainer.appendChild(label);
    });
}

// 2. MUNDO 1: HISTORIA Y GEOGRAFÍA
function buildHistoriaWorld() {
    addVoxel(worldContentGroup, -28, -0.6, 0, 26, 1, 110, 0x0284c7, 0x0369a1, 0.9);
    addVoxel(worldContentGroup, 2, -0.5, -30, 34, 1, 34, 0xfbbf24);
    addVoxel(worldContentGroup, 14, 2.5, -42, 14, 5, 14, 0xd97706);
    addVoxel(worldContentGroup, 14, 5.2, -42, 8, 2, 8, 0xf8fafc);

    addVoxel(worldContentGroup, -10, 1.6, -42, 5.0, 3.2, 5.0, 0xa8a29e);
    addVoxel(worldContentGroup, -10, 3.5, -42, 5.8, 0.9, 5.8, 0xeab308);

    for (let s = 0; s < 3; s++) {
        addVoxel(worldContentGroup, -2, 0.5 + s * 0.8, -44 - s * 2.4, 8, 0.8, 2.2, 0x78350f);
        addVoxel(worldContentGroup, -2, 0.95 + s * 0.8, -44 - s * 2.4, 8, 0.2, 2.2, 0x84cc16);
    }

    const balsa = new THREE.Group();
    balsa.position.set(-20, 0.15, -16);
    addVoxel(balsa, -0.8, 0, 0, 1.1, 0.8, 4.4, 0x92400e);
    addVoxel(balsa, 0.8, 0, 0, 1.1, 0.8, 4.4, 0x92400e);
    addVoxel(balsa, 0, 0.5, 0, 2.2, 0.25, 3.4, 0xd97706);
    worldContentGroup.add(balsa);
    animatedObjects.push({ mesh: balsa, type: 'boat', baseY: 0.15, phase: 0 });

    addVoxel(worldContentGroup, 2, -0.5, 0, 34, 1, 30, 0x22c55e);
    addVoxel(worldContentGroup, 20, 4.5, -2, 15, 9, 15, 0x475569);
    addVoxel(worldContentGroup, 20, 11, -2, 9, 4, 9, 0xf8fafc);
    addVoxel(worldContentGroup, 6, 1.6, 0, 6.0, 3.2, 6.0, 0x78350f);
    addVoxel(worldContentGroup, 6, 3.6, 0, 6.8, 1.2, 6.8, 0xca8a04);

    [[-8, -4], [10, 7], [-8, 7]].forEach(([ax, az]) => {
        addVoxel(worldContentGroup, ax, 3.2, az, 0.9, 6.4, 0.9, 0x57534e);
        addVoxel(worldContentGroup, ax, 6.6, az, 4.6, 0.9, 4.6, 0x15803d);
        addVoxel(worldContentGroup, ax, 7.8, az, 2.6, 0.8, 2.6, 0x166534);
    });

    addVoxel(worldContentGroup, -10, -0.55, 30, 22, 1, 34, 0x0369a1);
    addVoxel(worldContentGroup, -12, -0.2, 28, 8, 1, 8, 0xe2e8f0);
    addVoxel(worldContentGroup, 10, -0.5, 30, 18, 1, 34, 0xf1f5f9);

    const dalca = new THREE.Group();
    dalca.position.set(-18, 0.2, 28);
    addVoxel(dalca, 0, 0.25, 0, 2.2, 0.7, 5.8, 0x78350f);
    const fireMesh = addVoxel(dalca, 0, 0.9, 0, 0.7, 0.8, 0.7, 0xf97316, 0xe11d48);
    animatedObjects.push({ mesh: fireMesh, type: 'pulse', baseScale: 0.7 });
    worldContentGroup.add(dalca);
    animatedObjects.push({ mesh: dalca, type: 'boat', baseY: 0.2, phase: 1.5 });

    addVoxel(worldContentGroup, 14, 0.9, 34, 4.4, 1.5, 4.4, 0xd97706);
    addVoxel(worldContentGroup, 14, 2.2, 34, 3.0, 1.5, 3.0, 0xb45309);
    addVoxel(worldContentGroup, 14, 3.5, 34, 1.6, 1.5, 1.6, 0x92400e);
}

// 3. MUNDO 2: CIENCIAS NATURALES
function buildCienciasWorld() {
    addVoxel(worldContentGroup, 0, -0.5, 4, 56, 1, 76, 0x34d399);
    addVoxel(worldContentGroup, 0, -0.42, 4, 7, 1, 70, 0xf1f5f9);

    const heartGroup = new THREE.Group();
    heartGroup.position.set(-16, 4.2, -24);
    addVoxel(heartGroup, 0, 0, 0, 3.2, 3.2, 2.4, 0xe11d48, 0x990022);
    addVoxel(heartGroup, -1.2, 1.6, 0, 1.6, 1.6, 2.0, 0xf43f5e, 0x990022);
    addVoxel(heartGroup, 1.2, 1.6, 0, 1.6, 1.6, 2.0, 0xf43f5e, 0x990022);
    addVoxel(heartGroup, 0, 2.8, 0, 0.9, 1.4, 0.9, 0x2563eb);
    worldContentGroup.add(heartGroup);
    animatedObjects.push({ mesh: heartGroup, type: 'heartbeat', phase: 0 });

    const skelX = -8, skelZ = -26;
    addVoxel(worldContentGroup, skelX, 1.3, skelZ, 1.3, 2.6, 0.7, 0xf8fafc);
    addVoxel(worldContentGroup, skelX, 3.4, skelZ, 2.0, 2.4, 0.9, 0xf1f5f9);
    addVoxel(worldContentGroup, skelX, 5.2, skelZ, 1.5, 1.5, 1.5, 0xffffff);

    addVoxel(worldContentGroup, 16, -0.35, -22, 14, 1, 14, 0xea580c);
    addVoxel(worldContentGroup, 16, -0.3, -22, 9, 1, 9, 0x4ade80);

    addVoxel(worldContentGroup, -16, -0.35, 4, 13, 1, 13, 0x0ea5e9, 0x0284c7, 0.9);
    addVoxel(worldContentGroup, -17, 0.25, 4, 3.6, 0.3, 3.6, 0x15803d);
    addVoxel(worldContentGroup, -17, 1.0, 4, 1.8, 1.2, 2.0, 0x22c55e);
    addVoxel(worldContentGroup, -17.6, 1.7, 4.6, 0.45, 0.45, 0.45, 0xfef08a);
    addVoxel(worldContentGroup, -16.4, 1.7, 4.6, 0.45, 0.45, 0.45, 0xfef08a);

    const butterfly = new THREE.Group();
    butterfly.position.set(17, 4.2, 4);
    addVoxel(butterfly, 0, 0, 0, 0.55, 0.55, 2.6, 0x1e293b);
    addVoxel(butterfly, -1.8, 0, 0, 2.8, 0.2, 2.4, 0xf472b6, 0xdb2777);
    addVoxel(butterfly, 1.8, 0, 0, 2.8, 0.2, 2.4, 0xf472b6, 0xdb2777);
    worldContentGroup.add(butterfly);
    animatedObjects.push({ mesh: butterfly, type: 'boat', baseY: 4.2, phase: 0.8 });

    addVoxel(worldContentGroup, 14, 0.1, 26, 11, 0.4, 11, 0xe0f2fe);
    addVoxel(worldContentGroup, 15, 2.0, 28, 3.4, 3.4, 3.4, 0x38bdf8, 0x0284c7, 0.85);
    addVoxel(worldContentGroup, 19, 1.6, 24, 2.6, 2.6, 2.6, 0xbae6fd, 0x7dd3fc, 0.8);
}

// 4. MUNDO 3: LENGUAJE Y COMUNICACIÓN
function buildLenguajeWorld() {
    addVoxel(worldContentGroup, 0, -0.5, 2, 56, 1, 72, 0xfdf4ff);
    addVoxel(worldContentGroup, 0, -0.4, 2, 7, 1, 64, 0xfbcfe8);

    addVoxel(worldContentGroup, -16, 3.4, -22, 8.4, 6.4, 0.8, 0x1e293b);
    addVoxel(worldContentGroup, -16, 3.4, -21.5, 7.4, 5.4, 0.4, 0xfef08a);
    addVoxel(worldContentGroup, -15, 4.5, -21.1, 3.4, 1.8, 0.4, 0xffffff);

    addVoxel(worldContentGroup, 16, 2.0, -22, 0.85, 3.8, 0.85, 0x78350f);
    addVoxel(worldContentGroup, 16, 5.2, -22, 3.8, 3.8, 0.6, 0x0284c7);
    addVoxel(worldContentGroup, 16, 5.2, -22, 2.6, 2.6, 0.7, 0xe0f2fe, 0x38bdf8, 0.8);

    addMicroVoxelTree(worldContentGroup, 16, 0, 6, 6.2, 1.3);

    addVoxel(worldContentGroup, 0, 3.2, 29, 11, 6.4, 6.4, 0xf43f5e);
    addVoxel(worldContentGroup, -4.8, 4.8, 29, 2.6, 9.6, 2.6, 0xe11d48);
    addVoxel(worldContentGroup, 4.8, 4.8, 29, 2.6, 9.6, 2.6, 0xe11d48);
    addVoxel(worldContentGroup, -4.8, 10.2, 29, 3.2, 1.8, 3.2, 0xfacc15);
    addVoxel(worldContentGroup, 4.8, 10.2, 29, 3.2, 1.8, 3.2, 0xfacc15);
}

// 5. MUNDO 4: MATEMÁTICAS
function buildMatematicasWorld() {
    addVoxel(worldContentGroup, 0, -0.5, 0, 52, 1, 56, 0xe0f2fe);
    addVoxel(worldContentGroup, 0, -0.4, 0, 7, 1, 48, 0x7dd3fc);

    for (let t = 0; t < 4; t++) {
        for (let y = 0; y < 10; y++) {
            addVoxel(worldContentGroup, -16 + t * 2.0, 0.55 + y * 0.95, -16, 1.3, 0.9, 1.3, 0x0284c7);
        }
    }

    addVoxel(worldContentGroup, -6.5, 0.6, -16, 1.2, 1.2, 1.2, 0xfacc15);
    addVoxel(worldContentGroup, -4.8, 0.6, -16, 1.2, 1.2, 1.2, 0xfacc15);

    addVoxel(worldContentGroup, 14, 3.4, -16, 1.3, 4.4, 1.3, 0x16a34a);
    addVoxel(worldContentGroup, 14, 3.4, -16, 4.4, 1.3, 1.3, 0x16a34a);

    addVoxel(worldContentGroup, 6, 2.2, 16, 4.4, 4.4, 4.4, 0xf97316);
    addVoxel(worldContentGroup, -6, 2.2, 16, 4.4, 4.4, 4.4, 0x8b5cf6);
}

// Portal de regreso
function buildWorldReturnPortal(x, z) {
    const pGroup = new THREE.Group();
    pGroup.position.set(x, 0, z);
    addVoxel(pGroup, 0, 0.25, 0, 5.0, 0.5, 2.8, 0x1e293b);
    addVoxel(pGroup, -1.8, 2.6, 0, 0.8, 4.8, 0.8, 0xfacc15);
    addVoxel(pGroup, 1.8, 2.6, 0, 0.8, 4.8, 0.8, 0xfacc15);
    addVoxel(pGroup, 0, 5.2, 0, 4.4, 0.9, 1.0, 0xfacc15);
    const glow = addVoxel(pGroup, 0, 2.6, 0, 2.8, 4.4, 0.3, 0xfef08a, 0xca8a04, 0.9);
    animatedObjects.push({ mesh: glow, type: 'portal', phase: 0 });
    worldContentGroup.add(pGroup);

    const doorData = {
        id: 'return_lobby',
        targetWorld: 'lobby',
        name: 'PORTAL AL LOBBY',
        emoji: '🏰'
    };
    interactiveTargets.push({ type: 'door', group: pGroup, data: doorData });

    const label = document.createElement('div');
    label.className = 'npc-label';
    label.id = 'label-return_lobby';
    label.onclick = () => window.enterWorld('lobby');
    label.innerHTML = `
        <div class="mc-nameplate-portal">
            <span class="pixel-font text-xs text-yellow-300 font-extrabold">🚪 Volver al Lobby Central</span>
        </div>
    `;
    document.getElementById('labels-container').appendChild(label);
}

// Guardianes / NPCs
function buildStationsForWorld(worldKey) {
    const stations = WORLD_STATIONS[worldKey] || [];
    const labelsContainer = document.getElementById('labels-container');

    stations.forEach((st) => {
        const npcGroup = new THREE.Group();
        npcGroup.position.set(st.pos.x, 0, st.pos.z);

        addVoxel(npcGroup, -0.22, 0.45, 0, 0.34, 0.9, 0.34, 0x1e293b);
        addVoxel(npcGroup, 0.22, 0.45, 0, 0.34, 0.9, 0.34, 0x1e293b);

        addVoxel(npcGroup, 0, 1.38, 0, 0.92, 1.08, 0.54, st.color);
        addVoxel(npcGroup, 0, 1.02, 0, 0.94, 0.14, 0.56, 0x3d1f0a);

        addVoxel(npcGroup, -0.66, 1.38, 0, 0.30, 0.98, 0.30, st.color);
        addVoxel(npcGroup, 0.66, 1.38, 0, 0.30, 0.98, 0.30, st.color);
        addVoxel(npcGroup, -0.66, 0.80, 0, 0.24, 0.20, 0.24, 0xfbd3b6);
        addVoxel(npcGroup, 0.66, 0.80, 0, 0.24, 0.20, 0.24, 0xfbd3b6);

        addVoxel(npcGroup, 0, 2.30, 0, 0.76, 0.74, 0.70, 0xfbd3b6);
        addVoxel(npcGroup, 0, 2.76, 0, 0.84, 0.28, 0.84, st.color);
        addVoxel(npcGroup, 0, 2.94, 0, 0.54, 0.18, 0.54, 0xfacc15);

        // Ojos del NPC mirando hacia adelante (-Z)
        addVoxel(npcGroup, -0.16, 2.32, -0.36, 0.12, 0.14, 0.04, 0x0f172a);
        addVoxel(npcGroup, 0.16, 2.32, -0.36, 0.12, 0.14, 0.04, 0x0f172a);
        addVoxel(npcGroup, -0.15, 2.36, -0.37, 0.04, 0.04, 0.03, 0xffffff);
        addVoxel(npcGroup, 0.17, 2.36, -0.37, 0.04, 0.04, 0.03, 0xffffff);

        const ring = addVoxel(npcGroup, 0, 0.06, 0, 2.4, 0.1, 2.4, 0xfacc15, 0xca8a04);

        worldContentGroup.add(npcGroup);
        interactiveTargets.push({ type: 'npc', group: npcGroup, data: st, ring });

        const isDone = window.completedStations && window.completedStations.has(st.id);
        const label = document.createElement('div');
        label.className = 'npc-label';
        label.id = `label-${st.id}`;
        label.onclick = () => window.openNpcModal(st);
        label.innerHTML = `
            <div class="mc-nameplate float-bob">
                <div class="flex items-center justify-center gap-1.5">
                    <span class="text-base">${st.emoji}</span>
                    <span class="pixel-font text-[11px] text-amber-300 font-extrabold whitespace-nowrap">${st.name}</span>
                    <span id="check-${st.id}" class="${isDone ? '' : 'hidden'} text-emerald-400">🏅</span>
                </div>
                <div class="text-[10px] text-amber-200 font-bold">${st.badge} • Clic para aprender</div>
            </div>
        `;
        labelsContainer.appendChild(label);
    });
}

// Configuración de controles
function setupEngineControls(canvas) {
    let isDragging = false;
    let prevX = 0, prevY = 0;
    let dragMoved = false;

    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragMoved = false;
        prevX = e.clientX;
        prevY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMoved = true;
        cameraYaw -= dx * 0.007;
        cameraPitch = Math.max(0.1, Math.min(1.18, cameraPitch + dy * 0.006));
        prevX = e.clientX;
        prevY = e.clientY;
    });

    window.addEventListener('mouseup', (e) => {
        if (isDragging && !dragMoved) {
            handleCanvasRaycast(e.clientX, e.clientY);
        }
        isDragging = false;
    });

    canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            dragMoved = false;
            prevX = e.touches[0].clientX;
            prevY = e.touches[0].clientY;
        }
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        const dx = e.touches[0].clientX - prevX;
        const dy = e.touches[0].clientY - prevY;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragMoved = true;
        cameraYaw -= dx * 0.007;
        cameraPitch = Math.max(0.1, Math.min(1.18, cameraPitch + dy * 0.006));
        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;
    }, { passive: true });

    canvas.addEventListener('touchend', () => { isDragging = false; });

    window.addEventListener('keydown', (e) => {
        const code = e.code;
        if (code === 'KeyW' || code === 'ArrowUp') keys.up = true;
        if (code === 'KeyS' || code === 'ArrowDown') keys.down = true;
        if (code === 'KeyA' || code === 'ArrowLeft') keys.left = true;
        if (code === 'KeyD' || code === 'ArrowRight') keys.right = true;
        if (code === 'Space') window.jumpPlayer();
        if (code === 'KeyE') window.placeVoxelBlock();
        if (code === 'KeyQ') window.removeVoxelBlock();
        if (code >= 'Digit1' && code <= 'Digit6') {
            window.selectBlock(parseInt(code.replace('Digit', '')) - 1);
        }
    });

    window.addEventListener('keyup', (e) => {
        const code = e.code;
        if (code === 'KeyW' || code === 'ArrowUp') keys.up = false;
        if (code === 'KeyS' || code === 'ArrowDown') keys.down = false;
        if (code === 'KeyA' || code === 'ArrowLeft') keys.left = false;
        if (code === 'KeyD' || code === 'ArrowRight') keys.right = false;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function handleCanvasRaycast(clientX, clientY) {
    mouseVec.x = (clientX / window.innerWidth) * 2 - 1;
    mouseVec.y = -(clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouseVec, camera);

    for (const item of interactiveTargets) {
        const intersects = raycaster.intersectObjects(item.group.children, true);
        if (intersects.length > 0) {
            if (item.type === 'door') {
                window.enterWorld(item.data.targetWorld);
            } else {
                window.openNpcModal(item.data);
            }
            return;
        }
    }
}
