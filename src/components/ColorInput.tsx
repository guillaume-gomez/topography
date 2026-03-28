import { useRef } from 'react';
import { debounce } from "lodash";
import { useSpring, animated } from '@react-spring/web';
import "./ColorInput.css";


interface ColorInputProps {
  value: string;
  label: string;
  onChange: (newValue: string) => void;
}

function ColorInput({ label, value, onChange } : ColorInputProps ) {
  const setValueChanged = debounce(onChange, 300);
  const refColorInput = useRef<HTMLInputElement>(null);

  const springsIcon = useSpring( 
    {
      from : { d: "M 215 100.3 c 97.8 -32.6 90.5 -71.9 336 -77.6 c 92.4 -2.1 98.1 81.6 121.8 116.4 c 40.2 157.9 5.2 88.9 14.7 178 c -28.5 67.9 5.4 269 -257 115.1 c -57 -33.5 -203 46.3 -263.7 20.1 c -33.5 -14.5 -132.5 -45.5 -95 -111.1 C 125.9 246.6 98.6 139.1 215 100.3 z" },
      to: [
        { d: "M 215 100.3 c 173 -18.3 90.5 -71.9 336 -77.6 c 92.4 -2.1 80 44.3 121.8 116.4 c -14.8 46.9 53.5 155.9 14.7 178 c -123.5 54.9 5.4 269 -257 115.1 c -77.5 -59.2 -203 46.3 -263.7 20.1 c -33.5 -14.5 -132.5 -45.5 -95 -111.1 C 125.9 246.6 86 124 214 101 z" },
        { d: "M 215 100.3 c 24 -67.3 90.5 -71.9 336 -77.6 c 92.4 -2.1 50 59.3 121.8 116.4 c 41.2 2.9 53.5 155.9 14.7 178 c -123.5 54.9 5.4 269 -257 115.1 c -78.5 -21.2 -203 46.3 -263.7 20.1 c -33.5 -14.5 -132.5 -45.5 -95 -111.1 C 216 188 86 124 214 101 z" },
        { d: "M 215 100.3 c 24 -67.3 118 21.7 336 -77.6 c 92.4 -2.1 79 43.3 121.8 116.4 c 41.2 2.9 53.5 155.9 14.7 178 c -123.5 54.9 8.5 153.9 -257 115.1 c -97.5 24.8 -203 46.3 -263.7 20.1 c -33.5 -14.5 -132.5 -45.5 -95 -111.1 C 172 158 86 124 214 101 z" },
        { d: "M 215 100.3 c 24 -67.3 110 -14.3 336 -77.6 c 92.4 -2.1 116 -0.7 121.8 116.4 c 53.2 -38.1 53.5 155.9 14.7 178 c -123.5 54.9 113.5 178.9 -257 115.1 c -97.5 24.8 -214.5 -36.2 -263.7 20.1 c -33.5 -14.5 -132.5 -45.5 -95 -111.1 C 70 141 86 124 214 101 z"},
        { d: "M 215 100.3 c 97.8 -32.6 90.5 -71.9 336 -77.6 c 92.4 -2.1 98.1 81.6 121.8 116.4 c 101.7 149.9 53.5 155.9 14.7 178 c -96.4 54.9 5.4 269 -257 115.1 c -57 -33.5 -203 46.3 -263.7 20.1 c -33.5 -14.5 -132.5 -45.5 -95 -111.1 C 125.9 246.6 99 124 215 100.3 z" },
        { d: "M 215 100.3 c 97.8 -32.6 90.5 -71.9 336 -77.6 c 92.4 -2.1 98.1 81.6 121.8 116.4 c 40.2 157.9 5.2 88.9 14.7 178 c -28.5 67.9 5.4 269 -257 115.1 c -57 -33.5 -203 46.3 -263.7 20.1 c -33.5 -14.5 -132.5 -45.5 -95 -111.1 C 125.9 246.6 98.6 139.1 215 100.3 z" }
      ],
      loop: true,
      config: { duration: 1000 }

    }
  );

  function openColorInput() {
    if(!refColorInput.current) {
      return;
    }

    refColorInput.current.click();
  }

  return (
    <div className="flex flex-col height">
      <label className="flex flex-row items-center gap-2">
        {label}
      </label>
      <div className="flex flex-row gap-2">
        <button className="btn btn-dash" onClick={openColorInput}>{value}</button>
      <div className="relative" style={{ bottom: 60, height: 50 }}>
        <input
          ref={refColorInput}
          id="colorInput"
          className="hover:cursor-pointer relative"
          style={{ top: 60, left: 10 }}
          type="color"
          value={value}
          onChange={(e) => setValueChanged(e.target.value)}
        />
        <div onClick={openColorInput}>
          <svg width="64" height="64" viewBox="0 0 730 336" className="hover:cursor-pointer">
            <animated.path 
              fill={value} 
              stroke="#000000"
              strokeWidth={1.5795}
              strokeMiterlimit={10}
              d={springsIcon.d}
            >
            </animated.path>
          </svg>
        </div>
      </div>
    </div>

    </div>
  );
}

export default ColorInput;