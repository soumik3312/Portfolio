import * as THREE from 'three';

export const pathPoints = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(4, 0, -20),
  new THREE.Vector3(-3, 0, -40),
  new THREE.Vector3(5, 0, -60),
  new THREE.Vector3(-4, 0, -80),
  new THREE.Vector3(3, 0, -100),
  new THREE.Vector3(-5, 0, -120),
  new THREE.Vector3(4, 0, -140),
  new THREE.Vector3(-3, 0, -160),
  new THREE.Vector3(5, 0, -180),
  new THREE.Vector3(-4, 0, -200),
  new THREE.Vector3(3, 0, -220),
  new THREE.Vector3(-5, 0, -240),
  new THREE.Vector3(0, 0, -260),
];

export const createJourneyCurve = () => new THREE.CatmullRomCurve3(pathPoints.map((point) => point.clone()));

export const createOffsetCurve = (offsetX = 0) =>
  new THREE.CatmullRomCurve3(pathPoints.map((point) => new THREE.Vector3(point.x + offsetX, point.y, point.z)));

export const seededRandom = (seed) => {
  const x = Math.sin(seed * 999.97) * 43758.5453123;
  return x - Math.floor(x);
};
