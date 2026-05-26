import { useCallback, useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';

function makeToneDataUri(frequency = 440, duration = 0.08, volume = 0.25, options = {}) {
  const sampleRate = 22050;
  const samples = Math.floor(sampleRate * duration);
  const headerSize = 44;
  const buffer = new ArrayBuffer(headerSize + samples * 2);
  const view = new DataView(buffer);
  const partials = options.partials || [1];
  const noise = options.noise || 0;
  const sweep = options.sweep || 0;
  const attack = options.attack || 0.08;
  const release = options.release || 0.76;
  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i += 1) view.setUint8(offset + i, string.charCodeAt(i));
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, samples * 2, true);

  for (let i = 0; i < samples; i += 1) {
    const t = i / sampleRate;
    const progress = i / samples;
    const currentFrequency = frequency + sweep * progress;
    const attackEnvelope = Math.min(1, progress / Math.max(0.001, attack));
    const releaseEnvelope = Math.max(0, 1 - Math.max(0, progress - release) / Math.max(0.001, 1 - release));
    const envelope = attackEnvelope * releaseEnvelope;
    const harmonic = partials.reduce((sum, partial, partialIndex) => {
      const gain = 1 / (partialIndex + 1.45);
      return sum + Math.sin(2 * Math.PI * currentFrequency * partial * t) * gain;
    }, 0);
    const pseudoNoise = Math.sin(i * 12.9898 + frequency) * 43758.5453;
    const noiseSample = ((pseudoNoise - Math.floor(pseudoNoise)) * 2 - 1) * noise;
    const sample = (harmonic + noiseSample) * envelope * volume;
    view.setInt16(headerSize + i * 2, Math.max(-1, Math.min(1, sample)) * 32767, true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return `data:audio/wav;base64,${btoa(binary)}`;
}

export function useSound(mode = 'day') {
  const [enabled, setEnabled] = useState(false);
  const sounds = useRef(null);
  const activeAmbientRef = useRef(null);

  const ensureSounds = useCallback(() => {
    if (sounds.current) return sounds.current;

    sounds.current = {
      hover: new Howl({ src: [makeToneDataUri(880, 0.035, 0.11, { partials: [1, 2.01], release: 0.52 })], volume: 0.16 }),
      click: new Howl({ src: [makeToneDataUri(460, 0.06, 0.2, { partials: [1, 1.5, 2], sweep: -80, release: 0.62 })], volume: 0.22 }),
      navigate: new Howl({ src: [makeToneDataUri(320, 0.24, 0.14, { partials: [1, 1.5, 2.5], sweep: 180, release: 0.7 })], volume: 0.22 }),
      map: new Howl({ src: [makeToneDataUri(620, 0.16, 0.16, { partials: [1, 1.25, 2], sweep: 90, release: 0.72 })], volume: 0.2 }),
      select: new Howl({ src: [makeToneDataUri(520, 0.09, 0.16, { partials: [1, 1.6, 2.2], sweep: 110, release: 0.6 })], volume: 0.18 }),
      close: new Howl({ src: [makeToneDataUri(360, 0.12, 0.15, { partials: [1, 1.2], sweep: -130, noise: 0.04, release: 0.58 })], volume: 0.18 }),
      profile: new Howl({ src: [makeToneDataUri(700, 0.2, 0.13, { partials: [1, 1.5, 2.25, 3], sweep: 170, release: 0.8 })], volume: 0.2 }),
      submit: new Howl({ src: [makeToneDataUri(430, 0.1, 0.14, { partials: [1, 1.33, 2], sweep: 80, release: 0.64 })], volume: 0.18 }),
      success: new Howl({ src: [makeToneDataUri(740, 0.24, 0.14, { partials: [1, 1.25, 1.5, 2], sweep: 220, release: 0.82 })], volume: 0.22 }),
      error: new Howl({ src: [makeToneDataUri(180, 0.22, 0.16, { partials: [1, 1.08], sweep: -60, noise: 0.08, release: 0.7 })], volume: 0.2 }),
      chest: new Howl({ src: [makeToneDataUri(230, 0.32, 0.18, { partials: [1, 1.48, 2.1], sweep: 210, noise: 0.05, release: 0.7 })], volume: 0.26 }),
      page: new Howl({ src: [makeToneDataUri(780, 0.2, 0.12, { partials: [1, 1.33, 2.66], sweep: -220, noise: 0.08, release: 0.58 })], volume: 0.18 }),
      chime: new Howl({ src: [makeToneDataUri(660, 0.26, 0.15, { partials: [1, 1.5, 2.25], sweep: 70, release: 0.8 })], volume: 0.2 }),
      whoosh: new Howl({ src: [makeToneDataUri(190, 0.36, 0.14, { partials: [1, 1.12], sweep: -90, noise: 0.18, release: 0.62 })], volume: 0.2 }),
      ambientDay: new Howl({ src: [makeToneDataUri(92, 4.8, 0.045, { partials: [1, 1.5, 2.02], noise: 0.035, release: 0.98 })], loop: true, volume: 0.16 }),
      ambientNight: new Howl({ src: [makeToneDataUri(74, 5.4, 0.052, { partials: [1, 1.25, 1.99], noise: 0.045, release: 0.98 })], loop: true, volume: 0.18 }),
    };
    return sounds.current;
  }, []);

  const playAmbient = useCallback(
    (nextMode = mode) => {
      const pool = ensureSounds();
      const nextAmbient = nextMode === 'night' ? pool.ambientNight : pool.ambientDay;
      if (activeAmbientRef.current === nextAmbient && nextAmbient.playing()) return;

      if (activeAmbientRef.current) {
        const previousAmbient = activeAmbientRef.current;
        previousAmbient.fade(previousAmbient.volume(), 0, 350);
        window.setTimeout(() => previousAmbient.stop(), 360);
      }

      activeAmbientRef.current = nextAmbient;
      nextAmbient.volume(0);
      nextAmbient.play();
      nextAmbient.fade(0, nextMode === 'night' ? 0.18 : 0.14, 600);
    },
    [ensureSounds, mode],
  );

  const play = useCallback(
    (name) => {
      if (!enabled) return;
      const pool = ensureSounds();
      pool[name]?.play();
    },
    [enabled, ensureSounds],
  );

  const toggleSound = useCallback(() => {
    const pool = ensureSounds();
    setEnabled((current) => {
      const next = !current;
      if (next) {
        playAmbient(mode);
        pool.chime.play();
      } else {
        Object.values(pool).forEach((sound) => sound.stop());
        activeAmbientRef.current = null;
      }
      return next;
    });
  }, [ensureSounds, mode, playAmbient]);

  useEffect(() => {
    if (enabled) playAmbient(mode);
  }, [enabled, mode, playAmbient]);

  useEffect(() => () => {
    if (sounds.current) Object.values(sounds.current).forEach((sound) => sound.unload());
  }, []);

  return { enabled, toggleSound, play };
}
