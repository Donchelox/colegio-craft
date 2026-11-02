/**
 * ColegioCraft 3D - Sistema de Audio Acústico & Voz Chilena Natural (es-CL)
 * Tone.js + Web Speech API con ambient background music opcional.
 */
import * as Tone from 'tone';

let audioReady = false;
let folkPluck, warmPad, woodTap, chimeSynth;
let voiceEnabled = true;
let preferredChileanVoice = null;
let bgmPlaying = false;
let bgmLoop = null;

export function initAudio() {
  if (audioReady) return;
  try {
    Tone.start();

    folkPluck = new Tone.PluckSynth({
      attackNoise: 0.8,
      dampening: 3800,
      resonance: 0.94
    }).toDestination();
    folkPluck.volume.value = -6;

    warmPad = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.1, decay: 0.3, sustain: 0.6, release: 1.2 }
    }).toDestination();
    warmPad.volume.value = -12;

    woodTap = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 3,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.12, sustain: 0.01, release: 0.1 }
    }).toDestination();
    woodTap.volume.value = -10;

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

export function playSound(type) {
  if (!audioReady) initAudio();
  if (!audioReady) return;

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
      setTimeout(() => folkPluck && folkPluck.triggerAttackRelease('F3', '8n'), 100);
    } else if (type === 'click') {
      woodTap.triggerAttackRelease('E3', '32n', now);
    } else if (type === 'coin') {
      chimeSynth.triggerAttackRelease(['E5', 'B5'], '16n', now);
    }
  } catch (e) {
    console.warn('Error en playSound:', e);
  }
}

export function toggleAmbientBgm(onStateChange) {
  if (!audioReady) initAudio();
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

      Tone.Transport.bpm.value = 68;
      bgmLoop = new Tone.Loop((time) => {
        if (warmPad) {
          warmPad.triggerAttackRelease(chords[chordIdx], '2m', time);
        }
        chordIdx = (chordIdx + 1) % chords.length;
      }, '2m').start(0);

      Tone.Transport.start();
    } catch (e) {
      console.warn('No se pudo iniciar BGM:', e);
    }
  } else {
    try {
      if (bgmLoop) {
        bgmLoop.stop();
        bgmLoop.dispose();
        bgmLoop = null;
      }
      Tone.Transport.stop();
    } catch (e) {
      console.warn('Error al detener BGM:', e);
    }
  }

  if (onStateChange) onStateChange(bgmPlaying);
  return bgmPlaying;
}

// ==========================================================================
// SÍNTESIS DE VOZ CHILENA NATURAL (es-CL)
// ==========================================================================

function getChileanVoice() {
  if (preferredChileanVoice) return preferredChileanVoice;
  if (!('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  const clVoices = voices.filter(v => v.lang === 'es-CL' || v.lang === 'es_CL');
  if (clVoices.length > 0) {
    preferredChileanVoice = clVoices.find(v => !v.name.includes('Google') && !v.name.includes('Compact')) || clVoices[0];
    return preferredChileanVoice;
  }

  const esVoices = voices.filter(v => v.lang.startsWith('es-') || v.lang.startsWith('es_') || v.lang === 'es');
  const naturalSpanish = esVoices.find(v =>
    v.name.toLowerCase().includes('natural') ||
    v.name.toLowerCase().includes('diego') ||
    v.name.toLowerCase().includes('camila') ||
    v.name.toLowerCase().includes('cl')
  ) || esVoices[0];

  preferredChileanVoice = naturalSpanish || null;
  return preferredChileanVoice;
}

if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    preferredChileanVoice = null;
    getChileanVoice();
  };
}

export function speakChileanExpressive(script, onEnd) {
  if (!voiceEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const phraseList = Array.isArray(script) ? script : [{ text: script, pitch: 1.05, rate: 0.98 }];
  let currentIndex = 0;

  function speakNext() {
    if (currentIndex >= phraseList.length) {
      if (onEnd) onEnd();
      return;
    }

    const item = phraseList[currentIndex];
    const text = typeof item === 'string' ? item : item.text;
    const pitch = item.pitch || 1.05;
    const rate = item.rate || 0.98;
    const pauseAfter = item.pauseAfter || 0;

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getChileanVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = voice ? voice.lang : 'es-CL';
    utterance.pitch = pitch;
    utterance.rate = rate;

    utterance.onend = () => {
      currentIndex++;
      if (pauseAfter > 0) {
        setTimeout(speakNext, pauseAfter);
      } else {
        speakNext();
      }
    };

    utterance.onerror = () => {
      currentIndex++;
      speakNext();
    };

    window.speechSynthesis.speak(utterance);
  }

  speakNext();
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function toggleVoice(state) {
  voiceEnabled = (state !== undefined) ? state : !voiceEnabled;
  if (!voiceEnabled) stopSpeaking();
  return voiceEnabled;
}
