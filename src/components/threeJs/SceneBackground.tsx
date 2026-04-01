import { useRef, useContext } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { useThree, useFrame } from '@react-three/fiber';
import { SettingsContext } from "../contexts/SettingsContextWrapper";
import { hex2rgb } from "../../colorUtils";
import { Color } from "three";

const FROM = hex2rgb("#ffcfde");
const TO = hex2rgb("#050505");

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