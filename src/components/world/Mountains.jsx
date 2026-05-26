import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sectionTValues } from '../../data/portfolio';
import { useCameraProgress } from '../../hooks/useCameraProgress';
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

const mountainColors = {
  hero: '#4a6741',
  about: '#3d5c4a',
  skills: '#506844',
  projects: '#445a38',
  ai: '#3a5240',
  timeline: '#4e6040',
  github: '#425838',
  contact: '#486042',
};

const mountainGlowColors = {
  hero: '#fff5e0',
  about: '#fff5e0',
  skills: '#e0f5ff',
  projects: '#e0ffe8',
  ai: '#f0e0ff',
  timeline: '#fff0e0',
  github: '#e0ffe0',
  contact: '#ffe8e0',
};

const backgroundMountainColors = ['#7a9a90', '#8aaa9a', '#6a8a80'];

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
  const { progressRef } = useCameraProgress();
  const snowRef = useRef(null);
  const snowHeight = mountain.height * 0.23;
  const geometry = useMemo(() => makeMountainGeometry(mountain.radius, mountain.height, index + 1), [index, mountain.height, mountain.radius]);
  const snowGeometry = useMemo(() => new THREE.ConeGeometry(mountain.radius * 0.34, snowHeight, 24, 3), [mountain.radius, snowHeight]);
  const patchGeometry = useMemo(() => new THREE.DodecahedronGeometry(0.65, 0), []);
  const ledgeGeometry = useMemo(() => new THREE.BoxGeometry(1, 0.18, 0.5), []);
  const baseMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? mountainColors[mountain.id] : '#3a526c',
        roughness: 0.85,
        metalness: 0,
      }),
    [isDay, mountain.id],
  );
  const snowMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#e8f0eb' : '#d5deea',
        emissive: mountainGlowColors[mountain.id] || '#fff5e0',
        emissiveIntensity: 0.05,
        roughness: 0.9,
        metalness: 0,
      }),
    [isDay, mountain.id],
  );
  const patchMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#6b7a65' : '#607287',
        roughness: 0.92,
        metalness: 0,
      }),
    [isDay],
  );

  const ledgeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#8aa078' : '#71889d',
        roughness: 0.94,
        metalness: 0,
      }),
    [isDay],
  );

  const patches = useMemo(
    () =>
      Array.from({ length: 5 }, (_, patchIndex) => {
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

  const ledges = useMemo(
    () =>
      Array.from({ length: 5 }, (_, ledgeIndex) => {
        const angle = seededRandom(index * 41 + ledgeIndex) * Math.PI * 2;
        const y = mountain.height * (0.18 + seededRandom(index * 43 + ledgeIndex) * 0.44);
        const radial = mountain.radius * (1 - y / mountain.height) * 0.78;
        return {
          position: [Math.cos(angle) * radial, y, Math.sin(angle) * radial],
          rotation: [seededRandom(ledgeIndex + 6) * 0.4, -angle, seededRandom(ledgeIndex + 12) * 0.2],
          scale: [0.9 + seededRandom(ledgeIndex + 16) * 1.2, 1, 0.7 + seededRandom(ledgeIndex + 20) * 0.7],
        };
      }),
    [index, mountain.height, mountain.radius],
  );

  useFrame((_, delta) => {
    if (!snowRef.current) return;
    const distance = Math.abs(progressRef.current - sectionTValues[mountain.id]);
    const targetIntensity = distance <= 0.08 ? 0.25 : 0.05;
    const material = snowRef.current.material;
    material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, targetIntensity, delta * 2);
  });

  return (
    <group position={mountain.position}>
      <mesh geometry={geometry} material={baseMaterial} position={[0, mountain.height / 2, 0]} />
      <mesh ref={snowRef} geometry={snowGeometry} material={snowMaterial} position={[0, mountain.height - snowHeight / 2, 0]} />
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
      {ledges.map((ledge) => (
        <mesh
          key={`${ledge.position[0]}-${ledge.position[1]}-ledge`}
          geometry={ledgeGeometry}
          material={ledgeMaterial}
          position={ledge.position}
          rotation={ledge.rotation}
          scale={ledge.scale}
        />
      ))}
    </group>
  );
});

const BackgroundMountain = React.memo(function BackgroundMountain({ mountain, mode, index }) {
  const isDay = mode === 'day';
  const geometry = useMemo(() => makeMountainGeometry(mountain.radius, mountain.height, mountain.position[2] * -1), [mountain.height, mountain.position, mountain.radius]);
  const snowHeight = mountain.height * 0.18;
  const snowGeometry = useMemo(() => new THREE.ConeGeometry(mountain.radius * 0.28, snowHeight, 18, 2), [mountain.radius, snowHeight]);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? backgroundMountainColors[index % backgroundMountainColors.length] : '#526f83',
        roughness: 0.95,
        metalness: 0,
        transparent: true,
        opacity: isDay ? 0.82 : 0.72,
      }),
    [index, isDay],
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
      {backgroundMountains.map((mountain, index) => (
        <BackgroundMountain key={`${mountain.position[0]}-${mountain.position[2]}`} mountain={mountain} mode={mode} index={index} />
      ))}
      {sectionMountains.map((mountain, index) => (
        <Mountain key={mountain.id} mountain={mountain} mode={mode} index={index} />
      ))}
    </group>
  );
});

export default Mountains;
