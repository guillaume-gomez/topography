import { animated } from '@react-spring/web';
import type { ComponentProps } from 'react';

interface Props {
  style: ComponentProps<typeof animated.div>['style'];
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