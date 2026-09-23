import { useMemo, useContext } from "react";
import { Text } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { MeshStandardMaterial, TextureLoader } from "three";
import { SettingsContext } from "../../context/SettingsContextWrapper";
import useDayNightMaterial from "../../hooks/useDayNightMaterial";

interface FrameProps {
	position: [number, number, number];
  depth: number;
}

export const LeatherTextWidth = 150; 

function LeatherText({position, depth} : FrameProps) {
  const { generationName } = useContext(SettingsContext);

  const [displacementMap, normalMap, aoMap, map] = useLoader(TextureLoader, [
    `textures/brown-leather-unity/brown-leather_height.png`,
    `textures/brown-leather-unity/brown-leather_normal-ogl.png`,
    `textures/brown-leather-unity/brown-leather_ao.png`,
    `textures/brown-leather-unity/brown-leather_albedo.png`,
  ]);

  const material = useDayNightMaterial({ displacementMap, normalMap, aoMap, map });

  return (
      <group position={position}>
        <mesh position={[0, 0, 0]} material={material} >
          <boxGeometry args={[LeatherTextWidth, depth - 15, 1]} />
          {/*<meshStandardMaterial color="red" />*/}
        </mesh>

        <Text
          //font={`${BASE_URL}/fonts/good-bakwan.woff`}
          color={0x000000}
          fontSize={16}
          letterSpacing={0}
          anchorY="center"
          anchorX="center"
          lineHeight={0.8}
          position={[0, 12, 5]}
        >
          {generationName}
        </Text>
      </group>
  );
};

export default LeatherText;