import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RiverFoam } from './Particles';
import { createOffsetCurve, seededRandom } from './path';

const River = React.memo(function River({ mode }) {
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
        color: isDay ? '#2196a8' : '#0d3d4a',
        roughness: 0.1,
        metalness: 0.3,
        transparent: true,
        opacity: isDay ? 0.85 : 0.72,
      }),
    [isDay],
  );

  const bankMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#3f7936' : '#112511',
        roughness: 0.96,
        metalness: 0,
        transparent: true,
        opacity: isDay ? 0.8 : 0.72,
      }),
    [isDay],
  );

  const outerBankMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#4a7c3f' : '#1a2d1a',
        roughness: 0.98,
        metalness: 0,
        transparent: true,
        opacity: isDay ? 0.62 : 0.5,
      }),
    [isDay],
  );

  const rockMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#8a8a8a' : '#565c66',
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
    if (!waterMaterial) return;
    const baseOpacity = isDay ? 0.82 : 0.68;
    waterMaterial.opacity = baseOpacity + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
  });

  return (
    <group>
      <mesh geometry={bankGeometryLeft} material={bankMaterial} scale={[1, 0.035, 1]} position={[0, 0.025, 0]} />
      <mesh geometry={bankGeometryRight} material={bankMaterial} scale={[1, 0.035, 1]} position={[0, 0.025, 0]} />
      <mesh geometry={outerBankGeometryLeft} material={outerBankMaterial} scale={[1, 0.026, 1]} position={[0, 0.018, 0]} />
      <mesh geometry={outerBankGeometryRight} material={outerBankMaterial} scale={[1, 0.026, 1]} position={[0, 0.018, 0]} />
      <mesh geometry={riverGeometry} material={waterMaterial} scale={[1, 0.05, 1]} position={[0, 0.04, 0]} />
      <instancedMesh ref={rockRef} args={[rockGeometry, rockMaterial, riverRocks.length]} />
      <RiverFoam curve={riverCurve} />
    </group>
  );
});

export default River;
