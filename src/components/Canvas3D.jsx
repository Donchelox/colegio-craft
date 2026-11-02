import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGame } from '../context/GameContext';
import { useKnowledge } from '../context/KnowledgeContext';
import { playSound } from '../services/audioService';

export default function Canvas3D() {
  const canvasRef = useRef(null);
  const {
    currentWorld,
    enterWorld,
    returnToLobby,
    openStationModal,
    setCompassInfo
  } = useGame();

  const { knowledgeBase } = useKnowledge();

  // Mantener referencias para Three.js sin recrear la escena en cada render
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const playerRef = useRef({});
  const worldContentGroupRef = useRef(null);
  const interactiveTargetsRef = useRef([]);
  const animatedObjectsRef = useRef([]);
  const particleSystemsRef = useRef([]);
  const keysRef = useRef({ up: false, down: false, left: false, right: false });
  const cameraAnglesRef = useRef({ yaw: 0, pitch: 0.38 });
  const isMouseDownRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // 1. Inicialización de Three.js (Una sola vez al montar)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x38bdf8);
    scene.fog = new THREE.FogExp2(0xbae6fd, 0.007);
    sceneRef.current = scene;

    // Cámara
    const camera = new THREE.PerspectiveCamera(56, window.innerWidth / window.innerHeight, 0.1, 280);
    cameraRef.current = camera;

    // Renderizador WebGL
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Iluminación diorama
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

    // Contenedor del mundo
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);
    worldContentGroupRef.current = worldGroup;

    // Nubes
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      transparent: true,
      opacity: 0.92
    });
    const cloudGroup = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
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

    // 2. CONSTRUCCIÓN DEL NIÑO FUTBOLISTA (ARSENAL) MIRANDO HACIA ADELANTE (-Z)
    const playerGroup = new THREE.Group();
    playerGroup.position.set(0, 0, 6);

    const skinTone = 0xfbd3b6;
    const skinDark = 0xeabb96;
    const hairDark = 0x1c1917;
    const hairMid = 0x292524;
    const jerseyRed = 0xdc2626;
    const collarMaroon = 0x881337;
    const white = 0xffffff;
    const crestGold = 0xf59e0b;
    const shortsNavy = 0x0f172a;
    const shoeNavy = 0x1e293b;
    const soleWhite = 0xf8fafc;

    const addV = (parent, x, y, z, sx, sy, sz, col, emissive = 0x000000, opacity = 1.0) => {
      const mat = new THREE.MeshStandardMaterial({
        color: col,
        roughness: 0.60,
        metalness: 0.04,
        emissive: emissive,
        transparent: opacity < 1.0,
        opacity: opacity
      });
      const mesh = new THREE.Mesh(boxGeo, mat);
      mesh.position.set(x, y, z);
      mesh.scale.set(sx, sy, sz);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };

    // Piernas (Puntera hacia -Z)
    const buildLeg = (isLeft) => {
      const legGroup = new THREE.Group();
      legGroup.position.set(isLeft ? -0.22 : 0.22, 0.96, 0);
      addV(legGroup, 0, -0.10, 0, 0.36, 0.26, 0.38, shortsNavy);
      addV(legGroup, 0, -0.32, 0, 0.26, 0.22, 0.26, skinTone);
      addV(legGroup, 0, -0.50, 0, 0.24, 0.20, 0.24, skinTone);
      addV(legGroup, 0, -0.66, -0.02, 0.32, 0.16, 0.36, shoeNavy);
      addV(legGroup, 0, -0.72, -0.13, 0.30, 0.14, 0.18, shoeNavy);
      addV(legGroup, 0, -0.70, 0.09, 0.32, 0.18, 0.18, shoeNavy);
      addV(legGroup, 0, -0.63, -0.07, 0.20, 0.04, 0.14, white);
      addV(legGroup, 0, -0.68, -0.14, 0.16, 0.04, 0.08, white);
      addV(legGroup, 0, -0.80, -0.02, 0.36, 0.08, 0.46, soleWhite);
      return legGroup;
    };

    const playerLeftLeg = buildLeg(true);
    const playerRightLeg = buildLeg(false);
    playerGroup.add(playerLeftLeg);
    playerGroup.add(playerRightLeg);

    // Cadera
    addV(playerGroup, 0, 1.05, 0, 0.74, 0.26, 0.46, shortsNavy);

    // Torso con camiseta roja del Arsenal (frente hacia -Z)
    addV(playerGroup, 0, 1.48, 0, 0.72, 0.60, 0.44, jerseyRed);
    addV(playerGroup, 0, 1.76, -0.12, 0.32, 0.08, 0.24, collarMaroon);
    addV(playerGroup, 0, 1.42, -0.23, 0.48, 0.11, 0.03, white);
    addV(playerGroup, 0, 1.28, -0.23, 0.40, 0.08, 0.03, white);
    addV(playerGroup, 0.20, 1.58, -0.23, 0.14, 0.16, 0.03, crestGold);
    addV(playerGroup, -0.20, 1.58, -0.23, 0.12, 0.10, 0.03, white);
    addV(playerGroup, 0, 1.82, 0, 0.28, 0.18, 0.28, skinTone);

    // Brazos con mangas blancas y franjas
    const buildArm = (isLeft) => {
      const armGroup = new THREE.Group();
      armGroup.position.set(isLeft ? -0.46 : 0.46, 1.70, 0);
      addV(armGroup, 0, -0.06, 0, 0.32, 0.26, 0.34, white);
      addV(armGroup, 0, 0.05, -0.08, 0.28, 0.04, 0.05, collarMaroon);
      addV(armGroup, 0, 0.05, 0.00, 0.28, 0.04, 0.05, collarMaroon);
      addV(armGroup, 0, 0.05, 0.08, 0.28, 0.04, 0.05, collarMaroon);
      addV(armGroup, 0, -0.20, 0, 0.30, 0.05, 0.32, collarMaroon);
      addV(armGroup, 0, -0.34, 0, 0.22, 0.24, 0.22, skinTone);
      addV(armGroup, 0, -0.54, 0, 0.20, 0.22, 0.20, skinTone);
      addV(armGroup, 0, -0.70, -0.01, 0.22, 0.16, 0.18, skinTone);
      addV(armGroup, isLeft ? 0.11 : -0.11, -0.70, -0.04, 0.08, 0.10, 0.10, skinTone);
      addV(armGroup, 0, -0.78, -0.02, 0.20, 0.08, 0.16, skinTone);
      return armGroup;
    };

    const playerLeftArm = buildArm(true);
    const playerRightArm = buildArm(false);
    playerGroup.add(playerLeftArm);
    playerGroup.add(playerRightArm);

    // Cabeza (Frente mirando hacia -Z)
    const playerHead = new THREE.Group();
    playerHead.position.set(0, 1.95, 0);
    addV(playerHead, 0, 0.28, 0, 0.76, 0.72, 0.70, skinTone);
    addV(playerHead, -0.40, 0.26, -0.02, 0.08, 0.18, 0.16, skinTone);
    addV(playerHead, 0.40, 0.26, -0.02, 0.08, 0.18, 0.16, skinTone);
    addV(playerHead, 0, 0.25, -0.38, 0.14, 0.16, 0.12, skinDark);

    // Ojos hacia -Z
    const playerEyes = new THREE.Group();
    addV(playerEyes, -0.17, 0.34, -0.36, 0.17, 0.18, 0.04, white);
    addV(playerEyes, -0.15, 0.36, -0.38, 0.11, 0.13, 0.04, hairDark);
    addV(playerEyes, -0.13, 0.39, -0.39, 0.04, 0.04, 0.03, white);
    addV(playerEyes, 0.17, 0.34, -0.36, 0.17, 0.18, 0.04, white);
    addV(playerEyes, 0.15, 0.36, -0.38, 0.11, 0.13, 0.04, hairDark);
    addV(playerEyes, 0.17, 0.39, -0.39, 0.04, 0.04, 0.03, white);
    playerHead.add(playerEyes);

    // Cejas y Sonrisa
    addV(playerHead, -0.18, 0.46, -0.37, 0.22, 0.08, 0.06, hairDark);
    addV(playerHead, 0.18, 0.46, -0.37, 0.22, 0.08, 0.06, hairDark);
    addV(playerHead, 0, 0.13, -0.36, 0.26, 0.07, 0.04, white);
    addV(playerHead, 0, 0.09, -0.35, 0.30, 0.04, 0.03, 0xe28a8a);

    // Cabello negro peinado a capas
    addV(playerHead, 0, 0.58, -0.36, 0.78, 0.16, 0.10, hairDark);
    addV(playerHead, -0.22, 0.49, -0.37, 0.12, 0.08, 0.06, hairDark);
    addV(playerHead, 0.10, 0.49, -0.37, 0.12, 0.08, 0.06, hairDark);
    addV(playerHead, 0, 0.65, -0.04, 0.82, 0.20, 0.74, hairDark);
    addV(playerHead, 0, 0.74, -0.02, 0.74, 0.12, 0.66, hairDark);
    addV(playerHead, -0.08, 0.79, -0.05, 0.46, 0.08, 0.46, hairMid);
    addV(playerHead, -0.39, 0.38, -0.08, 0.12, 0.36, 0.36, hairDark);
    addV(playerHead, 0.39, 0.38, -0.08, 0.12, 0.36, 0.36, hairDark);
    addV(playerHead, 0, 0.38, 0.36, 0.78, 0.50, 0.16, hairDark);
    addV(playerHead, 0, 0.18, 0.34, 0.68, 0.16, 0.12, hairDark);

    playerGroup.add(playerHead);
    scene.add(playerGroup);

    playerRef.current = {
      group: playerGroup,
      head: playerHead,
      eyes: playerEyes,
      leftArm: playerLeftArm,
      rightArm: playerRightArm,
      leftLeg: playerLeftLeg,
      rightLeg: playerRightLeg,
      velocityY: 0,
      isGrounded: true
    };

    // Eventos de teclado
    const handleKeyDown = (e) => {
      const code = e.code;
      if (code === 'ArrowUp' || code === 'KeyW') keysRef.current.up = true;
      if (code === 'ArrowDown' || code === 'KeyS') keysRef.current.down = true;
      if (code === 'ArrowLeft' || code === 'KeyA') keysRef.current.left = true;
      if (code === 'ArrowRight' || code === 'KeyD') keysRef.current.right = true;
      if (code === 'Space' && playerRef.current.isGrounded) {
        playerRef.current.velocityY = 0.32;
        playerRef.current.isGrounded = false;
        playSound('jump');
      }
    };

    const handleKeyUp = (e) => {
      const code = e.code;
      if (code === 'ArrowUp' || code === 'KeyW') keysRef.current.up = false;
      if (code === 'ArrowDown' || code === 'KeyS') keysRef.current.down = false;
      if (code === 'ArrowLeft' || code === 'KeyA') keysRef.current.left = false;
      if (code === 'ArrowRight' || code === 'KeyD') keysRef.current.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Eventos de ratón para rotar cámara
    const handleMouseDown = (e) => {
      if (e.button === 0) {
        isMouseDownRef.current = true;
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseMove = (e) => {
      if (!isMouseDownRef.current) return;
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };

      cameraAnglesRef.current.yaw -= dx * 0.006;
      cameraAnglesRef.current.pitch = Math.max(0.08, Math.min(1.2, cameraAnglesRef.current.pitch + dy * 0.005));
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
    };

    // Click Raycaster para interactuar
    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2();

    const handleClick = (e) => {
      mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouseVec, cameraRef.current);
      const meshes = [];
      const meshMap = new Map();

      interactiveTargetsRef.current.forEach(target => {
        target.group.traverse(child => {
          if (child.isMesh) {
            meshes.push(child);
            meshMap.set(child, target);
          }
        });
      });

      const intersects = raycaster.intersectObjects(meshes, false);
      if (intersects.length > 0) {
        const hitTarget = meshMap.get(intersects[0].object);
        if (hitTarget) {
          if (hitTarget.type === 'door') {
            enterWorld(hitTarget.data.targetWorld);
          } else if (hitTarget.type === 'return_portal') {
            returnToLobby();
          } else if (hitTarget.type === 'station') {
            openStationModal(hitTarget.data);
          }
        }
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('click', handleClick);

    // Redimensionamiento
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Bucle de Animación
    let animationFrameId;
    const clock = new THREE.Clock();
    let blinkTimer = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // 1. Movimiento del jugador
      const speed = 0.23;
      let moveZ = 0, moveX = 0;
      if (keysRef.current.up) moveZ -= 1;
      if (keysRef.current.down) moveZ += 1;
      if (keysRef.current.left) moveX -= 1;
      if (keysRef.current.right) moveX += 1;

      const isMoving = (moveX !== 0 || moveZ !== 0);
      const p = playerRef.current;

      if (isMoving && p.group) {
        const angle = Math.atan2(moveX, moveZ) + cameraAnglesRef.current.yaw;
        p.group.rotation.y = angle + Math.PI;
        p.group.position.x += Math.sin(angle) * speed;
        p.group.position.z += Math.cos(angle) * speed;

        p.group.position.x = Math.max(-28, Math.min(28, p.group.position.x));
        p.group.position.z = Math.max(-48, Math.min(46, p.group.position.z));

        const swing = Math.sin(elapsed * 13) * 0.65;
        p.leftLeg.rotation.x = swing;
        p.rightLeg.rotation.x = -swing;
        p.leftArm.rotation.x = -swing;
        p.rightArm.rotation.x = swing;
        if (p.head) p.head.rotation.y = Math.sin(elapsed * 6.5) * 0.08;
      } else if (p.group) {
        p.leftLeg.rotation.x = 0;
        p.rightLeg.rotation.x = 0;
        p.leftArm.rotation.x = 0;
        p.rightArm.rotation.x = 0;
        if (p.head) p.head.position.y = 1.95 + Math.sin(elapsed * 3) * 0.02;
      }

      // Parpadeo de ojos
      blinkTimer += 0.016;
      if (p.eyes) {
        if (blinkTimer > 3.5 && blinkTimer < 3.65) {
          p.eyes.scale.y = 0.1;
        } else {
          p.eyes.scale.y = 1.0;
          if (blinkTimer >= 3.65) blinkTimer = 0;
        }
      }

      // Física de salto
      if (p.group) {
        p.group.position.y += p.velocityY;
        if (p.group.position.y > 0) {
          p.velocityY -= 0.015;
        } else {
          p.group.position.y = 0;
          p.velocityY = 0;
          p.isGrounded = true;
        }
      }

      // Cámara en 3ra persona siguiendo al jugador
      if (p.group && cameraRef.current) {
        const camDist = 11.5;
        const camX = p.group.position.x + Math.sin(cameraAnglesRef.current.yaw) * camDist * Math.cos(cameraAnglesRef.current.pitch);
        const camZ = p.group.position.z + Math.cos(cameraAnglesRef.current.yaw) * camDist * Math.cos(cameraAnglesRef.current.pitch);
        const camY = p.group.position.y + 2.4 + Math.sin(cameraAnglesRef.current.pitch) * camDist;

        cameraRef.current.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.18);
        cameraRef.current.lookAt(p.group.position.x, p.group.position.y + 2.0, p.group.position.z);

        // Actualizar coordenadas y brújula
        const deg = Math.round(((cameraAnglesRef.current.yaw * 180 / Math.PI) % 360 + 360) % 360);
        let cardinal = 'N';
        if (deg >= 45 && deg < 135) cardinal = 'E';
        else if (deg >= 135 && deg < 225) cardinal = 'S';
        else if (deg >= 225 && deg < 315) cardinal = 'O';

        setCompassInfo({
          yaw: cameraAnglesRef.current.yaw,
          coords: {
            x: Math.round(p.group.position.x * 10) / 10,
            y: Math.round(p.group.position.y * 10) / 10,
            z: Math.round(p.group.position.z * 10) / 10
          },
          cardinal
        });
      }

      // Animaciones de objetos en escena (fuente, corazones, portales)
      animatedObjectsRef.current.forEach(item => {
        if (!item.mesh) return;
        if (item.type === 'pulse') {
          const s = item.baseScale * (1 + Math.sin(elapsed * 4) * 0.08);
          item.mesh.scale.set(s, s, s);
        } else if (item.type === 'heartbeat') {
          const s = 1 + Math.pow(Math.sin(elapsed * 5), 6) * 0.22;
          item.mesh.scale.set(s, s, s);
        } else if (item.type === 'portal') {
          item.mesh.rotation.y = Math.sin(elapsed * 2 + (item.phase || 0)) * 0.08;
        } else if (item.type === 'boat') {
          item.mesh.position.y = item.baseY + Math.sin(elapsed * 2.5 + (item.phase || 0)) * 0.12;
          item.mesh.rotation.z = Math.sin(elapsed * 2 + (item.phase || 0)) * 0.04;
        }
      });

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []); // Montaje único

  // 3. RECONSTRUCCIÓN DINÁMICA DEL MUNDO SEGÚN currentWorld Y knowledgeBase
  useEffect(() => {
    const worldGroup = worldContentGroupRef.current;
    if (!worldGroup || !sceneRef.current) return;

    // Limpiar mundo anterior
    while (worldGroup.children.length > 0) {
      worldGroup.remove(worldGroup.children[0]);
    }
    interactiveTargetsRef.current = [];
    animatedObjectsRef.current = [];

    // Helper voxel
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const addV = (parent, x, y, z, sx, sy, sz, col, emissive = 0x000000, opacity = 1.0) => {
      const mat = new THREE.MeshStandardMaterial({
        color: col,
        roughness: 0.60,
        metalness: 0.04,
        emissive: emissive,
        transparent: opacity < 1.0,
        opacity: opacity
      });
      const mesh = new THREE.Mesh(boxGeo, mat);
      mesh.position.set(x, y, z);
      mesh.scale.set(sx, sy, sz);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };

    // Helper árbol micro-voxel
    const addTree = (group, x, y, z, trunkHeight = 4.5, scale = 1.0) => {
      const tg = new THREE.Group();
      tg.position.set(x, y, z);
      addV(tg, 0, trunkHeight * 0.4, 0, 0.75 * scale, trunkHeight * 0.8, 0.75 * scale, 0x78350f);
      addV(tg, 0, trunkHeight * 0.85, 0, 0.9 * scale, trunkHeight * 0.3, 0.9 * scale, 0x57300a);
      const baseCanopy = trunkHeight + 0.8 * scale;
      const folMid = 0x16a34a, folLight = 0x4ade80, folDark = 0x14532d;
      addV(tg, 0, baseCanopy, 0, 3.8 * scale, 2.2 * scale, 3.8 * scale, folDark);
      addV(tg, -1.2 * scale, baseCanopy + 0.5 * scale, 0, 2.6 * scale, 2.0 * scale, 2.6 * scale, folMid);
      addV(tg, 1.2 * scale, baseCanopy + 0.6 * scale, 0.3 * scale, 2.8 * scale, 2.2 * scale, 2.8 * scale, folMid);
      addV(tg, 0, baseCanopy + 1.4 * scale, 0, 2.8 * scale, 1.8 * scale, 2.8 * scale, folLight);
      group.add(tg);
    };

    // Reubicar jugador al inicio del mundo
    if (playerRef.current.group) {
      playerRef.current.group.position.set(0, 0, 6);
      playerRef.current.group.rotation.y = 0;
    }

    if (currentWorld === 'lobby') {
      // Color y niebla de cielo
      sceneRef.current.background = new THREE.Color(0x38bdf8);
      sceneRef.current.fog = new THREE.FogExp2(0xbae6fd, 0.007);

      // Plaza de adoquines y senderos
      addV(worldGroup, 0, -0.6, 0, 72, 1.2, 72, 0xb45309);
      addV(worldGroup, 0, -0.42, 0, 24, 1.0, 24, 0xf1f5f9);
      addV(worldGroup, 0, -0.38, -16, 6.5, 1, 18, 0xfde68a);
      addV(worldGroup, 16, -0.38, 0, 18, 1, 6.5, 0xa7f3d0);
      addV(worldGroup, -16, -0.38, 0, 18, 1, 6.5, 0xf5d0fe);
      addV(worldGroup, 0, -0.38, 16, 6.5, 1, 18, 0xbae6fd);

      // Fuente central
      addV(worldGroup, 0, 0.35, 0, 6.4, 0.9, 6.4, 0x64748b);
      addV(worldGroup, 0, 0.75, 0, 5.2, 0.4, 5.2, 0x38bdf8, 0x0284c7, 0.85);
      addV(worldGroup, 0, 2.0, 0, 1.4, 2.8, 1.4, 0x94a3b8);
      const fountainTop = addV(worldGroup, 0, 3.5, 0, 2.2, 0.6, 2.2, 0x38bdf8, 0x0ea5e9, 0.88);
      animatedObjectsRef.current.push({ mesh: fountainTop, type: 'pulse', baseScale: 2.2 });

      // Faroles
      [[-7, -7], [7, -7], [-7, 7], [7, 7]].forEach(([lx, lz]) => {
        addV(worldGroup, lx, 1.8, lz, 0.4, 3.6, 0.4, 0x334155);
        addV(worldGroup, lx, 3.6, lz, 0.95, 0.95, 0.95, 0xfef08a, 0xf59e0b);
      });

      // Árboles
      addTree(worldGroup, -18, 0, -18, 4.8, 1.15);
      addTree(worldGroup, 18, 0, -18, 4.6, 1.1);
      addTree(worldGroup, -18, 0, 18, 4.7, 1.12);
      addTree(worldGroup, 18, 0, 18, 4.9, 1.2);

      // Las 4 Puertas Mágicas
      (knowledgeBase.doors || []).forEach(door => {
        const doorGroup = new THREE.Group();
        doorGroup.position.set(door.pos.x, 0, door.pos.z);
        if (Math.abs(door.pos.x) > 0) doorGroup.rotation.y = Math.PI / 2;

        addV(doorGroup, 0, 0.25, 0, 9.2, 0.5, 5.0, 0x1e293b);
        addV(doorGroup, 0, 0.65, 0, 7.8, 0.4, 3.8, door.frameColor);
        addV(doorGroup, -2.9, 4.4, 0, 1.4, 7.4, 1.4, door.color);
        addV(doorGroup, 2.9, 4.4, 0, 1.4, 7.4, 1.4, door.color);
        addV(doorGroup, 0, 8.2, 0, 7.4, 1.5, 1.6, door.color);
        addV(doorGroup, 0, 9.2, 0, 5.0, 1.0, 1.4, door.frameColor);

        const portalGlow = addV(doorGroup, 0, 4.4, 0, 4.4, 7.0, 0.45, door.frameColor, door.color, 0.9);
        animatedObjectsRef.current.push({ mesh: portalGlow, type: 'portal', phase: Math.random() * 4 });

        worldGroup.add(doorGroup);
        interactiveTargetsRef.current.push({ type: 'door', group: doorGroup, data: door });
      });
    } else {
      // 4. MUNDOS TEMÁTICOS CON ESTACIONES DE APRENDIZAJE SINCRONIZADAS
      const worldAtmospheres = {
        historia: { bg: 0xfef08a, fog: 0xfde68a, ground: 0xfbbf24 },
        ciencias: { bg: 0x6ee7b7, fog: 0xa7f3d0, ground: 0x34d399 },
        lenguaje: { bg: 0xf0abfc, fog: 0xf5d0fe, ground: 0xfbcfe8 },
        matematicas: { bg: 0x93c5fd, fog: 0xbfdbfe, ground: 0x60a5fa }
      };

      const atmos = worldAtmospheres[currentWorld] || worldAtmospheres.historia;
      sceneRef.current.background = new THREE.Color(atmos.bg);
      sceneRef.current.fog = new THREE.FogExp2(atmos.fog, 0.008);

      // Suelo y camino central
      addV(worldGroup, 0, -0.5, 0, 60, 1, 80, atmos.ground);
      addV(worldGroup, 0, -0.4, 0, 8, 1, 74, 0xf8fafc);

      // Portal de retorno al Lobby en z = 14
      const returnGroup = new THREE.Group();
      returnGroup.position.set(0, 0, 14);
      addV(returnGroup, 0, 0.2, 0, 6.0, 0.4, 3.2, 0x334155);
      addV(returnGroup, -2.2, 2.6, 0, 0.8, 5.0, 0.8, 0x475569);
      addV(returnGroup, 2.2, 2.6, 0, 0.8, 5.0, 0.8, 0x475569);
      addV(returnGroup, 0, 5.2, 0, 5.2, 0.8, 0.8, 0x475569);
      const retGlow = addV(returnGroup, 0, 2.6, 0, 3.6, 4.4, 0.3, 0x38bdf8, 0x0284c7, 0.88);
      animatedObjectsRef.current.push({ mesh: retGlow, type: 'portal', phase: 0 });
      worldGroup.add(returnGroup);
      interactiveTargetsRef.current.push({ type: 'return_portal', group: returnGroup });

      // Generar Estaciones de Aprendizaje (del currículum base + sincronizadas de NotebookLM)
      const currentStations = knowledgeBase.stations[currentWorld] || [];
      currentStations.forEach((station, idx) => {
        const stGroup = new THREE.Group();
        const posX = station.pos ? station.pos.x : ((idx % 2 === 0 ? -1 : 1) * (10 + (idx * 2) % 6));
        const posZ = station.pos ? station.pos.z : (-34 + idx * 10);
        stGroup.position.set(posX, 0, posZ);

        // Pedestal
        addV(stGroup, 0, 0.3, 0, 4.2, 0.6, 4.2, station.color || 0x0284c7);
        addV(stGroup, 0, 0.7, 0, 3.6, 0.3, 3.6, 0xf8fafc);

        // Tótem / NPC Voxel
        addV(stGroup, 0, 1.8, 0, 1.2, 2.0, 1.0, station.color || 0xd97706);
        addV(stGroup, 0, 3.2, 0, 1.4, 1.4, 1.3, 0xfbd3b6);
        addV(stGroup, 0, 4.1, 0, 1.6, 0.6, 1.5, 0x1e293b);

        // Gema / Cristal Flotante que pulsa
        const crystal = addV(stGroup, 0, 5.2, 0, 0.8, 0.8, 0.8, 0xfacc15, 0xf59e0b);
        animatedObjectsRef.current.push({ mesh: crystal, type: 'pulse', baseScale: 0.8 });

        worldGroup.add(stGroup);
        interactiveTargetsRef.current.push({ type: 'station', group: stGroup, data: station });
      });

      // Árboles decorativos en el entorno
      addTree(worldGroup, -20, 0, -25, 5, 1.1);
      addTree(worldGroup, 20, 0, -20, 4.8, 1.0);
      addTree(worldGroup, -20, 0, 25, 4.6, 1.15);
      addTree(worldGroup, 20, 0, 20, 5.2, 1.2);
    }
  }, [currentWorld, knowledgeBase]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <canvas ref={canvasRef} id="game-canvas" className="w-full h-full block cursor-crosshair" />
    </div>
  );
}
