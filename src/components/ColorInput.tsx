import React from 'react';
import "./ColorInput.css";


interface ColorInputProps {
  value: string;
  label: string;
  onChange: (newValue: string) => void;
}

function ColorInput({ label, value, onChange } : ColorInputProps ) {
  return (
    <div className="flex flex-col">
      <label className="flex flex-row items-center gap-2">
        {label}
        <div className="badge badge-accent">{value}</div>
      </label>
      <input
        id="colorInput"
        className="w-15 h-15 hover:cursor-pointer"
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default ColorInput;