import { Volume2, VolumeX } from 'lucide-react';

export default function SoundToggle({ enabled, onToggle }) {
  return (
    <button
      aria-label={enabled ? 'Turn sound off' : 'Turn sound on'}
      type="button"
      onClick={onToggle}
      className="grid h-10 w-10 place-items-center rounded-full border border-slate-900/10 bg-white/60 text-slate-950 backdrop-blur-xl transition hover:border-cyan-300/50 hover:text-cyan-300"
    >
      {enabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
    </button>
  );
}
