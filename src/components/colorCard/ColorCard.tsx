import { animated } from '@react-spring/web';

interface Props {
  style: CSSProperties;
}

function ColorCard({ style }: Props) {
	return (
    <animated.div
      className="
      w-100
      h-100
      rounded-md
      border
      border-black
      "
      style={style}
    >
    </animated.div>
  )
}

export default ColorCard;