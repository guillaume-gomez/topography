import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, Object3D, Mesh } from "three";
import { CameraControls } from '@react-three/drei';

interface CustomCameraControlsProps {
  speed?: number;
  rotationTimerThrottle?: number;
}

export interface ExternalActionInterface {
  recenter: (groupRef: any) => void;
  moveTopDown: () => void;
}


const CustomCameraControls = forwardRef<ExternalActionInterface, CustomCameraControlsProps>(({
  speed = 20,
  rotationTimerThrottle = 2000
}, ref) => {
	const cameraRef = useRef<CameraControls>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [directionRotation, setDirectionRotation] = useState<number>(1);
  
  useFrame(
    (_state, delta) => {
      if(!autoRotate) {
        return;
      }
      if(!cameraRef.current) {
        return;
      }

      const { minAzimuthAngle, maxAzimuthAngle } = cameraRef.current;

      const newAzimuthAngle = cameraRef.current.azimuthAngle + ((speed * delta * MathUtils.DEG2RAD) * directionRotation);
      
      if(newAzimuthAngle > minAzimuthAngle && newAzimuthAngle <  maxAzimuthAngle) {
        cameraRef.current.azimuthAngle = newAzimuthAngle;
      } else {
        setDirectionRotation(-1 * directionRotation)
      }
    }
  );

  useImperativeHandle(ref, () => ({
    async recenter(meshRef: Mesh) {
      setAutoRotate(false);
      
      if(!meshRef || !cameraRef.current) {
        return;
      }

      await cameraRef.current.fitToBox(meshRef, true,
        { paddingLeft: 1, paddingRight: 1, paddingBottom: 1, paddingTop: 1 }
      );

      setTimeout(() => {
        setAutoRotate(true);
      }, rotationTimerThrottle)
    },

    async moveTopDown(_mesh: Mesh) {
      setAutoRotate(false);

      if(!cameraRef.current) {
        return;
      }
      await cameraRef.current.setPosition(0, 350, 0, true);

      setTimeout(() => {
        setAutoRotate(true);
      }, rotationTimerThrottle)
    }

  }));

  return (
    <CameraControls
      makeDefault
      smoothTime={1.0}
      minPolarAngle={0.75}
      maxPolarAngle={Math.PI / 2.5}
      minAzimuthAngle={-Math.PI}
      maxAzimuthAngle={Math.PI}
      minDistance={10}
      maxDistance={400}
      onStart={() => {
        setAutoRotate(false);
      }}
      onEnd={() => {
        setTimeout(() => {
          setAutoRotate(true);
        }, rotationTimerThrottle);
      }}
      ref={cameraRef}
    />);
});

export default CustomCameraControls;