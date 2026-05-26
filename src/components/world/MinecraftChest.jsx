import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sectionTValues } from '../../data/portfolio';
import { useCameraProgress } from '../../hooks/useCameraProgress';

const itemOffsets = [
  [-0.45, 0, 0],
  [0, 0.14, 0.08],
  [0.42, -0.03, -0.06],
];

const MinecraftChest = React.memo(function MinecraftChest({ sectionId, position, rotation = [0, 0, 0], mode = 'day' }) {
  const isNight = mode === 'night';
  const { progressRef } = useCameraProgress();
  const lidRef = useRef(null);
  const itemGroupRef = useRef(null);
  const itemMaterialsRef = useRef([]);

  const bodyGeometry = useMemo(() => new THREE.BoxGeometry(1.85, 0.95, 1.12), []);
  const lidGeometry = useMemo(() => new THREE.BoxGeometry(1.9, 0.28, 1.16), []);
  const trimGeometry = useMemo(() => new THREE.BoxGeometry(1.96, 0.12, 0.08), []);
  const sideTrimGeometry = useMemo(() => new THREE.BoxGeometry(0.1, 0.96, 1.22), []);
  const claspGeometry = useMemo(() => new THREE.BoxGeometry(0.28, 0.34, 0.08), []);
  const itemGeometry = useMemo(() => new THREE.BoxGeometry(0.22, 0.22, 0.22), []);
  const beamGeometry = useMemo(() => new THREE.ConeGeometry(0.46, 1.7, 4, 1, true), []);

  const woodMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isNight ? '#6b411e' : '#9a6228',
        roughness: 0.82,
        metalness: 0,
      }),
    [isNight],
  );

  const darkWoodMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isNight ? '#2f1b0d' : '#4b2a12',
        roughness: 0.88,
        metalness: 0,
      }),
    [isNight],
  );

  const metalMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isNight ? '#ffe08a' : '#d8b461',
        emissive: '#f0c861',
        emissiveIntensity: isNight ? 0.28 : 0.06,
        roughness: 0.42,
        metalness: 0.26,
      }),
    [isNight],
  );

  const beamMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffe47a',
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [],
  );

  const itemColors = useMemo(() => ['#6ee7ff', '#8dff8a', '#ffd45f'], []);
  const itemMaterials = useMemo(
    () =>
      itemColors.map(
        (color) =>
          new THREE.MeshStandardMaterial({
            color,
            emissive: color,
            emissiveIntensity: isNight ? 0.35 : 0.12,
            roughness: 0.48,
            metalness: 0.08,
            transparent: true,
            opacity: 0,
          }),
      ),
    [isNight, itemColors],
  );

  itemMaterialsRef.current = itemMaterials;

  useFrame((state, delta) => {
    const sectionT = sectionTValues[sectionId];
    const distance = Math.abs(progressRef.current - sectionT);
    const active = distance <= 0.075;
    const openAmount = active ? 1 : 0;

    if (lidRef.current) {
      lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, -1.25 * openAmount, delta * 5);
    }

    if (itemGroupRef.current) {
      itemGroupRef.current.visible = openAmount > 0.01 || itemGroupRef.current.visible;
      itemGroupRef.current.position.y = THREE.MathUtils.lerp(itemGroupRef.current.position.y, openAmount * 0.78, delta * 4);
      itemGroupRef.current.rotation.y += delta * openAmount * 0.9;
    }

    itemMaterialsRef.current.forEach((material, index) => {
      material.opacity = THREE.MathUtils.lerp(material.opacity, active ? 0.92 : 0, delta * 5);
      material.emissiveIntensity = (isNight ? 0.45 : 0.16) + Math.sin(state.clock.elapsedTime * 2 + index) * 0.08;
    });
    beamMaterial.opacity = THREE.MathUtils.lerp(beamMaterial.opacity, active ? (isNight ? 0.32 : 0.2) : 0, delta * 5);
  });

  return (
    <group position={position} rotation={rotation} scale={1.05}>
      <mesh geometry={bodyGeometry} material={woodMaterial} position={[0, 0.5, 0]} />
      <mesh geometry={trimGeometry} material={darkWoodMaterial} position={[0, 0.96, 0.6]} />
      <mesh geometry={trimGeometry} material={darkWoodMaterial} position={[0, 0.96, -0.6]} />
      <mesh geometry={sideTrimGeometry} material={darkWoodMaterial} position={[-0.98, 0.52, 0]} />
      <mesh geometry={sideTrimGeometry} material={darkWoodMaterial} position={[0.98, 0.52, 0]} />
      <mesh geometry={claspGeometry} material={metalMaterial} position={[0, 0.64, 0.6]} />
      <group ref={lidRef} position={[0, 1.0, -0.58]}>
        <mesh geometry={lidGeometry} material={woodMaterial} position={[0, 0.08, 0.58]} />
        <mesh geometry={trimGeometry} material={darkWoodMaterial} position={[0, 0.24, 1.17]} />
        <mesh geometry={claspGeometry} material={metalMaterial} position={[0, -0.06, 1.17]} />
      </group>
      <group ref={itemGroupRef} position={[0, 1.04, 0.05]}>
        <mesh geometry={beamGeometry} material={beamMaterial} position={[0, 0.62, 0]} rotation={[Math.PI, Math.PI / 4, 0]} />
        {itemOffsets.map((offset, index) => (
          <mesh
            key={`${offset[0]}-${index}`}
            geometry={itemGeometry}
            material={itemMaterials[index]}
            position={[offset[0], 0.8 + offset[1], offset[2]]}
            rotation={[0.4 + index * 0.3, index * 0.8, 0.2]}
          />
        ))}
      </group>
      <pointLight color="#ffe28a" intensity={isNight ? 1.15 : 0.28} distance={5.2} decay={2} position={[0, 1.5, 0.5]} />
    </group>
  );
});

export default MinecraftChest;
