import { useMemo, useContext } from "react";
import { Geometry, Base, Subtraction } from '@react-three/csg'
import { useLoader } from '@react-three/fiber';
import { FontLoader, TextGeometry } from 'three-stdlib';
import { MeshStandardMaterial, TextureLoader } from "three";
import { SettingsContext } from "../../context/SettingsContextWrapper";

const { BASE_URL } = import.meta.env;


const EngravingText = "Seed 68787";
const EngravingSize = 18;
const EngravingDepth = 10;

const BaseWidth = 200;
const BaseHeight = 30;
const BaseDepth = 50;

const engravingMaterial = new MeshStandardMaterial({ color: "black" });

function MarbleBase() {
	 const {
    width,
    height
  } = useContext(SettingsContext);
	const font = useLoader(FontLoader, `${BASE_URL}fonts/helvetiker_regular.typeface.json`);

  // Extruded (solid) text geometry so it can be carved out of the base via CSG Subtraction.
  // The extrusion is made twice as deep as the desired engraving so it pokes all the way
  // through the box's front face, guaranteeing a clean boolean cut.
  const engravingGeometry = useMemo(() => {
    const geometry = new TextGeometry(EngravingText, {
      font,
      size: EngravingSize,
      height: EngravingDepth * 2,
      curveSegments: 12,
      bevelEnabled: false,
    });
    geometry.center();
    return geometry;
  }, [font]);

  const [normalMap, aoMap, map] = useLoader(TextureLoader, [
    `textures/stringy-marble-unity/stringy_marble_Normal-ogl.png`,
    `textures/stringy-marble-unity/stringy_marble_ao.png`,
    `textures/stringy-marble-unity/stringy_marble_albedo.png`,
  ]);

  const material = useMemo(() => {
    return new MeshStandardMaterial({map, normalMap, aoMap /*color: "white"*/})
  }, []);

	
	return (
		<mesh rotation={[-Math.PI/2, 0, 0]}>
      <Geometry useGroups>
        <Base material={material} position={[0, -50, 0]}>
          <boxGeometry args={[width * 1.1, height * 1.5, BaseDepth]} />
        </Base>
        <Subtraction geometry={engravingGeometry} position={[100, -400, BaseDepth / 2]} material={engravingMaterial} />
        <Subtraction geometry={engravingGeometry} position={[100, 200, BaseDepth / 2]} material={engravingMaterial} />
      </Geometry>
    </mesh>
  );

}

export default MarbleBase;
