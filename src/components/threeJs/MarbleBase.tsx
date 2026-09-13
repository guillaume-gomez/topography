import { useMemo, useContext } from "react";
import { Geometry, Base, Subtraction } from '@react-three/csg'
import { useLoader } from '@react-three/fiber';
import { FontLoader, TextGeometry } from 'three-stdlib';
import { MeshStandardMaterial, TextureLoader } from "three";
import { Center } from '@react-three/drei';
import TextLabel from "./TextLabel";

interface Props {
  position: [number, number, number];
  size: [number, number, number];
  text: string;
}

function MarbleBase({position , size, text} : Props) {
	const [normalMap, aoMap, map] = useLoader(TextureLoader, [
    `textures/stringy-marble-unity/stringy_marble_Normal-ogl.png`,
    `textures/stringy-marble-unity/stringy_marble_ao.png`,
    `textures/stringy-marble-unity/stringy_marble_albedo.png`,
  ]);
  const material = useMemo(() => {
    return new MeshStandardMaterial({map, normalMap, aoMap /*color: "white"*/})
  }, []);

	return (
		<group position={position}>
		  <mesh material={material}>
				<boxGeometry args={size} />	
			</mesh>
		  <TextLabel
			text={text}
		    width={200}
			height={200}
			fontSize={48}
		    color="#000000"
		    anchor="bottom-right"
		    rotation={[-Math.PI / 2, 0, 0]}
		    position={[size[0]/2 - 20, size[1]/2 + 1, size[2]/2 + 70]}
		  />
		</group>
	);
}

export default MarbleBase;