import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const boltPositions = [
  [-2.02, 3.95, 0.09],
  [2.02, 3.95, 0.09],
  [-2.02, 1.65, 0.09],
  [2.02, 1.65, 0.09],
];

const Signboard = React.memo(function Signboard({ sectionName, position, rotation = [0, 0, 0] }) {
  const postGeometry = useMemo(() => new THREE.BoxGeometry(0.12, 3.5, 0.12), []);
  const boardGeometry = useMemo(() => new THREE.BoxGeometry(4.5, 2.8, 0.12), []);
  const plankGeometry = useMemo(() => new THREE.BoxGeometry(4.8, 0.25, 0.16), []);
  const boltGeometry = useMemo(() => new THREE.BoxGeometry(0.12, 0.12, 0.04), []);
  const woodMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#5c3d1e',
        roughness: 0.9,
        metalness: 0,
      }),
    [],
  );
  const boardMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c4a882',
        roughness: 0.85,
        metalness: 0,
      }),
    [],
  );
  const boltMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#3d2815',
        roughness: 0.9,
        metalness: 0,
      }),
    [],
  );

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={postGeometry} material={woodMaterial} position={[0, 1.75, 0]} />
      <mesh geometry={boardGeometry} material={boardMaterial} position={[0, 2.8, 0]} />
      <mesh geometry={plankGeometry} material={boardMaterial} position={[0, 4.26, 0]} />
      {boltPositions.map((bolt) => (
        <mesh key={`${bolt[0]}-${bolt[1]}`} geometry={boltGeometry} material={boltMaterial} position={bolt} />
      ))}
      <Text
        position={[0, 2.82, 0.095]}
        fontSize={0.32}
        color="#5c3d1e"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Medium.ttf"
        maxWidth={3.8}
        textAlign="center"
      >
        {sectionName}
      </Text>
    </group>
  );
});

export default Signboard;
