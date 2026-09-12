import { useMemo, useContext } from "react";
import { SettingsContext } from "../context/SettingsContextWrapper";
import { MeshStandardMaterial } from "three";
import { useSpring } from "@react-spring/three";


function useDayNightMaterial(materialsParams: object) {
  const {
    isLight,
    timerSwitch,
  } = useContext(SettingsContext);

  const material = useMemo(() => {
    return new MeshStandardMaterial({ displacementScale:0, ...materialsParams });
  }, [materialsParams]);

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