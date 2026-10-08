import { useLoader } from '@react-three/fiber';
import { TextureLoader } from "three";
import useDayNightMaterial from "../../hooks/useDayNightMaterial";
import TextLabel from "./TextLabel";
import MapScale from "./MapScale";

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

  const material = useDayNightMaterial({ normalMap, aoMap, map });

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
		  <MapScale
		  	color="blue"
		  	rotation={[-Math.PI / 2, 0, 0]}
		  	position={[size[0]/2 - 400, size[1]/2 + 1, size[2]/2 - 35]}
		  />
		</group>
	);
}

export default MarbleBase;