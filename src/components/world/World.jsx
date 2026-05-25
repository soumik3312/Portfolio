import React, { Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import CameraController from '../camera/CameraController';
import Ground from './Ground';
import Mountains from './Mountains';
import Particles from './Particles';
import River from './River';
import Rocks from './Rocks';
import Signboard from './Signboard';
import Sky from './Sky';
import Trees from './Trees';

const signboards = [
  { id: 'about', sectionName: 'About Me', position: [4.7, 0, -36], rotation: [0, -0.15, 0] },
  { id: 'skills', sectionName: 'Skills', position: [-4.8, 0, -76], rotation: [0, 0.15, 0] },
  { id: 'projects', sectionName: 'Projects', position: [4.7, 0, -116], rotation: [0, -0.15, 0] },
  { id: 'ai', sectionName: 'AI / ML', position: [-4.8, 0, -156], rotation: [0, 0.15, 0] },
  { id: 'timeline', sectionName: 'Timeline', position: [4.7, 0, -196], rotation: [0, -0.15, 0] },
  { id: 'github', sectionName: 'GitHub', position: [-4.8, 0, -236], rotation: [0, 0.15, 0] },
  { id: 'contact', sectionName: 'Contact', position: [0, 0, -250], rotation: [0, 0, 0] },
];

const Lights = React.memo(function Lights({ mode }) {
  const isDay = mode === 'day';
  return (
    <>
      <ambientLight color={isDay ? '#d8efe0' : '#66789a'} intensity={isDay ? 1.2 : 0.48} />
      <directionalLight position={isDay ? [24, 35, 18] : [-18, 26, 14]} color={isDay ? '#fff5d6' : '#c8dcff'} intensity={isDay ? 2.1 : 0.82} />
      <hemisphereLight color={isDay ? '#bfe8ff' : '#263b68'} groundColor={isDay ? '#5f8d4f' : '#0b160d'} intensity={isDay ? 0.62 : 0.24} />
    </>
  );
});

const SceneContent = React.memo(function SceneContent({ mode }) {
  return (
    <>
      <fog attach="fog" args={[mode === 'day' ? '#c8e8d4' : '#2a3a5a', 80, 250]} />
      <CameraController />
      <Lights mode={mode} />
      <Sky mode={mode} />
      <Ground mode={mode} />
      <River mode={mode} />
      <Mountains mode={mode} />
      <Trees mode={mode} />
      <Rocks mode={mode} />
      <Particles mode={mode} />
      {signboards.map((board) => (
        <Signboard key={board.id} sectionName={board.sectionName} position={board.position} rotation={board.rotation} />
      ))}
    </>
  );
});

const World = React.memo(function World({ mode, onReady, blurred = false }) {
  const handleCreated = useCallback(
    ({ scene }) => {
      scene.background = null;
      window.setTimeout(() => onReady?.(), 450);
    },
    [onReady],
  );

  return (
    <Canvas
      shadows={false}
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      gl={{
        antialias: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
        alpha: true,
      }}
      camera={{
        fov: 60,
        near: 0.1,
        far: 400,
        position: [0, 1.8, 0],
      }}
      onCreated={handleCreated}
      className={`world-canvas ${blurred ? 'canvas-blurred' : 'canvas-normal'}`}
    >
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <Suspense fallback={null}>
        <SceneContent mode={mode} />
      </Suspense>
    </Canvas>
  );
});

export default World;
