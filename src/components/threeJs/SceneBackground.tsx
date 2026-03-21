import { useRef } from 'react';
import { useSpring } from '@react-spring/three';
import {  useThree, useFrame } from '@react-three/fiber';
import { Color } from "three";

interface SceneBackgroundProps {
isLight: boolean;
}

function SceneBackground({isLight}: SceneBackgroundProps) {
  const { scene } = useThree();
  const colorRef = useRef<Color>(new Color());

  const spring = useSpring({
    color: isLight ? [1, 0, 0] : [0, 0, 1],
    config: { duration: 5000 }
  });

  useFrame(() => {
    const [r, g, b] = spring.color.get();
    colorRef.current.setRGB(r, g, b);
    scene.background = colorRef.current;
  });

  return null;
}

export default SceneBackground;