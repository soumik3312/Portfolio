import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { createJourneyCurve, seededRandom } from './path';
import { sectionMountains } from './Mountains';

const oreColors = ['#4ee6ff', '#61ff8f', '#ffd45a', '#d186ff', '#ff6d6d'];
const flowerColors = ['#ffdc5c', '#ff7f90', '#ffffff', '#a1e85b'];

function useInstancedMatrices(items, ref, dummy, setMatrix) {
  useEffect(() => {
    if (!ref.current) return;
    items.forEach((item, index) => {
      setMatrix(item, index);
      dummy.updateMatrix();
      ref.current.setMatrixAt(index, dummy.matrix);
      if (item.color) ref.current.setColorAt(index, new THREE.Color(item.color));
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [dummy, items, ref, setMatrix]);
}

const VoxelDetails = React.memo(function VoxelDetails({ mode }) {
  const isDay = mode === 'day';
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const grassBlockRef = useRef(null);
  const flowerRef = useRef(null);
  const trunkRef = useRef(null);
  const leafRef = useRef(null);
  const oreRef = useRef(null);

  const blockGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const flowerGeometry = useMemo(() => new THREE.BoxGeometry(0.18, 0.45, 0.08), []);
  const trunkGeometry = useMemo(() => new THREE.BoxGeometry(0.42, 1.45, 0.42), []);
  const leafGeometry = useMemo(() => new THREE.BoxGeometry(1.45, 1.05, 1.45), []);
  const oreGeometry = useMemo(() => new THREE.BoxGeometry(0.36, 0.36, 0.08), []);

  const grassBlockMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#4f8d34' : '#3e6b2f',
        roughness: 0.94,
        metalness: 0,
      }),
    [isDay],
  );

  const flowerMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.86,
        metalness: 0,
        vertexColors: true,
      }),
    [],
  );

  const trunkMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#6b4424' : '#4c3521',
        roughness: 0.96,
        metalness: 0,
      }),
    [isDay],
  );

  const leafMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#1f6d22' : '#2c5a2d',
        roughness: 0.98,
        metalness: 0,
      }),
    [isDay],
  );

  const oreMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: isDay ? '#14251f' : '#3a4e5a',
        emissiveIntensity: isDay ? 0.04 : 0.28,
        roughness: 0.55,
        metalness: 0.05,
        vertexColors: true,
      }),
    [isDay],
  );

  const grassBlocks = useMemo(() => {
    const curve = createJourneyCurve();
    return Array.from({ length: 72 }, (_, index) => {
      const t = seededRandom(index + 1201);
      const point = curve.getPoint(t);
      const side = index % 2 === 0 ? -1 : 1;
      const offset = 4.5 + seededRandom(index + 1202) * 14;
      return {
        x: point.x + side * offset,
        z: point.z + (seededRandom(index + 1203) - 0.5) * 10,
        scale: [0.55 + seededRandom(index + 1204) * 0.55, 0.08, 0.55 + seededRandom(index + 1205) * 0.55],
        rotation: seededRandom(index + 1206) * Math.PI * 2,
      };
    });
  }, []);

  const flowers = useMemo(() => {
    const curve = createJourneyCurve();
    return Array.from({ length: 90 }, (_, index) => {
      const t = seededRandom(index + 1301);
      const point = curve.getPoint(t);
      const side = index % 2 === 0 ? -1 : 1;
      return {
        x: point.x + side * (3.8 + seededRandom(index + 1302) * 11),
        z: point.z + (seededRandom(index + 1303) - 0.5) * 8,
        y: 0.22,
        rotation: seededRandom(index + 1304) * Math.PI * 2,
        scale: 0.55 + seededRandom(index + 1305) * 0.8,
        color: flowerColors[index % flowerColors.length],
      };
    });
  }, []);

  const blockTrees = useMemo(() => {
    const curve = createJourneyCurve();
    return Array.from({ length: 36 }, (_, index) => {
      const t = seededRandom(index + 1401);
      const point = curve.getPoint(t);
      const side = index % 2 === 0 ? -1 : 1;
      return {
        x: point.x + side * (9 + seededRandom(index + 1402) * 16),
        z: point.z + (seededRandom(index + 1403) - 0.5) * 10,
        scale: 0.8 + seededRandom(index + 1404) * 0.7,
        rotation: seededRandom(index + 1405) * Math.PI * 2,
      };
    });
  }, []);

  const ores = useMemo(
    () =>
      sectionMountains.flatMap((mountain, mountainIndex) =>
        Array.from({ length: 7 }, (_, oreIndex) => {
          const angle = seededRandom(mountainIndex * 71 + oreIndex) * Math.PI * 2;
          const y = mountain.height * (0.25 + seededRandom(mountainIndex * 73 + oreIndex) * 0.48);
          const radial = mountain.radius * (1 - y / mountain.height) * 0.86;
          return {
            x: mountain.position[0] + Math.cos(angle) * radial,
            y,
            z: mountain.position[2] + Math.sin(angle) * radial,
            rotation: -angle,
            scale: 0.75 + seededRandom(mountainIndex * 79 + oreIndex) * 0.65,
            color: oreColors[(mountainIndex + oreIndex) % oreColors.length],
          };
        }),
      ),
    [],
  );

  useInstancedMatrices(grassBlocks, grassBlockRef, dummy, (block) => {
    dummy.position.set(block.x, 0.04, block.z);
    dummy.rotation.set(0, block.rotation, 0);
    dummy.scale.set(block.scale[0], block.scale[1], block.scale[2]);
  });

  useInstancedMatrices(flowers, flowerRef, dummy, (flower) => {
    dummy.position.set(flower.x, flower.y, flower.z);
    dummy.rotation.set(0, flower.rotation, 0);
    dummy.scale.setScalar(flower.scale);
  });

  useInstancedMatrices(blockTrees, trunkRef, dummy, (tree) => {
    dummy.position.set(tree.x, 0.72 * tree.scale, tree.z);
    dummy.rotation.set(0, tree.rotation, 0);
    dummy.scale.setScalar(tree.scale);
  });

  useInstancedMatrices(blockTrees, leafRef, dummy, (tree) => {
    dummy.position.set(tree.x, 1.78 * tree.scale, tree.z);
    dummy.rotation.set(0, tree.rotation, 0);
    dummy.scale.setScalar(tree.scale);
  });

  useInstancedMatrices(ores, oreRef, dummy, (ore) => {
    dummy.position.set(ore.x, ore.y, ore.z);
    dummy.rotation.set(0.18, ore.rotation, 0);
    dummy.scale.setScalar(ore.scale);
  });

  return (
    <group>
      <instancedMesh ref={grassBlockRef} args={[blockGeometry, grassBlockMaterial, grassBlocks.length]} />
      <instancedMesh ref={flowerRef} args={[flowerGeometry, flowerMaterial, flowers.length]} />
      <instancedMesh ref={trunkRef} args={[trunkGeometry, trunkMaterial, blockTrees.length]} />
      <instancedMesh ref={leafRef} args={[leafGeometry, leafMaterial, blockTrees.length]} />
      <instancedMesh ref={oreRef} args={[oreGeometry, oreMaterial, ores.length]} />
    </group>
  );
});

export default VoxelDetails;
