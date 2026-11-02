/**
 * ColegioCraft 3D - Sistema de Audio Acústico & Voz Chilena Natural (es-CL)
 * Tone.js + Web Speech API con ambient background music opcional.
 */

let audioReady = false;
let folkPluck, warmPad, woodTap, chimeSynth;
let voiceEnabled = true;
let preferredChileanVoice = null;
let speechQueueTimeout = null;
let bgmPlaying = false;
let bgmLoop = null;

// Inicialización de sintetizadores con Tone.js
function initAudio() {
    if (audioReady) return;
    try {
        if (typeof Tone === 'undefined') return;
        Tone.start();

        // 1. Pluck tipo Charango / Guitarra acústica
        folkPluck = new Tone.PluckSynth({
            attackNoise: 0.8,
            dampening: 3800,
            resonance: 0.94
        }).toDestination();
        folkPluck.volume.value = -6;

        // 2. Pad cálido para ambientes y recompensas
        warmPad = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'triangle' },
            envelope: { attack: 0.1, decay: 0.3, sustain: 0.6, release: 1.2 }
        }).toDestination();
        warmPad.volume.value = -12;

        // 3. Percusión tipo bloque de madera / paso
        woodTap = new Tone.MembraneSynth({
            pitchDecay: 0.05,
            octaves: 3,
            oscillator: { type: 'sine' },
            envelope: { attack: 0.001, decay: 0.12, sustain: 0.01, release: 0.1 }
        }).toDestination();
        woodTap.volume.value = -10;

        // 4. Campanillas mágicas
        chimeSynth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'sine' },
            envelope: { attack: 0.02, decay: 0.5, sustain: 0.2, release: 1.5 }
        }).toDestination();
        chimeSynth.volume.value = -14;

        audioReady = true;
    } catch (e) {
        console.warn('Tone.js no pudo iniciar automáticamente:', e);
    }
}

// Reproducción de efectos de sonido temáticos
function playSound(type) {
    if (!audioReady) initAudio();
    if (!audioReady || typeof Tone === 'undefined') return;

    try {
        const now = Tone.now();
        if (type === 'place') {
            woodTap.triggerAttackRelease('C3', '16n', now);
        } else if (type === 'break') {
            woodTap.triggerAttackRelease('G2', '16n', now);
        } else if (type === 'jump') {
            folkPluck.triggerAttackRelease('D4', '16n', now);
        } else if (type === 'teleport') {
            chimeSynth.triggerAttackRelease(['C5', 'G5', 'C6'], '8n', now);
        } else if (type === 'success') {
            warmPad.triggerAttackRelease(['C4', 'E4', 'G4', 'C5'], '4n', now);
            setTimeout(() => {
                if (chimeSynth) chimeSynth.triggerAttackRelease(['E5', 'G5', 'C6'], '8n');
            }, 120);
        } else if (type === 'wrong') {
            folkPluck.triggerAttackRelease('F#3', '8n', now);
            setTimeout(() => folkPluck.triggerAttackRelease('F3', '8n'), 100);
        } else if (type === 'click') {
            woodTap.triggerAttackRelease('E3', '32n', now);
        }
    } catch (e) {
        console.warn('Error en playSound:', e);
    }
}

// Música ambiental suave opcional estilo Minecraft / C418
function toggleAmbientBgm() {
    if (!audioReady) initAudio();
    const btn = document.getElementById('btn-bgm-toggle');
    bgmPlaying = !bgmPlaying;

    if (bgmPlaying) {
        try {
            const chords = [
                ['C4', 'E4', 'G4', 'B4'],
                ['A3', 'C4', 'E4', 'G4'],
                ['F3', 'A3', 'C4', 'E4'],
                ['G3', 'B3', 'D4', 'F4']
            ];
            let chordIdx = 0;
            bgmLoop = new Tone.Loop(time => {
                if (!bgmPlaying || !warmPad) return;
                const c = chords[chordIdx % chords.length];
                warmPad.triggerAttackRelease(c, '2n', time, 0.4);
                chordIdx++;
            }, '4m').start(0);

            Tone.Transport.bpm.value = 65;
            Tone.Transport.start();
            if (btn) btn.classList.add('mc-btn-green');
            if (window.showToast) window.showToast('🎵', 'Música ambiental relajante activada.');
        } catch (e) {
            console.warn('Error iniciando BGM:', e);
        }
    } else {
        if (bgmLoop) {
            bgmLoop.stop();
            bgmLoop.dispose();
            bgmLoop = null;
        }
        if (btn) btn.classList.remove('mc-btn-green');
        if (window.showToast) window.showToast('🔇', 'Música ambiental silenciada.');
    }
}

// ==========================================================================
// VOZ CHILENA NATURAL (es-CL) CON FILTRO ACÚSTICO INFANTIL
// ==========================================================================

