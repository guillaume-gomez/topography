
interface NumberInputProps {
  label: string;
  value: number;
  min: number;
  max:number
  step?: number;
  onChange: (newValue: number) => void;
  size?: string;
}

function NumberInput({label, onChange, value, min, max, step = 1, size = "input-xs"} : NumberInputProps) {
  return (
    <div className="form-control">
      <label>{label}</label>
      <input
        type="number"
        className={`input validator ${size}`}
        placeholder="Type a number"
        step={step}
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || min)}
      />
      {min && max && <p className="validator-hint">{`Must be between be ${min} to ${max}`}</p>}
    </div>
  );
}

export default NumberInput;