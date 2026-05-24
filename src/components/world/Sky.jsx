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

const Sky = React.memo(function Sky({ mode }) {
  const cloudRef = useRef(null);
  const isDay = mode === 'day';
  const sunGeometry = useMemo(() => new THREE.SphereGeometry(8, 12, 8), []);
  const sunGlowGeometry = useMemo(() => new THREE.SphereGeometry(10, 12, 8), []);
  const moonGeometry = useMemo(() => new THREE.SphereGeometry(5, 12, 8), []);
  const cloudGeometry = useMemo(() => new THREE.SphereGeometry(1, 12, 8), []);

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

  useFrame((_, delta) => {
    if (!cloudRef.current) return;
    cloudRef.current.position.x += delta * 0.05;
    if (cloudRef.current.position.x > 6) cloudRef.current.position.x = -6;
  });

  return (
    <group>
      <mesh geometry={sunGlowGeometry} material={sunGlowMaterial} position={[40, 60, -150]} />
      <mesh geometry={sunGeometry} material={sunMaterial} position={[40, 60, -150]} />
      <mesh geometry={moonGeometry} material={moonMaterial} position={[38, 54, -150]} />
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
