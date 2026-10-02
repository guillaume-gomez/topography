import { animated, useSpring } from '@react-spring/three';
import { useLoader } from '@react-three/fiber';
import useDayNightMaterial from "../../hooks/useDayNightMaterial";
import { TextureLoader } from "three";
import LeatherText, { LeatherTextWidth } from "./LeatherText";

interface FrameProps {
	width: number;
  height: number;
  depth: number;
  position: [number, number, number]
}

const duration = 1000;
const frameDepth = 25;

function Frame({width, height, depth, position } : FrameProps) {

  const [displacementMap, normalMap, aoMap, map] = useLoader(TextureLoader, [
    `textures/dark-wood-stain-unity/dark-wood-stain_height.png`,
    `textures/dark-wood-stain-unity/dark-wood-stain_normal-ogl.png`,
    `textures/dark-wood-stain-unity/dark-wood-stain_ao.png`,
    `textures/dark-wood-stain-unity/dark-wood-stain_albedo.png`,
  ]);

  const [frontFrame,] = useSpring(
  {
    from: { z: 1000 },
    to: { z: frameDepth/2 },
    config: {
      duration
    },
    reset: false,
  }, []);

  const [backFrame,] = useSpring(
  {
    from: { z: -1000 },
    to: { z: -height - frameDepth/2 },
    config: {
      duration
    },
    reset: false,
  }, []);

  const [rightFrame,] = useSpring(
  {
    from: { x: 1000 },
    to: { x: width/2 + frameDepth/2 },
    config: {
      duration
    },
    reset: false,
  }, []);

  const [leftFrame,] = useSpring(
  {
    from: { x: -1000 },
    to: { x: -width/2 - frameDepth/2 },
    config: {
      duration
    },
    reset: false,
  }, []);

  const material = useDayNightMaterial({ displacementMap, normalMap, aoMap, map });

	return (
    <group position={position}>
      {/* Front */}
      <animated.mesh
        position-x={0}
        position-y={30}
        position-z={frontFrame.z}
        material={material}
      >
        <boxGeometry args={[width, depth, frameDepth]} />
        {/*<meshStandardMaterial color="red" />*/}
        <LeatherText position={[175, 0, frameDepth -20]} depth={depth} />
      </animated.mesh>

      {/* Back */}
      <animated.mesh
        position-x={0}
        position-y={30}
        position-z={backFrame.z}
        material={material}
      >
        <boxGeometry args={[width, depth, frameDepth]} />
        {/*<meshStandardMaterial color="red" />*/}
      </animated.mesh>

      {/* Right */}
      <animated.mesh
        position-x={rightFrame.x}
        position-y={30}
        position-z={-height/2}
        rotation={[0, Math.PI/2, 0]}
        material={material}
      >
        <boxGeometry args={[height + 2*frameDepth, depth, frameDepth]} />
        {/*<meshStandardMaterial color="orange" />*/}
      </animated.mesh>

      {/* Left */}
      <animated.mesh
        position-x={leftFrame.x}
        position-y={30}
        position-z={-height/2}
        rotation={[0, Math.PI/2, 0]}
        material={material}
      >
        <boxGeometry args={[height + 2*frameDepth, depth, frameDepth]} />
        {/*<meshStandardMaterial color="purple" />*/}
      </animated.mesh>
      <LeatherText position={[width/2 - LeatherTextWidth/2, 30, frameDepth]} depth={depth} />
    </group>
  );
};

export default Frame;