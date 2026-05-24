import React from 'react';
import { Moon, Sun } from 'lucide-react';

const DayNightToggle = React.memo(function DayNightToggle({ mode, onToggle }) {
  const isDay = mode === 'day';

  return (
    <button
      type="button"
      className="icon-button"
      onClick={onToggle}
      aria-label={isDay ? 'Switch to night mode' : 'Switch to day mode'}
      aria-pressed={!isDay}
      title={isDay ? 'Day' : 'Night'}
    >
      {isDay ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
});

export default DayNightToggle;
