import React, { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCameraProgress } from '../../hooks/useCameraProgress';
import { createJourneyCurve } from '../world/path';

const CameraController = React.memo(function CameraController() {
  const { camera } = useThree();
  const { progressRef, targetProgressRef, publishProgress, isMobile } = useCameraProgress();
  const curve = useMemo(() => createJourneyCurve(), []);
  const cameraTarget = useMemo(() => new THREE.Vector3(), []);
  const pathPoint = useMemo(() => new THREE.Vector3(), []);
  const lookAtPoint = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    if (isMobile) {
      camera.position.set(0, 2.05, 0);
      camera.lookAt(0.2, 1.9, -8);
      return;
    }

    camera.position.set(0, 1.8, 0);
    camera.lookAt(0.2, 1.8, -8);
  }, [camera, isMobile]);

  useFrame((state, delta) => {
    progressRef.current = THREE.MathUtils.lerp(progressRef.current, targetProgressRef.current, delta * 2.5);
    curve.getPoint(progressRef.current, pathPoint);
    curve.getPoint(Math.min(progressRef.current + (isMobile ? 0.015 : 0.01), 1), lookAtPoint);

    const cameraHeight = isMobile ? 2.05 : 1.8;
    const lookHeight = isMobile ? 1.9 : 1.8;
    state.camera.position.lerp(cameraTarget.set(pathPoint.x, cameraHeight, pathPoint.z), delta * (isMobile ? 4.5 : 4));
    state.camera.lookAt(lookAtPoint.x, lookHeight, lookAtPoint.z);
    publishProgress(progressRef.current);
  });

  return null;
});

export default CameraController;
