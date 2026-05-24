import React, { useMemo } from 'react';
import * as THREE from 'three';
import { seededRandom } from './path';

export const sectionMountains = [
  { id: 'hero', position: [-8, 0, 5], radius: 6, height: 22 },
  { id: 'about', position: [10, 0, -38], radius: 5, height: 18 },
  { id: 'skills', position: [-10, 0, -78], radius: 7, height: 25 },
  { id: 'projects', position: [10, 0, -118], radius: 6, height: 20 },
  { id: 'ai', position: [-10, 0, -158], radius: 8, height: 28 },
  { id: 'timeline', position: [9, 0, -198], radius: 5, height: 18 },
  { id: 'github', position: [-9, 0, -238], radius: 6, height: 22 },
  { id: 'contact', position: [0, 0, -258], radius: 7, height: 24 },
];

const backgroundMountains = [
  { position: [-34, 0, -80], radius: 10, height: 34 },
  { position: [33, 0, -96], radius: 9, height: 30 },
  { position: [-38, 0, -128], radius: 12, height: 44 },
  { position: [36, 0, -154], radius: 11, height: 38 },
  { position: [-32, 0, -184], radius: 8, height: 30 },
  { position: [40, 0, -206], radius: 12, height: 45 },
  { position: [-42, 0, -230], radius: 10, height: 36 },
  { position: [34, 0, -254], radius: 9, height: 34 },
  { position: [-28, 0, -278], radius: 11, height: 42 },
  { position: [28, 0, -286], radius: 10, height: 36 },
];

function makeMountainGeometry(radius, height, seed) {
  const geometry = new THREE.ConeGeometry(radius, height, 24, 8);
  const position = geometry.attributes.position;
  for (let index = 0; index < position.count; index += 1) {
    const normalizedY = (position.getY(index) + height / 2) / height;
    const factor = 1 - normalizedY;
    const angle = Math.atan2(position.getZ(index), position.getX(index));
    const ridge = Math.sin(angle * 5 + seed) * 0.16 + Math.cos(angle * 9 + seed * 0.7) * 0.08;
    const noiseX = (seededRandom(seed + index * 2) - 0.5) * radius * 0.32 * factor;
    const noiseZ = (seededRandom(seed + index * 2 + 1) - 0.5) * radius * 0.32 * factor;
    const radialPush = 1 + ridge * factor;
    position.setX(index, position.getX(index) * radialPush + noiseX);
    position.setZ(index, position.getZ(index) * radialPush + noiseZ);
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

const Mountain = React.memo(function Mountain({ mountain, mode, index }) {
  const isDay = mode === 'day';
  const snowHeight = mountain.height * 0.23;
  const geometry = useMemo(() => makeMountainGeometry(mountain.radius, mountain.height, index + 1), [index, mountain.height, mountain.radius]);
  const snowGeometry = useMemo(() => new THREE.ConeGeometry(mountain.radius * 0.34, snowHeight, 24, 3), [mountain.radius, snowHeight]);
  const patchGeometry = useMemo(() => new THREE.DodecahedronGeometry(0.65, 0), []);
  const baseMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#4a6741' : '#1a2535',
        roughness: 0.85,
        metalness: 0,
      }),
    [isDay],
  );
  const snowMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#e8f0eb' : '#d5deea',
        roughness: 0.9,
        metalness: 0,
      }),
    [isDay],
  );
  const patchMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#6b7a65' : '#334154',
        roughness: 0.92,
        metalness: 0,
      }),
    [isDay],
  );

  const patches = useMemo(
    () =>
      Array.from({ length: 3 }, (_, patchIndex) => {
        const angle = seededRandom(index * 19 + patchIndex) * Math.PI * 2;
        const y = mountain.height * (0.34 + seededRandom(index * 29 + patchIndex) * 0.28);
        const radial = mountain.radius * (1 - y / mountain.height) * 0.9;
        return {
          position: [Math.cos(angle) * radial, y, Math.sin(angle) * radial],
          rotation: [seededRandom(patchIndex + 2) * Math.PI, angle, seededRandom(patchIndex + 8) * Math.PI],
          scale: [1.1 + seededRandom(patchIndex + 4) * 0.7, 0.34, 0.8 + seededRandom(patchIndex + 9) * 0.4],
        };
      }),
    [index, mountain.height, mountain.radius],
  );

  return (
    <group position={mountain.position}>
      <mesh geometry={geometry} material={baseMaterial} position={[0, mountain.height / 2, 0]} />
      <mesh geometry={snowGeometry} material={snowMaterial} position={[0, mountain.height - snowHeight / 2, 0]} />
      {patches.map((patch) => (
        <mesh
          key={`${patch.position[0]}-${patch.position[1]}`}
          geometry={patchGeometry}
          material={patchMaterial}
          position={patch.position}
          rotation={patch.rotation}
          scale={patch.scale}
        />
      ))}
    </group>
  );
});

const BackgroundMountain = React.memo(function BackgroundMountain({ mountain, mode }) {
  const isDay = mode === 'day';
  const geometry = useMemo(() => makeMountainGeometry(mountain.radius, mountain.height, mountain.position[2] * -1), [mountain.height, mountain.position, mountain.radius]);
  const snowHeight = mountain.height * 0.18;
  const snowGeometry = useMemo(() => new THREE.ConeGeometry(mountain.radius * 0.28, snowHeight, 18, 2), [mountain.radius, snowHeight]);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#6f9a82' : '#24364e',
        roughness: 0.95,
        metalness: 0,
        transparent: true,
        opacity: isDay ? 0.82 : 0.62,
      }),
    [isDay],
  );
  const snowMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#edf4f0' : '#d5deea',
        roughness: 0.92,
        metalness: 0,
        transparent: true,
        opacity: isDay ? 0.86 : 0.7,
      }),
    [isDay],
  );

  return (
    <group position={mountain.position}>
      <mesh geometry={geometry} material={material} position={[0, mountain.height / 2, 0]} />
      <mesh geometry={snowGeometry} material={snowMaterial} position={[0, mountain.height - snowHeight / 2, 0]} />
    </group>
  );
});

const Mountains = React.memo(function Mountains({ mode }) {
  return (
    <group>
      {backgroundMountains.map((mountain) => (
        <BackgroundMountain key={`${mountain.position[0]}-${mountain.position[2]}`} mountain={mountain} mode={mode} />
      ))}
      {sectionMountains.map((mountain, index) => (
        <Mountain key={mountain.id} mountain={mountain} mode={mode} index={index} />
      ))}
    </group>
  );
});

export default Mountains;
