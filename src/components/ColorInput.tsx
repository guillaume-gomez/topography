import { useRef } from 'react';
import { debounce } from "lodash";
import "./ColorInput.css";


interface ColorInputProps {
  value: string;
  label: string;
  onChange: (newValue: string) => void;
}

function ColorInput({ label, value, onChange } : ColorInputProps ) {
  const setValueChanged = debounce(onChange, 300);
  const refColorInput = useRef<HTMLInputElement>(null);

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
      <div className="relative" style={{bottom: 60}}>
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
          <svg width="64" height="64" viewBox="0 0 672 336" className="hover:cursor-pointer">
            <path 
              fill={value} 
              stroke="#000000"
              stroke-width="1.5794"
              stroke-miterlimit="10"
              d="M215,100.3c97.8-32.6,90.5-71.9,336-77.6
          c92.4-2.1,98.1,81.6,121.8,116.4c101.7,149.9,53.5,155.9,14.7,178c-96.4,54.9,5.4,269-257,115.1c-57-33.5-203,46.3-263.7,20.1
          c-33.5-14.5-132.5-45.5-95-111.1C125.9,246.6,98.6,139.1,215,100.3z">
            </path>
          </svg>
        </div>
      </div>
    </div>

    </div>
  );
}

export default ColorInput;