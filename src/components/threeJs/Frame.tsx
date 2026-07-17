import { useMemo } from "react";
import { Text } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { MeshStandardMaterial, TextureLoader } from "three";
import LeatherText from "./LeatherText";

interface FrameProps {
	width: number;
  height: number;
  depth: number;
  position: [number, number, number]
}

function Frame({width, height, depth, position } : FrameProps) {
  const [displacementMap, normalMap, aoMap, map] = useLoader(TextureLoader, [
    `textures/dark-wood-stain-unity/dark-wood-stain_height.png`,
    `textures/dark-wood-stain-unity/dark-wood-stain_normal-ogl.png`,
    `textures/dark-wood-stain-unity/dark-wood-stain_ao.png`,
    `textures/dark-wood-stain-unity/dark-wood-stain_albedo.png`,
  ]);

  const [displacementMap2, normalMap2, aoMap2, map2] = useLoader(TextureLoader, [
    `textures/brown-leather-unity/brown-leather_height.png`,
    `textures/brown-leather-unity/brown-leather_normal-ogl.png`,
    `textures/brown-leather-unity/brown-leather_ao.png`,
    `textures/brown-leather-unity/brown-leather_albedo.png`,
  ]);

  const material = useMemo(() => {
    return new MeshStandardMaterial({map, normalMap, aoMap, displacementMap, displacementScale:0 /*color: "white"*/})
  }, []);

  const material2 = useMemo(() => {
    return new MeshStandardMaterial({map:map2, normalMap: normalMap2, aoMap: aoMap2, displacementMap: displacementMap2, displacementScale:0 /*color: "white"*/})
  }, []);

  const frameDepth = 40;
	return (
    <group position={position}>
      <mesh
        position={[0, 30, frameDepth/2]}
        material={material}
      >
        <boxGeometry args={[width, depth, frameDepth]} />
        {/*<meshStandardMaterial color="blue" />*/}
      </mesh>

      <mesh
        position={[0, 30, -height - frameDepth/2]}
        material={material}
      >
        <boxGeometry args={[width, depth, frameDepth]} />
        {/*<meshStandardMaterial color="red" />*/}
      </mesh>

      <mesh
        position={[width/2 + frameDepth/2, 30, -height/2]}
        rotation={[0, Math.PI/2, 0]}
        material={material}
      >
        <boxGeometry args={[height + 2*frameDepth, depth, frameDepth]} />
        {/*<meshStandardMaterial color="orange" />*/}
      </mesh>

      <mesh
        position={[-width/2 - frameDepth/2, 30, -height/2]}
        rotation={[0, Math.PI/2, 0]}
        material={material}
      >
        <boxGeometry args={[height + 2*frameDepth, depth, frameDepth]} />
        {/*<meshStandardMaterial color="purple" />*/}
      </mesh>

      <LeatherText position={[150, 30, frameDepth]} depth={depth} />
      
    </group>
  );
};

export default Frame;