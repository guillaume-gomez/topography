import { useMemo, useContext } from "react";
import { RendererContext } from "../context/RendererContextWrapper";
import { MeshStandardMaterial, type Material } from "three";
import { useSpring } from "@react-spring/three";


function useDayNightMaterial(materialsParams: object, materialKlass?: Material) {
  const {
    isLight,
    timerSwitch,
  } = useContext(RendererContext);

  const material = useMemo(() => {
    if(materialKlass) {
      return new materialKlass({ displacementScale:0, ...materialsParams });
    }
    return new MeshStandardMaterial({ displacementScale:0, ...materialsParams });
  }, []); // do not want to regenerate when materialsParams is recompute (as un array every render)

  useSpring({
    factorColor: isLight ? 1 : 0,
    config: { duration: timerSwitch },
    onChange: (result) => {
      material.color.setRGB(result.value.factorColor, result.value.factorColor, result.value.factorColor);
    }
  });

  return material;
}

export default useDayNightMaterial;