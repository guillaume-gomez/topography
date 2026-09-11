import { animated } from '@react-spring/web';
import { debounce } from "lodash";

interface Props {
  style: CSSProperties;
  value: string;
  onChange: (newColor: string) => void;
}

function ColorCardButton({ style, value, onChange }: Props) {
  const setValueChanged = debounce(onChange, 300);
	return (
    <animated.div
      className="
        w-100 h-100
        rounded-md
        border
        border-black
        hover:border-dashed 
        hover:border-white
        hover:scale-y-102
        hover:duration-300
        hover:ease-in-out
      "
      style={style}
    >
      <input
          //ref={refColorInput}
          id="colorInput"
          //className="hover:cursor-pointer relative"
          className="h-100 hover:cursor-pointer"
          style={{ color: "transparent", width: '100%' }}
          type="color"
          value={value}
          onChange={(e) => setValueChanged(e.target.value)}
        />
    </animated.div>
  )
}

export default ColorCardButton;