import { createContext, useState, type ReactNode } from 'react';

type SceneName = "intro" | "color-choice" | "3d-scene"

export interface SceneContextParams {
  isIntro: () => boolean;
  is3DScene: () => boolean;
  isColorChoose: () => boolean;
  setSceneName: (sceneName: SceneName) => void;
}
export const SceneContext = createContext<SceneContextParams>(null);

interface Props {
  children: ReactNode;
}

function SceneContextWrapper({children}: Props) {
  const [sceneName, setSceneName] = useState<SceneName>("intro");

  function is3DScene() {
    return sceneName == "3d-scene";
  }

  function isIntro() {
    return sceneName == "intro";
  }

    function isColorChoose() {
    return sceneName == "color-choice"
  }

  return (
    <SceneContext value={{
      setSceneName,
      is3DScene,
      isIntro, 
      isColorChoose
    }}>
      {children}
    </SceneContext >
  );
}

export default SceneContextWrapper;