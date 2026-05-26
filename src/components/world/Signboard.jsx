import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const boltPositions = [
  [-2.28, 3.98, 0.13],
  [2.28, 3.98, 0.13],
  [-2.28, 1.7, 0.13],
  [2.28, 1.7, 0.13],
];

const plankRows = [-0.78, -0.26, 0.26, 0.78];

const Signboard = React.memo(function Signboard({ sectionName, position, rotation = [0, 0, 0], mode = 'day' }) {
  const isNight = mode === 'night';
  const postGeometry = useMemo(() => new THREE.BoxGeometry(0.18, 3.8, 0.18), []);
  const boardGeometry = useMemo(() => new THREE.BoxGeometry(5.1, 2.6, 0.18), []);
  const plankGeometry = useMemo(() => new THREE.BoxGeometry(5.35, 0.18, 0.24), []);
  const trimGeometry = useMemo(() => new THREE.BoxGeometry(5.5, 0.18, 0.28), []);
  const sideTrimGeometry = useMemo(() => new THREE.BoxGeometry(0.18, 2.7, 0.28), []);
  const roofGeometry = useMemo(() => new THREE.BoxGeometry(5.8, 0.34, 0.5), []);
  const chainGeometry = useMemo(() => new THREE.BoxGeometry(0.07, 0.62, 0.07), []);
  const boltGeometry = useMemo(() => new THREE.BoxGeometry(0.14, 0.14, 0.06), []);
  const lanternGeometry = useMemo(() => new THREE.BoxGeometry(0.26, 0.32, 0.2), []);
  const grassGeometry = useMemo(() => new THREE.BoxGeometry(0.18, 0.42, 0.12), []);
  const woodMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isNight ? '#2b1b10' : '#5c3d1e',
        roughness: 0.9,
        metalness: 0,
      }),
    [isNight],
  );
  const boardMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isNight ? '#8b683e' : '#c99a58',
        roughness: 0.85,
        metalness: 0,
      }),
    [isNight],
  );
  const trimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isNight ? '#1d1109' : '#3b220f',
        roughness: 0.88,
        metalness: 0,
      }),
    [isNight],
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
  const lanternMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isNight ? '#ffe28a' : '#d8b66a',
        emissive: '#ffd45f',
        emissiveIntensity: isNight ? 1.1 : 0.05,
        roughness: 0.4,
        metalness: 0,
      }),
    [isNight],
  );
  const grassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isNight ? '#0b2710' : '#2e6d22',
        roughness: 0.98,
        metalness: 0,
      }),
    [isNight],
  );

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={postGeometry} material={woodMaterial} position={[-2.22, 1.9, -0.06]} />
      <mesh geometry={postGeometry} material={woodMaterial} position={[2.22, 1.9, -0.06]} />
      <mesh geometry={boardGeometry} material={boardMaterial} position={[0, 2.82, 0]} />
      {plankRows.map((row, index) => (
        <mesh key={row} geometry={plankGeometry} material={index % 2 === 0 ? boardMaterial : woodMaterial} position={[0, 2.82 + row, 0.035]} />
      ))}
      <mesh geometry={trimGeometry} material={trimMaterial} position={[0, 4.23, 0.08]} />
      <mesh geometry={trimGeometry} material={trimMaterial} position={[0, 1.41, 0.08]} />
      <mesh geometry={sideTrimGeometry} material={trimMaterial} position={[-2.68, 2.82, 0.08]} />
      <mesh geometry={sideTrimGeometry} material={trimMaterial} position={[2.68, 2.82, 0.08]} />
      <mesh geometry={roofGeometry} material={trimMaterial} position={[0, 4.58, 0.02]} rotation={[0, 0, 0.03]} />
      <mesh geometry={chainGeometry} material={boltMaterial} position={[-1.95, 4.42, 0.15]} rotation={[0, 0, -0.25]} />
      <mesh geometry={chainGeometry} material={boltMaterial} position={[1.95, 4.42, 0.15]} rotation={[0, 0, 0.25]} />
      <mesh geometry={lanternGeometry} material={lanternMaterial} position={[-2.9, 3.75, 0.18]} />
      <mesh geometry={lanternGeometry} material={lanternMaterial} position={[2.9, 3.75, 0.18]} />
      {[-2.9, -2.64, 2.64, 2.9].map((x, index) => (
        <mesh key={`grass-${x}`} geometry={grassGeometry} material={grassMaterial} position={[x, 0.22, 0.12 + index * 0.02]} rotation={[0, index * 0.4, 0]} />
      ))}
      {boltPositions.map((bolt) => (
        <mesh key={`${bolt[0]}-${bolt[1]}`} geometry={boltGeometry} material={boltMaterial} position={bolt} />
      ))}
      <Text
        position={[0, 3.16, 0.16]}
        fontSize={0.34}
        color={isNight ? '#fff1bc' : '#2c1a0e'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Medium.ttf"
        maxWidth={4.15}
        textAlign="center"
      >
        {sectionName}
      </Text>
      <Text
        position={[0, 2.38, 0.16]}
        fontSize={0.13}
        color={isNight ? '#ffd970' : '#5c3a20'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Medium.ttf"
        maxWidth={4.2}
        textAlign="center"
      >
        TRAIL MARKER
      </Text>
      <Text
        position={[0, 1.95, 0.16]}
        fontSize={0.1}
        color={isNight ? '#e8c16a' : '#6b3a1f'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Medium.ttf"
        maxWidth={4.2}
        textAlign="center"
      >
        ◆ ◆ ◆
      </Text>
    </group>
  );
});

export default Signboard;
