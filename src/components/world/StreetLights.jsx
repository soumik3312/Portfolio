import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createJourneyCurve } from './path';

const lightStops = [0.04, 0.1, 0.16, 0.22, 0.28, 0.34, 0.4, 0.46, 0.52, 0.58, 0.64, 0.7, 0.76, 0.82, 0.88, 0.94];

const StreetLights = React.memo(function StreetLights({ mode }) {
  const isNight = mode === 'night';
  const curve = useMemo(() => createJourneyCurve(), []);
  const postGeometry = useMemo(() => new THREE.BoxGeometry(0.13, 3.2, 0.13), []);
  const baseGeometry = useMemo(() => new THREE.BoxGeometry(0.52, 0.16, 0.52), []);
  const armGeometry = useMemo(() => new THREE.BoxGeometry(0.9, 0.12, 0.12), []);
  const headGeometry = useMemo(() => new THREE.BoxGeometry(0.48, 0.34, 0.48), []);
  const bulbGeometry = useMemo(() => new THREE.BoxGeometry(0.24, 0.16, 0.24), []);
  const beamGeometry = useMemo(() => new THREE.ConeGeometry(1.25, 2.7, 8, 1, true), []);
  const glowGeometry = useMemo(() => new THREE.CircleGeometry(2.6, 18), []);

  const metalMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#253238',
        roughness: 0.68,
        metalness: 0.24,
      }),
    [],
  );

  const headMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#172229',
        roughness: 0.55,
        metalness: 0.18,
      }),
    [],
  );

  const bulbMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isNight ? '#fff0a5' : '#d8cfa8',
        emissive: '#ffd76a',
        emissiveIntensity: isNight ? 1.8 : 0.05,
        roughness: 0.35,
        metalness: 0,
      }),
    [isNight],
  );

  const beamMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffe27a',
        transparent: true,
        opacity: isNight ? 0.22 : 0,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [isNight],
  );

  const roadGlowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffe58a',
        transparent: true,
        opacity: isNight ? 0.2 : 0,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [isNight],
  );

  const lights = useMemo(() => {
    const point = new THREE.Vector3();
    const tangent = new THREE.Vector3();

    return lightStops.flatMap((t, stopIndex) => {
      curve.getPoint(t, point);
      curve.getTangent(t, tangent);
      const normal = new THREE.Vector3(tangent.z, 0, -tangent.x).normalize();

      return [-1, 1].map((side) => {
        const pole = point.clone().add(normal.clone().multiplyScalar(side * 2.45));
        const inward = normal.clone().multiplyScalar(-side);
        const yaw = Math.atan2(-inward.z, inward.x);
        const slightStagger = stopIndex % 2 === 0 ? 0 : 0.25;

        return {
          key: `${stopIndex}-${side}`,
          position: [pole.x, 0, pole.z + slightStagger],
          yaw,
          lampOffset: [inward.x * 0.55, 3.05, inward.z * 0.55],
          beamOffset: [inward.x * 0.72, 1.62, inward.z * 0.72],
          glowOffset: [inward.x * 0.9, 0.035, inward.z * 0.9],
        };
      });
    });
  }, [curve]);

  return (
    <group>
      {lights.map((lamp) => (
        <group key={lamp.key} position={lamp.position}>
          <mesh geometry={baseGeometry} material={metalMaterial} position={[0, 0.08, 0]} />
          <mesh geometry={postGeometry} material={metalMaterial} position={[0, 1.62, 0]} />
          <mesh geometry={armGeometry} material={metalMaterial} position={lamp.lampOffset} rotation={[0, lamp.yaw, 0]} />
          <mesh geometry={headGeometry} material={headMaterial} position={[lamp.lampOffset[0] * 1.75, 3.0, lamp.lampOffset[2] * 1.75]} rotation={[0, lamp.yaw, 0]} />
          <mesh geometry={bulbGeometry} material={bulbMaterial} position={[lamp.lampOffset[0] * 1.75, 2.76, lamp.lampOffset[2] * 1.75]} />
          <mesh geometry={beamGeometry} material={beamMaterial} position={lamp.beamOffset} rotation={[Math.PI, 0, 0]} />
          <mesh geometry={glowGeometry} material={roadGlowMaterial} position={lamp.glowOffset} rotation={[-Math.PI / 2, 0, 0]} />
          <pointLight
            color="#ffd76a"
            intensity={isNight ? 2.4 : 0}
            distance={10}
            decay={1.7}
            position={[lamp.lampOffset[0] * 1.75, 2.65, lamp.lampOffset[2] * 1.75]}
          />
        </group>
      ))}
    </group>
  );
});

export default StreetLights;
