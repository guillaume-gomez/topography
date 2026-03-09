import { Vector2, Vector3, Shape, CatmullRomCurve3 } from 'three';
import { useMemo, type ReactElement } from 'react';
import { animated } from '@react-spring/three';

interface TopologyShapeProps {
    points: Vector2[];
    color: string;
		position?: [number, number, number];
    thickness?: number;
};

function TopologyShape({ points, color, position, thickness }: TopologyShapeProps): ReactElement {
	const shape = useMemo(() => {
    new Shape(points)
    },
    [points]
  );

	const extrudeSettings = useMemo(() => ({
		depth: thickness,
		bevelEnabled: true,
            bevelThickness: thickness * 0.5,
            bevelSize: thickness * 0.5,
            bevelOffset: 0,
            bevelSegments: 10 // Plus c'est élevé, plus le biseau est rond
	}), []);
  return (
    <animated.mesh
      position-x={position[0]}
      position-y={position[1]}
      position-z={position[2]}
      castShadow
      receiveShadow
    >
      <animated.extrudeGeometry attach="geometry" args={[new Shape(points), extrudeSettings]} />
      <meshStandardMaterial color={color} />
    </animated.mesh>
  );
};

export default TopologyShape;
