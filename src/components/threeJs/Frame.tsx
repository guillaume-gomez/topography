import { Text } from '@react-three/drei';

interface FrameProps {
	width: number;
  height: number;
  depth: number;
  position: [number, number, number]
}

function Frame({width, height, depth, position } : FrameProps) {
  const frameDepth = 40;
	return (
    <group position={position}>
      <mesh position={[0, 30, frameDepth/2]} >
        <boxGeometry args={[width, depth, frameDepth]} />
        <meshStandardMaterial color="blue" />
      </mesh>

      <mesh position={[0, 30, -height - frameDepth/2]} >
        <boxGeometry args={[width, depth, frameDepth]} />
        <meshStandardMaterial color="red" />
      </mesh>

      <mesh position={[width/2 + frameDepth/2, 30, -height/2]} rotation={[0, Math.PI/2, 0]} >
        <boxGeometry args={[height + 2*frameDepth, depth, frameDepth]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh position={[-width/2 - frameDepth/2, 30, -height/2]} rotation={[0, Math.PI/2, 0]} >
        <boxGeometry args={[height + 2*frameDepth, depth, frameDepth]} />
        <meshStandardMaterial color="purple" />
      </mesh>

      <group position={[150, 30, 0]}>
        <mesh position={[0, 0, frameDepth]} >
          <boxGeometry args={[200, depth - 15, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>


        <Text
          //font={`${BASE_URL}/fonts/good-bakwan.woff`}
          color={0x000000}
          fontSize={30}
          letterSpacing={0}
          anchorY="center"
          anchorX="center"
          lineHeight={0.8}
          position={[0, 15, frameDepth + 5]}
        >
          Seed 68787
        </Text>
      </group>

    </group>
  );
};

export default Frame;