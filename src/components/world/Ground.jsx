import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { createJourneyCurve, seededRandom } from './path';

const grassPatches = [
  { position: [-38, 0.012, -54], scale: [62, 38, 1], rotation: -0.18, tone: 0 },
  { position: [34, 0.014, -112], scale: [76, 42, 1], rotation: 0.22, tone: 1 },
  { position: [-28, 0.016, -188], scale: [68, 50, 1], rotation: 0.1, tone: 0 },
  { position: [22, 0.018, -234], scale: [54, 32, 1], rotation: -0.28, tone: 1 },
];

const Ground = React.memo(function Ground({ mode }) {
  const mainGeometry = useMemo(() => new THREE.PlaneGeometry(400, 400, 1, 1), []);
  const patchGeometry = useMemo(() => new THREE.PlaneGeometry(1, 1, 1, 1), []);
  const stoneGeometry = useMemo(() => new THREE.BoxGeometry(1, 0.04, 1), []);
  const grassGeometry = useMemo(() => new THREE.ConeGeometry(0.06, 0.45, 6), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const stoneRef = useRef(null);
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
        roughness: 0.98,
        metalness: 0,
      }),
      new THREE.MeshStandardMaterial({
        color: isDay ? '#5a8f4a' : '#203b20',
        roughness: 0.98,
        metalness: 0,
      }),
    ],
    [isDay],
  );

  const stoneMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#b4a48c' : '#4f5562',
        roughness: 0.9,
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

  useEffect(() => {
    if (!stoneRef.current || !grassRef.current) return;

    stones.forEach((stone, index) => {
      dummy.position.set(stone.x, 0.045, stone.z);
      dummy.rotation.set(0, stone.rotation, 0);
      dummy.scale.set(stone.scale[0], stone.scale[1], stone.scale[2]);
      dummy.updateMatrix();
      stoneRef.current.setMatrixAt(index, dummy.matrix);
    });
    stoneRef.current.instanceMatrix.needsUpdate = true;

    grasses.forEach((grass, index) => {
      dummy.position.set(grass.x, 0.23 * grass.scale, grass.z);
      dummy.rotation.set(0.08, grass.rotation, -0.08);
      dummy.scale.setScalar(grass.scale);
      dummy.updateMatrix();
      grassRef.current.setMatrixAt(index, dummy.matrix);
    });
    grassRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy, grasses, stones]);

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
      <instancedMesh ref={grassRef} args={[grassGeometry, grassMaterial, grasses.length]} />
    </group>
  );
});

export default Ground;
