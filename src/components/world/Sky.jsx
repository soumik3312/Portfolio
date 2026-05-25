import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const clouds = [
  { position: [-34, 20, -34], scale: [3.8, 0.72, 1.2] },
  { position: [24, 26, -72], scale: [4.6, 0.82, 1.5] },
  { position: [-28, 24, -118], scale: [4.2, 0.76, 1.4] },
  { position: [30, 22, -156], scale: [5.2, 0.86, 1.7] },
  { position: [-22, 27, -196], scale: [3.9, 0.72, 1.2] },
  { position: [20, 25, -232], scale: [4.8, 0.8, 1.55] },
  { position: [-36, 23, -272], scale: [4.4, 0.78, 1.45] },
];

const skyGlints = [
  { position: [-18, 16, -45], scale: [0.25, 0.25, 0.25] },
  { position: [14, 20, -92], scale: [0.18, 0.18, 0.18] },
  { position: [36, 18, -138], scale: [0.22, 0.22, 0.22] },
  { position: [-30, 21, -190], scale: [0.16, 0.16, 0.16] },
];

const birds = [
  { position: [-30, 18, -80] },
  { position: [-28, 19, -82] },
  { position: [-32, 17, -78] },
  { position: [-26, 18.5, -84] },
];

const Sky = React.memo(function Sky({ mode }) {
  const cloudRef = useRef(null);
  const birdsRef = useRef(null);
  const isDay = mode === 'day';
  const sunGeometry = useMemo(() => new THREE.SphereGeometry(8, 12, 8), []);
  const sunGlowGeometry = useMemo(() => new THREE.SphereGeometry(10, 12, 8), []);
  const blockSunGeometry = useMemo(() => new THREE.PlaneGeometry(9, 9), []);
  const blockSunGlowGeometry = useMemo(() => new THREE.PlaneGeometry(14, 14), []);
  const sunRayGeometry = useMemo(() => new THREE.BoxGeometry(0.28, 3.2, 0.05), []);
  const moonGeometry = useMemo(() => new THREE.SphereGeometry(5, 12, 8), []);
  const cloudGeometry = useMemo(() => new THREE.SphereGeometry(1, 12, 8), []);
  const glintGeometry = useMemo(() => new THREE.OctahedronGeometry(1, 0), []);
  const wingGeometry = useMemo(() => new THREE.BoxGeometry(0.4, 0.05, 0.15), []);

  const sunMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#fff9e6',
        transparent: true,
        opacity: isDay ? 1 : 0,
        depthWrite: false,
      }),
    [isDay],
  );

  const sunGlowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffe0a0',
        transparent: true,
        opacity: isDay ? 0.3 : 0,
        depthWrite: false,
      }),
    [isDay],
  );

  const blockSunMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#fff1a8',
        transparent: true,
        opacity: isDay ? 0.96 : 0,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [isDay],
  );

  const blockSunGlowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffd66f',
        transparent: true,
        opacity: isDay ? 0.22 : 0,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [isDay],
  );

  const sunRayMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffe29a',
        transparent: true,
        opacity: isDay ? 0.38 : 0,
        depthWrite: false,
      }),
    [isDay],
  );

  const moonMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#fff4c2',
        transparent: true,
        opacity: isDay ? 0 : 0.9,
        depthWrite: false,
      }),
    [isDay],
  );

  const cloudMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: isDay ? 0.9 : 0.24,
        depthWrite: false,
      }),
    [isDay],
  );

  const birdMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#1a1a2a',
        transparent: true,
        opacity: isDay ? 0.76 : 0.48,
        depthWrite: false,
      }),
    [isDay],
  );

  const glintMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#fff8c8',
        transparent: true,
        opacity: isDay ? 0.42 : 0,
        depthWrite: false,
      }),
    [isDay],
  );

  useFrame((state, delta) => {
    if (!cloudRef.current) return;
    cloudRef.current.position.x += delta * 0.05;
    if (cloudRef.current.position.x > 6) cloudRef.current.position.x = -6;

    if (!birdsRef.current) return;
    const time = state.clock.elapsedTime;
    birdsRef.current.position.x += delta * 1.5;
    if (birdsRef.current.position.x > 60) birdsRef.current.position.x = -60;

    birdsRef.current.children.forEach((bird, index) => {
      const flap = Math.sin(time * 4 + index * 0.4) * 0.3;
      if (bird.children[0]) bird.children[0].rotation.z = 0.25 + flap;
      if (bird.children[1]) bird.children[1].rotation.z = -0.25 - flap;
    });
  });

  return (
    <group>
      <mesh geometry={sunGlowGeometry} material={sunGlowMaterial} position={[40, 60, -150]} />
      <mesh geometry={sunGeometry} material={sunMaterial} position={[40, 60, -150]} />
      <group position={[30, 36, -88]} rotation={[0, 0, 0.1]}>
        <mesh geometry={blockSunGlowGeometry} material={blockSunGlowMaterial} />
        <mesh geometry={blockSunGeometry} material={blockSunMaterial} />
        {Array.from({ length: 8 }, (_, index) => (
          <mesh
            key={`sun-ray-${index}`}
            geometry={sunRayGeometry}
            material={sunRayMaterial}
            position={[Math.cos((index / 8) * Math.PI * 2) * 7.7, Math.sin((index / 8) * Math.PI * 2) * 7.7, -0.1]}
            rotation={[0, 0, (index / 8) * Math.PI * 2]}
          />
        ))}
      </group>
      <mesh geometry={moonGeometry} material={moonMaterial} position={[38, 54, -150]} />
      {skyGlints.map((glint) => (
        <mesh key={`${glint.position[0]}-${glint.position[2]}`} geometry={glintGeometry} material={glintMaterial} position={glint.position} scale={glint.scale} />
      ))}
      <group ref={birdsRef} scale={0.3}>
        {birds.map((bird) => (
          <group key={`${bird.position[0]}-${bird.position[1]}`} position={bird.position}>
            <mesh geometry={wingGeometry} material={birdMaterial} position={[-0.2, 0, 0]} rotation={[0, 0, 0.25]} />
            <mesh geometry={wingGeometry} material={birdMaterial} position={[0.2, 0, 0]} rotation={[0, 0, -0.25]} />
          </group>
        ))}
      </group>
      <group ref={cloudRef}>
        {clouds.map((cloud) => (
          <group key={`${cloud.position[0]}-${cloud.position[2]}`} position={cloud.position}>
            <mesh geometry={cloudGeometry} material={cloudMaterial} scale={cloud.scale} />
            <mesh geometry={cloudGeometry} material={cloudMaterial} position={[1.8, 0.22, 0.25]} scale={[cloud.scale[0] * 0.58, cloud.scale[1] * 1.08, cloud.scale[2] * 0.9]} />
            <mesh geometry={cloudGeometry} material={cloudMaterial} position={[-1.6, 0.12, -0.18]} scale={[cloud.scale[0] * 0.52, cloud.scale[1], cloud.scale[2] * 0.8]} />
          </group>
        ))}
      </group>
    </group>
  );
});

export default Sky;
