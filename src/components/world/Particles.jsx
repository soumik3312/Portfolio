import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seededRandom } from './path';

export const RiverFoam = React.memo(function RiverFoam({ curve, isMobile = false }) {
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
    if (isMobile) return;
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

export const NightParticles = React.memo(function NightParticles({ mode, isMobile = false }) {
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
    if (isMobile) return;
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

const FloatingDust = React.memo(function FloatingDust({ isMobile = false }) {
  const count = 50;
  const bounds = useMemo(
    () => ({
      xMin: -20,
      xMax: 20,
      yMin: 0.5,
      yMax: 4,
      zMin: -30,
      zMax: -5,
    }),
    [],
  );

  const dustGeometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = bounds.xMin + seededRandom(index + 701) * (bounds.xMax - bounds.xMin);
      positions[index * 3 + 1] = bounds.yMin + seededRandom(index + 702) * (bounds.yMax - bounds.yMin);
      positions[index * 3 + 2] = bounds.zMin + seededRandom(index + 703) * (bounds.zMax - bounds.zMin);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [bounds]);

  const dustMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: '#fffde0',
        size: 0.04,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [],
  );

  useFrame((state, delta) => {
    if (isMobile) return;
    const position = dustGeometry.attributes.position;
    const time = state.clock.elapsedTime;

    for (let index = 0; index < count; index += 1) {
      let x = position.getX(index) + Math.sin(time * 0.3 + index) * delta * 0.05;
      let y = position.getY(index) + Math.cos(time * 0.2 + index) * delta * 0.03;
      let z = position.getZ(index) + Math.sin(time * 0.4 + index) * delta * 0.04;

      if (x > bounds.xMax) x = bounds.xMin;
      if (x < bounds.xMin) x = bounds.xMax;
      if (y > bounds.yMax) y = bounds.yMin;
      if (y < bounds.yMin) y = bounds.yMax;
      if (z > bounds.zMax) z = bounds.zMin;
      if (z < bounds.zMin) z = bounds.zMax;

      position.setXYZ(index, x, y, z);
    }

    position.needsUpdate = true;
  });

  return <points geometry={dustGeometry} material={dustMaterial} />;
});

const CinematicMist = React.memo(function CinematicMist({ mode, isMobile = false }) {
  const isNight = mode === 'night';
  const mistRefs = useRef([]);
  const bands = useMemo(
    () =>
      Array.from({ length: 9 }, (_, index) => ({
        x: (seededRandom(index + 820) - 0.5) * 18,
        y: 1.05 + seededRandom(index + 830) * 1.35,
        z: -18 - index * 27 - seededRandom(index + 840) * 10,
        width: 18 + seededRandom(index + 850) * 15,
        height: 2.4 + seededRandom(index + 860) * 2.2,
        drift: 0.7 + seededRandom(index + 870) * 0.9,
        phase: seededRandom(index + 880) * Math.PI * 2,
        rotation: (seededRandom(index + 890) - 0.5) * 0.08,
      })),
    [],
  );

  useFrame((state, delta) => {
    if (isMobile) return;
    const time = state.clock.elapsedTime;
    mistRefs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const band = bands[index];
      mesh.position.x = band.x + Math.sin(time * 0.16 + band.phase) * band.drift;
      mesh.position.y = band.y + Math.cos(time * 0.11 + band.phase) * 0.12;
      const pulse = 0.75 + Math.sin(time * 0.38 + band.phase) * 0.18;
      const targetOpacity = (isNight ? 0.18 : 0.035) * pulse;
      mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, targetOpacity, delta * 1.8);
    });
  });

  return (
    <group>
      {bands.map((band, index) => (
        <mesh
          key={`${band.z}-${index}`}
          ref={(element) => {
            mistRefs.current[index] = element;
          }}
          position={[band.x, band.y, band.z]}
          rotation={[0, 0, band.rotation]}
        >
          <planeGeometry args={[band.width, band.height]} />
          <meshBasicMaterial color={isNight ? '#cfe7ff' : '#fff8dd'} transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
});

const Particles = React.memo(function Particles({ mode, isMobile = false }) {
  return (
    <group>
      <FloatingDust isMobile={isMobile} />
      <CinematicMist mode={mode} isMobile={isMobile} />
      <NightParticles mode={mode} isMobile={isMobile} />
    </group>
  );
});

export default Particles;
