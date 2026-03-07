import { Vector2, Shape } from 'three';
import { useMemo, type ReactElement } from 'react';

interface TopologyShapeProps {
    points: Vector2[];
    color: string;
		position?: [number, number, number];
};

function TopologyShape({ points, color, position }: TopologyShapeProps): ReactElement {
	const shape = useMemo(() => new Shape(points), [points]);
	const extrudeSettings = useMemo(() => ({
		depth: 1,
		bevelEnabled: false,
	}), []);

  return (
    <mesh	position={position}>
      <extrudeGeometry attach="geometry" args={[shape, extrudeSettings]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default TopologyShape;
