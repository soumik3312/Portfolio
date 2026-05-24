import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return undefined;

    let frame = 0;
    const handleMove = (event) => {
      target.current.x = event.clientX;
      target.current.y = event.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
      }
      const clickable = event.target.closest('a, button, input, textarea, select, [role="button"]');
      setHovering(Boolean(clickable));
    };

    const animate = () => {
      ring.current.x += (target.current.x - ring.current.x) * 0.18;
      ring.current.y += (target.current.y - ring.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(animate);
    };

    const handleDown = () => setClicking(true);
    const handleUp = () => {
      window.setTimeout(() => setClicking(false), 180);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
    };
  }, []);

  return (
    <>
      <span ref={ringRef} className={`cursor-ring ${hovering ? 'is-hovering' : ''} ${clicking ? 'is-clicking' : ''}`} />
      <span ref={dotRef} className="cursor-dot" />
    </>
  );
}
