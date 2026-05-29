import React, { Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import CameraController from '../camera/CameraController';
import Ground from './Ground';
import MinecraftChest from './MinecraftChest';
import Mountains from './Mountains';
import Particles from './Particles';
import River from './River';
import Rocks from './Rocks';
import Signboard from './Signboard';
import Sky from './Sky';
import StreetLights from './StreetLights';
import Trees from './Trees';
import VoxelDetails from './VoxelDetails';
import { MOBILE_WORLD_X_SCALE } from './path';

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
      <ambientLight color={isDay ? '#d8efe0' : '#dbe8ff'} intensity={isDay ? 1.2 : 1.95} />
      <directionalLight position={isDay ? [24, 35, 18] : [-18, 28, 14]} color={isDay ? '#fff5d6' : '#f4fbff'} intensity={isDay ? 2.1 : 1.5} />
      <hemisphereLight color={isDay ? '#bfe8ff' : '#91add0'} groundColor={isDay ? '#5f8d4f' : '#997452'} intensity={isDay ? 0.62 : 1.36} />
      {!isDay ? (
        <>
          <ambientLight color="#ffe1a0" intensity={0.72} />
          <directionalLight position={[12, 18, -28]} color="#d9ecff" intensity={0.42} />
          <pointLight color="#fff0ba" intensity={0.9} distance={70} decay={1.2} position={[0, 8, -90]} />
        </>
      ) : null}
    </>
  );
});

const SceneContent = React.memo(function SceneContent({ mode, isMobile }) {
  const worldScaleX = isMobile ? MOBILE_WORLD_X_SCALE : 1;

  return (
    <>
      <fog attach="fog" args={[mode === 'day' ? '#c8e8d4' : '#7890a8', mode === 'day' ? 95 : 125, mode === 'day' ? 285 : 350]} />
      <CameraController />
      <Lights mode={mode} />
      <group scale={[worldScaleX, 1, 1]}>
        <Sky mode={mode} isMobile={isMobile} />
        <Ground mode={mode} />
        <River mode={mode} isMobile={isMobile} />
        <Mountains mode={mode} />
        <Trees mode={mode} isMobile={isMobile} />
        <VoxelDetails mode={mode} />
        <Rocks mode={mode} />
        <StreetLights mode={mode} />
        <Particles mode={mode} isMobile={isMobile} />
        {signboards.map((board) => (
          <React.Fragment key={board.id}>
            <Signboard sectionName={board.sectionName} position={board.position} rotation={board.rotation} mode={mode} />
            <MinecraftChest sectionId={board.id} position={[board.position[0] * 0.92, 0.16, board.position[2] + 2.1]} rotation={board.rotation} mode={mode} />
          </React.Fragment>
        ))}
      </group>
    </>
  );
});

const World = React.memo(function World({ mode, onReady, blurred = false, isMobile = false }) {
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
      dpr={isMobile ? [0.85, 1.15] : [1, 1.5]}
      performance={{ min: 0.5 }}
      gl={{
        antialias: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
        alpha: true,
      }}
      camera={{
        fov: isMobile ? 76 : 60,
        near: 0.1,
        far: 400,
        position: [0, isMobile ? 2.35 : 1.8, 0],
      }}
      onCreated={handleCreated}
      className={`world-canvas ${blurred ? 'canvas-blurred' : 'canvas-normal'}`}
    >
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <Suspense fallback={null}>
        <SceneContent mode={mode} isMobile={isMobile} />
      </Suspense>
    </Canvas>
  );
});

export default World;
