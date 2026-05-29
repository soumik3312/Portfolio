import React, { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCameraProgress } from '../../hooks/useCameraProgress';
import { MOBILE_WORLD_X_SCALE, createJourneyCurve } from '../world/path';

const CameraController = React.memo(function CameraController() {
  const { camera } = useThree();
  const { progressRef, targetProgressRef, publishProgress, isMobile } = useCameraProgress();
  const curve = useMemo(() => createJourneyCurve(isMobile ? MOBILE_WORLD_X_SCALE : 1), [isMobile]);
  const cameraTarget = useMemo(() => new THREE.Vector3(), []);
  const pathPoint = useMemo(() => new THREE.Vector3(), []);
  const lookAtPoint = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    if (isMobile) {
      camera.fov = 76;
      camera.updateProjectionMatrix();
      camera.position.set(0, 2.35, 0);
      camera.lookAt(0.2, 1.45, -9);
      return;
    }

    camera.fov = 60;
    camera.updateProjectionMatrix();
    camera.position.set(0, 1.8, 0);
    camera.lookAt(0.2, 1.8, -8);
  }, [camera, isMobile]);

  useFrame((state, delta) => {
    const frameDelta = Math.min(delta, 0.05);
    progressRef.current = THREE.MathUtils.lerp(progressRef.current, targetProgressRef.current, frameDelta * (isMobile ? 4.1 : 2.5));
    curve.getPoint(progressRef.current, pathPoint);
    curve.getPoint(Math.min(progressRef.current + (isMobile ? 0.032 : 0.01), 1), lookAtPoint);

    const cameraHeight = isMobile ? 2.35 : 1.8;
    const lookHeight = isMobile ? 1.45 : 1.8;
    state.camera.position.lerp(cameraTarget.set(pathPoint.x, cameraHeight, pathPoint.z), frameDelta * (isMobile ? 5.2 : 4));
    state.camera.lookAt(lookAtPoint.x, lookHeight, lookAtPoint.z);
    publishProgress(progressRef.current);
  });

  return null;
});

export default CameraController;
