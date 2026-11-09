
interface RatioInputProps {
  value: number;
  onChange: (value: number) => void;
}

function RatioInput({ value, onChange }: RatioInputProps) {
  return (
   <div className="w-full max-w-xs">
      <label>Ratio</label>
      <input 
        type="range"
        min={0.5}
        max={2}
        value={value}
        step={0.25}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="range range-secondary"
      />
      <div className="flex justify-between text-xs">
        <span>0.5</span>
        <span>0.75</span>
        <span>1</span>
        <span>1.25</span>
        <span>1.5</span>
        <span>1.75</span>
        <span>2</span>
      </div>
    </div>
  );  
}

export default RatioInput;