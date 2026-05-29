import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RiverFoam } from './Particles';
import { createOffsetCurve, seededRandom } from './path';

const RiverSparkles = React.memo(function RiverSparkles({ curve, mode, isMobile = false }) {
  const count = 44;
  const isDay = mode === 'day';
  const progress = useRef(Array.from({ length: count }, (_, index) => seededRandom(index + 1001)));
  const tempPoint = useMemo(() => new THREE.Vector3(), []);
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const point = curve.getPoint(seededRandom(index + 1001));
      positions[index * 3] = point.x + (seededRandom(index + 1002) - 0.5) * 1.7;
      positions[index * 3 + 1] = 0.18;
      positions[index * 3 + 2] = point.z + (seededRandom(index + 1003) - 0.5) * 1.1;
    }

    const sparkleGeometry = new THREE.BufferGeometry();
    sparkleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return sparkleGeometry;
  }, [curve]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: '#d8fff4',
        size: 0.09,
        transparent: true,
        opacity: isDay ? 0.68 : 0.28,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [isDay],
  );

  useFrame((state, delta) => {
    if (isMobile) return;
    const position = geometry.attributes.position;
    const time = state.clock.elapsedTime;

    for (let index = 0; index < count; index += 1) {
      progress.current[index] += delta * (0.008 + seededRandom(index + 1004) * 0.012);
      if (progress.current[index] > 1) progress.current[index] = 0;
      curve.getPoint(progress.current[index], tempPoint);
      position.setXYZ(
        index,
        tempPoint.x + (seededRandom(index + 1002) - 0.5) * 1.7,
        0.18 + Math.sin(time * 2.1 + index) * 0.035,
        tempPoint.z + (seededRandom(index + 1003) - 0.5) * 1.1,
      );
    }

    material.opacity = (isDay ? 0.58 : 0.24) + Math.sin(time * 2.4) * 0.1;
    position.needsUpdate = true;
  });

  return <points geometry={geometry} material={material} />;
});

const River = React.memo(function River({ mode, isMobile = false }) {
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const rockRef = useRef(null);
  const isDay = mode === 'day';
  const riverCurve = useMemo(() => createOffsetCurve(3), []);
  const leftBankCurve = useMemo(() => createOffsetCurve(1.62), []);
  const rightBankCurve = useMemo(() => createOffsetCurve(4.38), []);
  const leftOuterBankCurve = useMemo(() => createOffsetCurve(1.15), []);
  const rightOuterBankCurve = useMemo(() => createOffsetCurve(4.85), []);
  const riverGeometry = useMemo(() => new THREE.TubeGeometry(riverCurve, 72, 1.12, 8, false), [riverCurve]);
  const bankGeometryLeft = useMemo(() => new THREE.TubeGeometry(leftBankCurve, 72, 0.52, 8, false), [leftBankCurve]);
  const bankGeometryRight = useMemo(() => new THREE.TubeGeometry(rightBankCurve, 72, 0.52, 8, false), [rightBankCurve]);
  const outerBankGeometryLeft = useMemo(() => new THREE.TubeGeometry(leftOuterBankCurve, 72, 0.62, 8, false), [leftOuterBankCurve]);
  const outerBankGeometryRight = useMemo(() => new THREE.TubeGeometry(rightOuterBankCurve, 72, 0.62, 8, false), [rightOuterBankCurve]);
  const rockGeometry = useMemo(() => new THREE.SphereGeometry(0.2, 5, 4), []);

  const waterMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#2196a8' : '#2f7d91',
        emissive: isDay ? '#0a4350' : '#1a6072',
        emissiveIntensity: isDay ? 0.05 : 0.18,
        roughness: 0.1,
        metalness: 0.3,
        transparent: true,
        opacity: isDay ? 0.85 : 0.82,
      }),
    [isDay],
  );

  const bankMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#3f7936' : '#315436',
        roughness: 0.96,
        metalness: 0,
        transparent: true,
        opacity: isDay ? 0.8 : 0.78,
      }),
    [isDay],
  );

  const outerBankMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#4a7c3f' : '#3b6040',
        roughness: 0.98,
        metalness: 0,
        transparent: true,
        opacity: isDay ? 0.62 : 0.62,
      }),
    [isDay],
  );

  const rockMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#8a8a8a' : '#858c94',
        roughness: 0.9,
        metalness: 0,
      }),
    [isDay],
  );

  const riverRocks = useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => {
        const t = seededRandom(index + 11);
        const point = riverCurve.getPoint(t);
        const edge = index % 2 === 0 ? -1.4 : 1.4;
        return {
          x: point.x + edge + (seededRandom(index + 12) - 0.5) * 0.5,
          z: point.z + (seededRandom(index + 13) - 0.5) * 2,
          scale: 0.65 + seededRandom(index + 14) * 1.5,
          rotation: seededRandom(index + 15) * Math.PI * 2,
        };
      }),
    [riverCurve],
  );

  useEffect(() => {
    if (!rockRef.current) return;
    riverRocks.forEach((rock, index) => {
      dummy.position.set(rock.x, 0.1, rock.z);
      dummy.rotation.set(rock.rotation * 0.4, rock.rotation, rock.rotation * 0.2);
      dummy.scale.set(rock.scale * 1.4, rock.scale * 0.55, rock.scale);
      dummy.updateMatrix();
      rockRef.current.setMatrixAt(index, dummy.matrix);
    });
    rockRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy, riverRocks]);

  useFrame((state) => {
    if (isMobile) return;
    if (!waterMaterial) return;
    const time = state.clock.elapsedTime;
    const baseOpacity = isDay ? 0.82 : 0.78;
    waterMaterial.opacity = baseOpacity + Math.sin(time * 0.5) * 0.05;
    waterMaterial.emissive.setHSL(0.55, 0.8, (isDay ? 0.05 : 0.16) + Math.sin(time * 2) * 0.025);
    waterMaterial.color.setHSL(0.52 + Math.sin(time * 0.5) * 0.02, 0.7, isDay ? 0.45 : 0.38);
  });

  return (
    <group>
      <mesh geometry={bankGeometryLeft} material={bankMaterial} scale={[1, 0.035, 1]} position={[0, 0.025, 0]} />
      <mesh geometry={bankGeometryRight} material={bankMaterial} scale={[1, 0.035, 1]} position={[0, 0.025, 0]} />
      <mesh geometry={outerBankGeometryLeft} material={outerBankMaterial} scale={[1, 0.026, 1]} position={[0, 0.018, 0]} />
      <mesh geometry={outerBankGeometryRight} material={outerBankMaterial} scale={[1, 0.026, 1]} position={[0, 0.018, 0]} />
      <mesh geometry={riverGeometry} material={waterMaterial} scale={[1, 0.05, 1]} position={[0, 0.04, 0]} />
      <instancedMesh ref={rockRef} args={[rockGeometry, rockMaterial, riverRocks.length]} />
      <RiverFoam curve={riverCurve} isMobile={isMobile} />
      <RiverSparkles curve={riverCurve} mode={mode} isMobile={isMobile} />
    </group>
  );
});

export default River;
