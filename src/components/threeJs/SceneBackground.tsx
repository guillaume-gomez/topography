import { useRef, useContext } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { useThree, useFrame } from '@react-three/fiber';
import { SettingsContext } from "../../context/SettingsContextWrapper";
import { Stars, Sky } from '@react-three/drei';
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
    intensity: isLight ? 1.5 : 0.5,
    config: { duration: timerSwitch }
  });

  useFrame(() => {
    const [r, g, b] = spring.color.get();
    colorRef.current.setRGB(r, g, b);
    scene.background = colorRef.current;
  });

  return <>
    <animated.ambientLight intensity={spring.intensity} />
    { isLight ? null : <Stars radius={100} depth={100} count={5000} factor={4} saturation={0} fade speed={1} /> }
   </>;
}

export default SceneBackground;