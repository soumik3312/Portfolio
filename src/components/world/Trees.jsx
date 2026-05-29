import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { createJourneyCurve, seededRandom } from './path';

const mountainAnchors = [
  [-8, 5],
  [10, -38],
  [-10, -78],
  [10, -118],
  [-10, -158],
  [9, -198],
  [-9, -238],
  [0, -258],
];

const Trees = React.memo(function Trees({ mode, isMobile = false }) {
  const count = 120;
  const trunkRef = useRef(null);
  const foliageRef = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const isDay = mode === 'day';

  const trunkGeometry = useMemo(() => new THREE.CylinderGeometry(0.08, 0.12, 1.2, 5), []);
  const foliageGeometry = useMemo(() => {
    const bottom = new THREE.ConeGeometry(1.2, 2.0, 6);
    const middle = new THREE.ConeGeometry(0.9, 1.8, 6);
    const top = new THREE.ConeGeometry(0.6, 1.5, 6);
    bottom.translate(0, 1.8, 0);
    middle.translate(0, 2.6, 0);
    top.translate(0, 3.3, 0);
    return mergeGeometries([bottom, middle, top], false);
  }, []);

  const trunkMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#5c3d1e' : '#4a3320',
        roughness: 0.95,
        metalness: 0,
      }),
    [isDay],
  );

  const foliageMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#2d5a1b' : '#24532b',
        roughness: 0.92,
        metalness: 0,
      }),
    [isDay],
  );

  const trees = useMemo(() => {
    const curve = createJourneyCurve();
    return Array.from({ length: count }, (_, index) => {
      if (index < 84) {
        const t = seededRandom(index + 501);
        const point = curve.getPoint(t);
        const side = index % 2 === 0 ? -1 : 1;
        const offset = 6 + seededRandom(index + 502) * 18;
        return {
          x: point.x + side * offset,
          z: point.z + (seededRandom(index + 503) - 0.5) * 8,
          scale: 0.7 + seededRandom(index + 504) * 0.7,
          rotation: seededRandom(index + 505) * Math.PI * 2,
        };
      }

      const anchor = mountainAnchors[index % mountainAnchors.length];
      const angle = seededRandom(index + 506) * Math.PI * 2;
      const radius = 4 + seededRandom(index + 507) * 7;
      return {
        x: anchor[0] + Math.cos(angle) * radius,
        z: anchor[1] + Math.sin(angle) * radius,
        scale: 0.8 + seededRandom(index + 508) * 0.6,
        rotation: seededRandom(index + 509) * Math.PI * 2,
      };
    });
  }, []);

  useEffect(() => {
    if (!trunkRef.current || !foliageRef.current) return;
    trees.forEach((tree, index) => {
      dummy.position.set(tree.x, 0.6 * tree.scale, tree.z);
      dummy.rotation.set(0, tree.rotation, 0);
      dummy.scale.setScalar(tree.scale);
      dummy.updateMatrix();
      trunkRef.current.setMatrixAt(index, dummy.matrix);

      dummy.position.set(tree.x, 0, tree.z);
      dummy.rotation.set(0, tree.rotation, 0);
      dummy.scale.setScalar(tree.scale);
      dummy.updateMatrix();
      foliageRef.current.setMatrixAt(index, dummy.matrix);
    });
    trunkRef.current.instanceMatrix.needsUpdate = true;
    foliageRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy, trees]);

  useFrame((state) => {
    if (isMobile) return;
    if (!foliageRef.current) return;
    const time = state.clock.elapsedTime;

    trees.forEach((tree, index) => {
      dummy.position.set(tree.x, 0, tree.z);
      dummy.rotation.set(
        Math.sin(time * 0.6 + index * 0.3) * 0.01,
        tree.rotation,
        Math.sin(time * 0.8 + index * 0.5) * 0.02,
      );
      dummy.scale.setScalar(tree.scale);
      dummy.updateMatrix();
      foliageRef.current.setMatrixAt(index, dummy.matrix);
    });

    foliageRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={trunkRef} args={[trunkGeometry, trunkMaterial, count]} />
      <instancedMesh ref={foliageRef} args={[foliageGeometry, foliageMaterial, count]} />
    </group>
  );
});

export default Trees;
