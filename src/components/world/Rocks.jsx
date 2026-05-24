import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { createJourneyCurve, seededRandom } from './path';

const Rocks = React.memo(function Rocks({ mode }) {
  const count = 40;
  const rockRef = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const isDay = mode === 'day';
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(0.4, 0), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDay ? '#7a7a8a' : '#424957',
        roughness: 0.9,
        metalness: 0,
      }),
    [isDay],
  );

  const rocks = useMemo(() => {
    const curve = createJourneyCurve();
    return Array.from({ length: count }, (_, index) => {
      const t = seededRandom(index + 601);
      const point = curve.getPoint(t);
      const side = index % 2 === 0 ? -1 : 1;
      const offset = 2.8 + seededRandom(index + 602) * 13;
      return {
        x: point.x + side * offset,
        z: point.z + (seededRandom(index + 603) - 0.5) * 7,
        scale: 0.3 + seededRandom(index + 604) * 0.9,
        rotation: [
          seededRandom(index + 605) * Math.PI,
          seededRandom(index + 606) * Math.PI * 2,
          seededRandom(index + 607) * Math.PI,
        ],
      };
    });
  }, []);

  useEffect(() => {
    if (!rockRef.current) return;
    rocks.forEach((rock, index) => {
      dummy.position.set(rock.x, 0.18 * rock.scale, rock.z);
      dummy.rotation.set(rock.rotation[0], rock.rotation[1], rock.rotation[2]);
      dummy.scale.set(rock.scale * 1.35, rock.scale * 0.8, rock.scale);
      dummy.updateMatrix();
      rockRef.current.setMatrixAt(index, dummy.matrix);
    });
    rockRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy, rocks]);

  return <instancedMesh ref={rockRef} args={[geometry, material, count]} />;
});

export default Rocks;
