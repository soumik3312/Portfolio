import { useCallback, useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';

function makeToneDataUri(frequency = 440, duration = 0.08, volume = 0.25) {
  const sampleRate = 22050;
  const samples = Math.floor(sampleRate * duration);
  const headerSize = 44;
  const buffer = new ArrayBuffer(headerSize + samples * 2);
  const view = new DataView(buffer);
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
    const envelope = 1 - i / samples;
    const sample = Math.sin(2 * Math.PI * frequency * t) * envelope * volume;
    view.setInt16(headerSize + i * 2, sample * 32767, true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return `data:audio/wav;base64,${btoa(binary)}`;
}

export function useSound() {
  const [enabled, setEnabled] = useState(false);
  const sounds = useRef(null);

  const ensureSounds = useCallback(() => {
    if (sounds.current) return sounds.current;

    sounds.current = {
      hover: new Howl({ src: [makeToneDataUri(880, 0.025, 0.18)], volume: 0.18 }),
      click: new Howl({ src: [makeToneDataUri(460, 0.045, 0.25)], volume: 0.25 }),
      chime: new Howl({ src: [makeToneDataUri(660, 0.18, 0.16)], volume: 0.16 }),
      whoosh: new Howl({ src: [makeToneDataUri(190, 0.28, 0.16)], volume: 0.16 }),
      ambient: new Howl({ src: [makeToneDataUri(80, 1.4, 0.08)], loop: true, volume: 0.12 }),
    };
    return sounds.current;
  }, []);

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
      if (next) pool.ambient.play();
      else pool.ambient.stop();
      return next;
    });
  }, [ensureSounds]);

  useEffect(() => () => {
    if (sounds.current) Object.values(sounds.current).forEach((sound) => sound.unload());
  }, []);

  return { enabled, toggleSound, play };
}