function loadBestChileanVoice() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    const scoreVoice = (v) => {
        let s = 0;
        const lang = (v.lang || '').toLowerCase();
        const name = (v.name || '').toLowerCase();
        if (!lang.startsWith('es')) return -1000;

        if (lang === 'es-cl' || lang.includes('cl') || name.includes('chile') || name.includes('francisca') || name.includes('catalina') || name.includes('lorenzo')) {
            s += 120;
        } else if (lang === 'es-419' || lang === 'es-ar' || lang === 'es-pe' || lang === 'es-mx' || lang === 'es-co' || lang === 'es-us') {
            s += 75;
        } else {
            s += 40;
        }

        if (name.includes('natural') || name.includes('online') || name.includes('neural')) s += 90;
        if (name.includes('premium') || name.includes('enhanced') || name.includes('siri')) s += 65;
        if (name.includes('google')) s += 50;
        if (name.includes('espeak') || name.includes('festival')) s -= 80;
        return s;
    };

    const sorted = [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a));
    if (sorted.length > 0 && scoreVoice(sorted[0]) > 0) {
        preferredChileanVoice = sorted[0];
        const badge = document.getElementById('voice-status-badge');
        if (badge) {
            const isCL = (preferredChileanVoice.lang || '').toLowerCase().includes('cl') || preferredChileanVoice.name.toLowerCase().includes('chile');
            badge.textContent = isCL ? 'Voz Chilena 🇨🇱' : 'Voz Latina 🎙️';
        }
    }
}

if ('speechSynthesis' in window) {
    loadBestChileanVoice();
    window.speechSynthesis.onvoiceschanged = loadBestChileanVoice;
}

function humanizeTextForChileanTTS(text) {
    if (!text) return '';
    return text
        .replace(/3D/gi, 'tres D')
        .replace(/2°/gi, 'segundo')
        .replace(/1°/gi, 'primero')
        .replace(/4°/gi, 'cuarto')
        .replace(/3°/gi, 'tercero')
        .replace(/lpm/gi, 'latidos por minuto')
        .replace(/~/g, 'aproximadamente ')
        .replace(/\bvs\b/gi, 'frente a')
        .replace(/WiFi/gi, 'uai fai')
        .replace(/Selk'nam/gi, 'Selknam')
        .replace(/Kawésqar/gi, 'Kawéskar')
        .replace(/Wiñol Txipantu/gi, 'Güiñol Chipantu')
        .replace(/Mapuzugun/gi, 'Mapudungun');
}

function stopAllSpeech() {
    if (speechQueueTimeout) {
        clearTimeout(speechQueueTimeout);
        speechQueueTimeout = null;
    }
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}

function toggleVoiceMute() {
    voiceEnabled = !voiceEnabled;
    const icon = document.getElementById('voice-toggle-icon');
    const btn = document.getElementById('btn-voice-toggle');

    if (voiceEnabled) {
        if (icon) icon.className = 'fa-solid fa-volume-high';
        if (btn) btn.classList.remove('opacity-60');
        if (window.showToast) window.showToast('🔊', 'Voz chilena activada.');
        speakChileanExpressive('Voz chilena activada. ¡Sigamos aprendiendo!');
    } else {
        stopAllSpeech();
        if (icon) icon.className = 'fa-solid fa-volume-xmark';
        if (btn) btn.classList.add('opacity-60');
        if (window.showToast) window.showToast('🔇', 'Voz chilena silenciada.');
    }
}

function speakChileanExpressive(input) {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    stopAllSpeech();

    const segments = Array.isArray(input) ? input : [{ text: input, pitch: 1.05, rate: 0.98 }];

    let currentIdx = 0;
    function playNext() {
        if (currentIdx >= segments.length || !voiceEnabled) return;
        const seg = segments[currentIdx];
        const clean = humanizeTextForChileanTTS(seg.text);
        if (!clean.trim()) {
            currentIdx++;
            playNext();
            return;
        }

        const utter = new SpeechSynthesisUtterance(clean);
        if (preferredChileanVoice) {
            utter.voice = preferredChileanVoice;
            utter.lang = preferredChileanVoice.lang;
        } else {
            utter.lang = 'es-CL';
        }

        utter.pitch = seg.pitch || 1.04;
        utter.rate = seg.rate || 0.97;
        utter.volume = 1.0;

        utter.onend = () => {
            currentIdx++;
            const pause = seg.pauseAfter || 150;
            speechQueueTimeout = setTimeout(playNext, pause);
        };

        utter.onerror = (e) => {
            console.warn('SpeechSynthesis error:', e);
            currentIdx++;
            playNext();
        };

        window.speechSynthesis.speak(utter);
    }

    playNext();
}
