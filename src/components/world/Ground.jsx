import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { createJourneyCurve, seededRandom } from './path';

const grassPatches = [
  { position: [-18, 0.005, -36], scale: [16, 18, 1], rotation: -0.18, tone: 0, opacity: 0.72 },
  { position: [18, 0.006, -76], scale: [20, 22, 1], rotation: 0.22, tone: 1, opacity: 0.64 },
  { position: [-22, 0.007, -118], scale: [14, 25, 1], rotation: 0.1, tone: 2, opacity: 0.7 },
  { position: [20, 0.008, -164], scale: [18, 16, 1], rotation: -0.28, tone: 0, opacity: 0.78 },
  { position: [-16, 0.009, -210], scale: [12, 20, 1], rotation: 0.34, tone: 1, opacity: 0.66 },
  { position: [15, 0.01, -246], scale: [19, 14, 1], rotation: -0.12, tone: 2, opacity: 0.74 },
];

const stoneColors = ['#b0a898', '#c8bfb0', '#988880', '#a89888'];
const flowerColors = ['#f1d65a', '#f29b68', '#d86f90', '#f7f1cf'];

const Ground = React.memo(function Ground({ mode }) {
  const mainGeometry = useMemo(() => new THREE.PlaneGeometry(400, 400, 1, 1), []);
  const patchGeometry = useMemo(() => new THREE.PlaneGeometry(1, 1, 1, 1), []);
  const stoneGeometry = useMemo(() => new THREE.BoxGeometry(1, 0.04, 1), []);
  const pebbleGeometry = useMemo(() => new THREE.SphereGeometry(0.08, 4, 3), []);
  const flowerGeometry = useMemo(() => new THREE.BoxGeometry(0.12, 0.12, 0.12), []);
  const grassGeometry = useMemo(() => new THREE.ConeGeometry(0.06, 0.45, 6), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const stoneRef = useRef(null);
  const pebbleRef = useRef(null);
  const flowerRef = useRef(null);
  const grassRef = useRef(null);
  const isDay = mode === 'day';

  const mainMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#4a7c3f' : '#1a2d1a',
        roughness: 0.95,
        metalness: 0,
      }),
    [isDay],
  );

  const patchMaterials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({
        color: isDay ? '#3d6b35' : '#132413',
        transparent: true,
        opacity: isDay ? 0.72 : 0.52,
        roughness: 0.98,
        metalness: 0,
      }),
      new THREE.MeshStandardMaterial({
        color: isDay ? '#5a9048' : '#203b20',
        transparent: true,
        opacity: isDay ? 0.66 : 0.48,
        roughness: 0.98,
        metalness: 0,
      }),
      new THREE.MeshStandardMaterial({
        color: isDay ? '#4a7c3f' : '#1a2d1a',
        transparent: true,
        opacity: isDay ? 0.74 : 0.5,
        roughness: 0.98,
        metalness: 0,
      }),
    ],
    [isDay],
  );

  const stoneMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#ffffff' : '#4f5562',
        roughness: 0.9,
        metalness: 0,
        vertexColors: isDay,
      }),
    [isDay],
  );

  const pebbleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#8a8078' : '#4c5058',
        roughness: 0.92,
        metalness: 0,
      }),
    [isDay],
  );

  const grassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#6db35d' : '#233f23',
        roughness: 1,
        metalness: 0,
      }),
    [isDay],
  );

  const flowerMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.85,
        metalness: 0,
        vertexColors: true,
      }),
    [],
  );

  const stones = useMemo(() => {
    const curve = createJourneyCurve();
    return Array.from({ length: 78 }, (_, index) => {
      const t = index / 77;
      const point = curve.getPoint(t);
      const tangent = curve.getTangent(t);
      const jitter = (seededRandom(index + 31) - 0.5) * 0.24;
      return {
        x: point.x + jitter,
        z: point.z,
        rotation: Math.atan2(tangent.x, tangent.z),
        scale: [1 + seededRandom(index + 100) * 0.55, 1, 0.62 + seededRandom(index + 200) * 0.32],
      };
    });
  }, []);

  const grasses = useMemo(() => {
    const curve = createJourneyCurve();
    return Array.from({ length: 120 }, (_, index) => {
      const t = seededRandom(index + 9);
      const point = curve.getPoint(t);
      const side = index % 2 === 0 ? -1 : 1;
      const offset = 2.4 + seededRandom(index + 42) * 6.8;
      return {
        x: point.x + side * offset,
        z: point.z + (seededRandom(index + 74) - 0.5) * 5,
        rotation: seededRandom(index + 88) * Math.PI * 2,
        scale: 0.55 + seededRandom(index + 5) * 0.85,
      };
    });
  }, []);

  const pebbles = useMemo(() => {
    const curve = createJourneyCurve();
    return Array.from({ length: 30 }, (_, index) => {
      const t = seededRandom(index + 811);
      const point = curve.getPoint(t);
      const tangent = curve.getTangent(t);
      const side = index % 2 === 0 ? -1 : 1;
      const edgeOffset = 0.9 + seededRandom(index + 812) * 1.1;
      return {
        x: point.x + side * edgeOffset + (seededRandom(index + 813) - 0.5) * 0.35,
        z: point.z + (seededRandom(index + 814) - 0.5) * 2,
        rotation: Math.atan2(tangent.x, tangent.z) + seededRandom(index + 815) * Math.PI,
        scale: 0.55 + seededRandom(index + 816) * 0.75,
      };
    });
  }, []);

  const flowers = useMemo(() => {
    const curve = createJourneyCurve();
    return Array.from({ length: 68 }, (_, index) => {
      const t = seededRandom(index + 901);
      const point = curve.getPoint(t);
      const side = index % 2 === 0 ? -1 : 1;
      const offset = 3.2 + seededRandom(index + 902) * 10;
      return {
        x: point.x + side * offset + (seededRandom(index + 903) - 0.5) * 1.2,
        z: point.z + (seededRandom(index + 904) - 0.5) * 6,
        rotation: seededRandom(index + 905) * Math.PI * 2,
        scale: 0.75 + seededRandom(index + 906) * 0.9,
        color: flowerColors[index % flowerColors.length],
      };
    });
  }, []);

  useEffect(() => {
    if (!stoneRef.current || !grassRef.current || !pebbleRef.current || !flowerRef.current) return;

    stones.forEach((stone, index) => {
      dummy.position.set(stone.x, 0.045, stone.z);
      dummy.rotation.set(0, stone.rotation, 0);
      dummy.scale.set(stone.scale[0], stone.scale[1], stone.scale[2]);
      dummy.updateMatrix();
      stoneRef.current.setMatrixAt(index, dummy.matrix);
      stoneRef.current.setColorAt(index, new THREE.Color(stoneColors[index % stoneColors.length]));
    });
    stoneRef.current.instanceMatrix.needsUpdate = true;
    if (stoneRef.current.instanceColor) stoneRef.current.instanceColor.needsUpdate = true;

    pebbles.forEach((pebble, index) => {
      dummy.position.set(pebble.x, 0.065 * pebble.scale, pebble.z);
      dummy.rotation.set(pebble.rotation * 0.2, pebble.rotation, pebble.rotation * 0.1);
      dummy.scale.set(pebble.scale * 1.25, pebble.scale * 0.62, pebble.scale);
      dummy.updateMatrix();
      pebbleRef.current.setMatrixAt(index, dummy.matrix);
    });
    pebbleRef.current.instanceMatrix.needsUpdate = true;

    flowers.forEach((flower, index) => {
      dummy.position.set(flower.x, 0.14 * flower.scale, flower.z);
      dummy.rotation.set(0, flower.rotation, 0);
      dummy.scale.set(flower.scale, flower.scale * 1.35, flower.scale);
      dummy.updateMatrix();
      flowerRef.current.setMatrixAt(index, dummy.matrix);
      flowerRef.current.setColorAt(index, new THREE.Color(flower.color));
    });
    flowerRef.current.instanceMatrix.needsUpdate = true;
    if (flowerRef.current.instanceColor) flowerRef.current.instanceColor.needsUpdate = true;

    grasses.forEach((grass, index) => {
      dummy.position.set(grass.x, 0.23 * grass.scale, grass.z);
      dummy.rotation.set(0.08, grass.rotation, -0.08);
      dummy.scale.setScalar(grass.scale);
      dummy.updateMatrix();
      grassRef.current.setMatrixAt(index, dummy.matrix);
    });
    grassRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy, flowers, grasses, pebbles, stones]);

  return (
    <group>
      <mesh geometry={mainGeometry} material={mainMaterial} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -130]} />
      {grassPatches.map((patch) => (
        <mesh
          key={`${patch.position[0]}-${patch.position[2]}`}
          geometry={patchGeometry}
          material={patchMaterials[patch.tone]}
          position={patch.position}
          rotation={[-Math.PI / 2, 0, patch.rotation]}
          scale={patch.scale}
        />
      ))}
      <instancedMesh ref={stoneRef} args={[stoneGeometry, stoneMaterial, stones.length]} />
      <instancedMesh ref={pebbleRef} args={[pebbleGeometry, pebbleMaterial, pebbles.length]} />
      <instancedMesh ref={flowerRef} args={[flowerGeometry, flowerMaterial, flowers.length]} />
      <instancedMesh ref={grassRef} args={[grassGeometry, grassMaterial, grasses.length]} />
    </group>
  );
});

export default Ground;
