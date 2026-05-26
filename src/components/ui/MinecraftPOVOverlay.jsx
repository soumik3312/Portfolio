import React from 'react';

const MinecraftPOVOverlay = React.memo(function MinecraftPOVOverlay() {
  return (
    <div className="minecraft-pov-overlay" aria-hidden="true">
      <div className="minecraft-crosshair">
        <span />
        <span />
      </div>
      <div className="minecraft-hotbar">
        {Array.from({ length: 7 }, (_, index) => (
          <span key={index} className={index === 3 ? 'is-selected' : ''} />
        ))}
      </div>
      <div className="minecraft-hand minecraft-hand-left">
        <span className="minecraft-sleeve" />
        <span className="minecraft-palm" />
      </div>
      <div className="minecraft-hand minecraft-hand-right">
        <span className="minecraft-tool-handle" />
        <span className="minecraft-tool-head" />
        <span className="minecraft-sleeve" />
        <span className="minecraft-palm" />
      </div>
    </div>
  );
});

export default MinecraftPOVOverlay;
