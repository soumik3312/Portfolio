import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seededRandom } from './path';

export const RiverFoam = React.memo(function RiverFoam({ curve }) {
  const count = 80;
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const point = curve.getPoint(index / count);
      positions[index * 3] = point.x + (seededRandom(index + 17) - 0.5) * 1.8;
      positions[index * 3 + 1] = 0.12;
      positions[index * 3 + 2] = point.z + (seededRandom(index + 27) - 0.5) * 1.4;
    }
    const foamGeometry = new THREE.BufferGeometry();
    foamGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return foamGeometry;
  }, [curve]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: '#ffffff',
        size: 0.08,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [],
  );

  const progress = useRef(Array.from({ length: count }, (_, index) => seededRandom(index + 3)));
  const speeds = useRef(Array.from({ length: count }, (_, index) => 0.018 + seededRandom(index + 77) * 0.018));
  const tempPoint = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    if (!geometry) return;
    const position = geometry.attributes.position;
    for (let index = 0; index < count; index += 1) {
      progress.current[index] += speeds.current[index] * delta;
      if (progress.current[index] > 1) progress.current[index] = 0;
      curve.getPoint(progress.current[index], tempPoint);
      position.setXYZ(
        index,
        tempPoint.x + (seededRandom(index + 17) - 0.5) * 1.8,
        0.12,
        tempPoint.z + (seededRandom(index + 27) - 0.5) * 1.4,
      );
    }
    position.needsUpdate = true;
  });

  return <points geometry={geometry} material={material} />;
});

export const NightParticles = React.memo(function NightParticles({ mode }) {
  const isNight = mode === 'night';
  const starGeometry = useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = (seededRandom(index + 100) - 0.5) * 170;
      positions[index * 3 + 1] = 18 + seededRandom(index + 200) * 46;
      positions[index * 3 + 2] = -20 - seededRandom(index + 300) * 280;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  const starMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: '#ffffff',
        size: 0.06,
        transparent: true,
        opacity: isNight ? 0.85 : 0,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [isNight],
  );

  const fireflyGeometry = useMemo(() => {
    const count = 60;
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = (seededRandom(index + 401) - 0.5) * 42;
      positions[index * 3 + 1] = 0.8 + seededRandom(index + 402) * 2.2;
      positions[index * 3 + 2] = -18 - seededRandom(index + 403) * 220;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  const fireflyMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: '#ffe066',
        size: 0.05,
        transparent: true,
        opacity: isNight ? 0.82 : 0,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [isNight],
  );

  useFrame((state, delta) => {
    if (!fireflyGeometry || !isNight) return;
    const position = fireflyGeometry.attributes.position;
    const time = state.clock.elapsedTime;
    for (let index = 0; index < 60; index += 1) {
      const x = position.getX(index) + Math.sin(time + index) * delta * 0.08;
      const y = position.getY(index) + Math.cos(time * 0.7 + index) * delta * 0.04;
      position.setXYZ(index, x, y, position.getZ(index));
    }
    position.needsUpdate = true;
  });

  return (
    <group>
      <points geometry={starGeometry} material={starMaterial} />
      <points geometry={fireflyGeometry} material={fireflyMaterial} />
    </group>
  );
});

const Particles = React.memo(function Particles({ mode }) {
  return <NightParticles mode={mode} />;
});

export default Particles;
