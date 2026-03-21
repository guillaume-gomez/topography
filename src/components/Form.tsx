import Range from "./Range";
import { useState } from "react";

function Form() {
  const [layers, setLayers] = useState<number>(10);
	return (
  
    <div className="
      card
      w-96
      bg-black
      text-white
      bg-[radial-gradient(circle_at_bottom_left,#ffffff04_35%,transparent_36%),radial-gradient(circle_at_top_right,#ffffff04_35%,transparent_36%)]
      bg-size-[4.95em_4.95em]
      "
    >
      <div className="card-body">
        <div className="card-text">Options</div>
        <div className="d-flex flex-col gap-2">
          <Range
            label="Layers"
            onChange={(newValue) => setLayers(newValue)}
            value={layers}
            min={5}
            max={30}
          />
        </div>
      </div>
    </div>
	);

}

export default Form;