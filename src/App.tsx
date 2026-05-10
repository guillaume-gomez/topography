import { useEffect, useContext, type CSSProperties } from 'react';
import { SettingsContext } from "./context/SettingsContextWrapper";
import { SceneContext } from "./context/SceneContextWrapper";
import { animated, easings, useTransition, type AnimatedProps } from '@react-spring/web';

import ChooseColor from "./ChooseColor";
import ThreejsRenderer from './components/threeJs/ThreeJsRenderer';
import useTopographies from "./components/hooks/useTopographies";
import Card from "./components/Card";
import ParallaxTilt from "./components/ParallaxTilt";

type AnimationProps = AnimatedProps<CSSProperties>

function App() {
  const {
    isLight,
    setLight,
    width,
    height,
    numberOfLayers,
    setColorFrom,
    setColorTo,
    setNumberOfLayers,
    setAnimationState,
    colorFrom, 
    colorTo
  } = useContext(SettingsContext);
  const {
    setSceneName,
    isColorChoose,
    isIntro,
    is3DScene,
  } = useContext(SceneContext);

  const { generate, shapes } = useTopographies({
    width, 
    height,
    numberOfLayers,
    fromToColors: [colorFrom, colorTo]
  });

  useEffect(() => {
    setSceneName("intro")
  }, []);


  const transitionIntroProps  = useTransition(
      isIntro() ? [1] : [],
      {
        from: { position: "relative", top: "-100%", display: "flex" },
        enter: { position: "relative", top: "0%", display: "flex" },
        leave: { position: "relative", top: "-100%", display: "flex" },
        config: { duration: 500, easing: easings.easeInBack },
      }
  );

  const transitionChooseColorProps  = useTransition(
      isColorChoose() ? [2] : [],
      {
        from: { position: "relative", top: "-100%", display: "block" },
        enter: { position: "relative", top: "0%", display: "block" },
        leave: { position: "relative", top: "-100%", display: "block" },
        config: { duration: 500, easing: easings.easeInBack },
      }
  );

  const transitionThreeJsRendererProps  = useTransition(
      is3DScene() ? [3] : [],
      {
        from: { position: "relative", opacity: 0.3, top: "-100%", display: "none" },
        enter: { position: "relative", opacity: 1, top: "0%", display: "block" },
        config: { duration: 500, easing: easings.easeOutBack  },
      }
  );

  function onGenerate() {
    generate();
    setAnimationState("started");
  }

  return (
    <>
      <div className="
        absolute -z-10 inset-0 h-full w-full
        bg-[linear-gradient(to_right,#73737320_1px,#03030349_1px),linear-gradient(to_bottom,#73737320_1px,#03030349_1px)]
        bg-[size:30px_30px]"
      />
      <div className="w-screen h-screen md:p-5 p-2 flex flex-col">
        {
          transitionIntroProps(style => (
            <animated.div className="w-full h-full p-5 items-center justify-center" style={style as AnimationProps}>
              <ParallaxTilt/>
            </animated.div>
          ))
        }
        {
          transitionChooseColorProps(style => (
            <animated.div
            className="w-full h-screen"
            style={style as AnimationProps}
            >
              <ChooseColor onSubmit={(colorFrom, colorTo, layers) => {
                // Handle the color submission
                setColorFrom(colorFrom);
                setColorTo(colorTo);
                setNumberOfLayers(layers);

                setSceneName("3d-scene");
              }} />
            </animated.div>
          ))
        }
        {
          transitionThreeJsRendererProps(style => (
            <animated.div
              className="w-full h-screen"
              style={style as AnimationProps}
            >
              <Card kustomClass="absolute left-2 lg:left-5  top-2 lg:top-5 z-10 opacity-70">
                <button className="btn btn-primary" onClick={onGenerate}>
                  Generate
                </button>
                <button className="btn btn-xs btn-secondary" onClick={() => setLight(!isLight)}>
                  {isLight ? "Light" : "Dark"}
                </button>
              </Card>
              <ThreejsRenderer shapes={shapes}/>
            </animated.div>
          ))
        }
      </div>
    </>
  )
}

export default App
