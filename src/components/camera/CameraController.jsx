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
      camera.position.set(0, 2.6, 10);
      camera.lookAt(0, 2, -14);
      return;
    }

    camera.position.set(0, 1.8, 0);
    camera.lookAt(0.2, 1.8, -8);
  }, [camera, isMobile]);

  useFrame((state, delta) => {
    if (isMobile) {
      state.camera.position.lerp(cameraTarget.set(0, 2.6, 10), delta * 2);
      state.camera.lookAt(0, 2, -14);
      publishProgress(0);
      return;
    }

    progressRef.current = THREE.MathUtils.lerp(progressRef.current, targetProgressRef.current, delta * 2.5);
    curve.getPoint(progressRef.current, pathPoint);
    curve.getPoint(Math.min(progressRef.current + 0.01, 1), lookAtPoint);
    state.camera.position.lerp(cameraTarget.set(pathPoint.x, 1.8, pathPoint.z), delta * 4);
    state.camera.lookAt(lookAtPoint.x, 1.8, lookAtPoint.z);
    publishProgress(progressRef.current);
  });

  return null;
});

export default CameraController;
