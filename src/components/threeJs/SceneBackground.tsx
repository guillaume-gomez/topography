import { useRef, useContext } from 'react';
import { useSpring, animated } from '@react-spring/three';
import {  useThree, useFrame } from '@react-three/fiber';
import { SettingsContext } from "../SettingsContextWrapper";
import { Color } from "three";

function hex2rgb(hex: string) : [number, number, number]  {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
    
  return [r/255, g/255, b/255 ];
}

const FROM = hex2rgb("#83FF73");
const TO = hex2rgb("#FF4A59");

function SceneBackground() {
  const { scene } = useThree();
  const colorRef = useRef<Color>(new Color());
  const {
    isLight,
    timerSwitch,
  } = useContext(SettingsContext);

  const spring = useSpring({
    color: isLight ? FROM : TO,
    config: { duration: timerSwitch }
  });

  useFrame(() => {
    const [r, g, b] = spring.color.get();
    colorRef.current.setRGB(r, g, b);
    scene.background = colorRef.current;
  });

  return null;
}

export default SceneBackground;