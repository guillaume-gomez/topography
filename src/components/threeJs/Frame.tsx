import { useMemo } from "react";
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

  const material = useMemo(() => {
    return new MeshStandardMaterial({map, normalMap, aoMap, displacementMap, displacementScale:0 /*color: "white"*/})
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