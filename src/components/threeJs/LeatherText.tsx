import { useMemo } from "react";
import { Text } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { MeshStandardMaterial, TextureLoader } from "three";

interface FrameProps {
	position: [number, number, number];
  depth: number;
}

function LeatherText({position, depth} : FrameProps) {
  const [displacementMap, normalMap, aoMap, map] = useLoader(TextureLoader, [
    `textures/brown-leather-unity/brown-leather_height.png`,
    `textures/brown-leather-unity/brown-leather_normal-ogl.png`,
    `textures/brown-leather-unity/brown-leather_ao.png`,
    `textures/brown-leather-unity/brown-leather_albedo.png`,
  ]);

  const material = useMemo(() => {
    return new MeshStandardMaterial({map, normalMap, aoMap, displacementMap, displacementScale:0 /*color: "white"*/})
  }, []);

  return (
      <group position={position}>
        <mesh position={[0, 0, 0]} material={material} >
          <boxGeometry args={[200, depth - 15, 1]} />
          {/*<meshStandardMaterial color="red" />*/}
        </mesh>

        <Text
          //font={`${BASE_URL}/fonts/good-bakwan.woff`}
          color={0x000000}
          fontSize={30}
          letterSpacing={0}
          anchorY="middle"
          anchorX="center"
          lineHeight={0.8}
          position={[0, 15, 5]}
        >
          Seed 68787
        </Text>
      </group>
  );
};

export default LeatherText;