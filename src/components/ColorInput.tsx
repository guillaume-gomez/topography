import { useRef } from 'react';
import "./ColorInput.css";
import ColorBlobInput, { type ColorBlobInputHandle } from './ColorBlobInput';


interface ColorInputProps {
  value: string;
  label: string;
  onChange: (newValue: string) => void;
}

function ColorInput({ label, value, onChange } : ColorInputProps ) {
  const refColorInput = useRef<ColorBlobInputHandle>(null);

  return (
    <div className="flex flex-col height">
      <label className="flex flex-row items-center gap-2">
        {label}
      </label>
      <div className="flex flex-row gap-2">
        <button className="btn btn-dash" onClick={() => {
          refColorInput?.current?.openColorInput();
        }}>{value}</button>
        <ColorBlobInput
          ref={refColorInput}
          onChange={onChange}
          value={value}
        />
    </div>

    </div>
  );
}

export default ColorInput;