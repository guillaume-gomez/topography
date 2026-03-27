
interface RangeProps {
  label: string;
  value: number;
  min: number;
  max:number
  step?: number;
  float?: boolean
  onChange: (newValue: number) => void;
  size: string;
}

function Range({label, onChange, value, min, max, step = 1, size = "range-xs", float = false} : RangeProps) {
  return (
    <div className="form-control">
      <label>{label}</label>
      <div className="flex flex-row gap-2">
        <input
          step={step}
          min={min}
          max={max}
          type="range"
          className={`range ${size} range-primary w-full`}
          onChange={(e) => {
              const value = float ? parseFloat(e.target.value) : parseInt(e.target.value);
              onChange(value);
            }
          }
        />
        <legend className="fieldset-legend badge badge-secondary border border-primary">{value}</legend>
      </div>
    </div>
  );
}

export default Range;