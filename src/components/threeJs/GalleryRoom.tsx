import { useSpring } from "@react-spring/three";
import { useCallback, useContext, useRef } from "react";
import { SettingsContext } from "../../context/SettingsContextWrapper";
import { Mesh, type Color, type Group } from "three";
import { Gltf } from "@react-three/drei";

const { BASE_URL } = import.meta.env;

function GalleryRoom() {
  const {
      isLight,
      timerSwitch,
    } = useContext(SettingsContext);

  const galleryRef = useRef<Group>(null);
  const galleryOriginalColors = useRef(new Map<string, Color>());

  const applyGalleryDarkenFactor = useCallback((factor: number) => {
    if(!galleryRef.current) return;
    galleryRef.current.traverse((child) => {
      if(!(child instanceof Mesh) || !child.material) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if(!galleryOriginalColors.current.has(material.uuid)) {
          galleryOriginalColors.current.set(material.uuid, material.color.clone());
        }
        const originalColor = galleryOriginalColors.current.get(material.uuid)!;
        material.color.copy(originalColor).multiplyScalar(factor);
      });
    });
  }, []);

  useSpring({
    factor: isLight ? 1 : 0.1,
    onChange: (result) => {
      console.log(result.value.factor)
      applyGalleryDarkenFactor(result.value.factor)
    },
    config: { duration: timerSwitch }
  });

  return (
    <Gltf ref={galleryRef} src={`${BASE_URL}/vr_gallery/scene.gltf`} scale={280.0} position={[0,-250, 0]}  />
  )
};

export default GalleryRoom;