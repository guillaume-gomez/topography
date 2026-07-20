import { Vector2, Shape, Color, RepeatWrapping } from 'three';
import { useMemo, type ReactElement } from 'react';
import { useLoader } from '@react-three/fiber';
import { animated, SpringValue } from '@react-spring/three';
import { TextureLoader } from "three";
//import WavyPhysicalMaterial from './Material/WavyPhysicalMaterial';

// world units covered by a single texture tile, so the grain repeats instead of stretching/clamping
const TileSize = 40;


interface TopologyShapeProps {
    points: Vector2[];
    color: Color;
		position: [number, number, number];
    thickness?: number;
    opacity?: SpringValue<number> | number;
    optimized?: boolean;
};


function TopologyShape({ points, color, position, thickness = 1, opacity = new SpringValue(1), optimized = true  }: TopologyShapeProps): ReactElement {
	 const [displacementMap, roughnessMap, normalMap, aoMap, map] = useLoader(TextureLoader, [
    `textures/cardboard/paper_0021_height_1k.png`,
    `textures/cardboard/paper_0021_roughness_1k.jpg`,
    `textures/cardboard/paper_0021_normal_opengl_1k.png`,
    `textures/cardboard/paper_0021_ao_1k.jpg`,
    `textures/cardboard/paper_0021_color_1k.jpg`,
  ]);

  useMemo(() => {
    // ExtrudeGeometry's default UV generator uses raw object-space x/y as UVs (not normalized to 0-1),
    // so without RepeatWrapping the texture just clamps to its edge pixel across most of the shape.
    [map, aoMap, displacementMap, normalMap, roughnessMap].forEach((texture) => {
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;
      texture.repeat.set(1 / TileSize, 1 / TileSize);
    });
  }, [map, aoMap, displacementMap, normalMap, roughnessMap]);

  const shape = useMemo(() => {
    return new Shape(points);
  },
  [points]
  );

	const extrudeSettings = useMemo(() => ({
		depth: thickness,
		bevelEnabled: true,
    bevelThickness: thickness * 0.5,
    bevelSize: thickness * 0.5,
    bevelOffset: 0,
    bevelSegments: 10
	}), []);

  return (
    <animated.mesh
      position-x={position[0]}
      position-y={position[1]}
      position-z={position[2]}
      castShadow
      receiveShadow
      visible={opacity.to((v: number) => v > 0.001)}

    >
      <extrudeGeometry attach="geometry" args={[shape, extrudeSettings]} />
      {/*<WavyPhysicalMaterial
        color={color}
        emissive={"black"}
        roughness={1.}
        metalness={0.1}
        amplitude={4}
        frequency={10}
      />*/}
      {optimized ?
        <animated.meshLambertMaterial
          wireframe={false}
          color={color}
          emissive={"black"}
          opacity={opacity}
          map={map}
          //map={roughnessMap}
          aoMap={aoMap}
          displacementMap={displacementMap}
          displacementScale={0}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          transparent={true}
        />
        :
        <animated.meshPhysicalMaterial
          wireframe={false}
          opacity={opacity}
          transparent={true}
          color={color}
          emissive={"black"}
          roughness={1.0}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          map={map}
          //map={roughnessMap}
          aoMap={aoMap}
          displacementMap={displacementMap}
          displacementScale={0}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
        />
      }
      {/*<meshNormalMaterial/>*/}
    </animated.mesh>
  );
};

export default TopologyShape;
