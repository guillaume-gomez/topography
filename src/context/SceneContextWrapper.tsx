import { createContext, useState, type ReactNode } from 'react';

type SceneName = "intro" | "color-choice" | "3d-scene"

export interface SceneContextParams {
  isIntro: () => boolean;
  is3DScene: () => boolean;
  isColorChoose: () => boolean;
  setSceneName: (sceneName: SceneName) => void;
  animationIntroEnd: boolean;
  animationColorChoiceEnd: boolean;
  animationScene3DEnd: boolean;
  setAnimationEnd: (sceneName: SceneName, value: boolean) => void;

}
export const SceneContext = createContext<SceneContextParams>(null);

interface Props {
  children: ReactNode;
}

function SceneContextWrapper({children}: Props) {
  const [sceneName, setSceneName] = useState<SceneName>("intro");
  const [animationIntroEnd, setAnimationIntroEnd] = useState<boolean>(false);
  const [animationColorChoiceEnd, setAnimationColorChoiceEnd] = useState<boolean>(false);
  const [animationScene3DEnd, setAnimationScene3DEnd] = useState<boolean>(false);

  function setAnimationEnd(sceneName: SceneName, value: boolean) {
    switch(sceneName) {
      case "intro":
        setAnimationIntroEnd(value);
        return;
      case "color-choice":
        setAnimationColorChoiceEnd(value);
        return;
      case "3d-scene":
        setAnimationScene3DEnd(value);
        return;
    }
  }

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
      isColorChoose,
      animationIntroEnd,
      animationColorChoiceEnd,
      animationScene3DEnd,
      setAnimationEnd
    }}>
      {children}
    </SceneContext >
  );
}

export default SceneContextWrapper;