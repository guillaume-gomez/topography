import { useContext, useEffect } from 'react';
import { SettingsContext } from "./context/SettingsContextWrapper";
import { SceneContext } from "./context/SceneContextWrapper";
import { useSpring, useSpringRef, animated, easings } from '@react-spring/web';

import ChooseColor from "./ChooseColor";
import ThreejsRenderer from './components/threeJs/ThreeJsRenderer';
import useTopography from "./components/hooks/useTopography";
import Card from "./components/Card";
import ParallaxTilt from "./components/ParallaxTilt";

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
    animationIntroEnd,
    animationColorChoiceEnd,
    setAnimationEnd
  } = useContext(SceneContext);

  const { generate, shapes } = useTopography({
    width, 
    height,
    numberOfLayers,
    fromToColors: [colorFrom, colorTo]
  });

  useEffect(() => {
    if(isColorChoose()) {
      apiTransitionIntro.start();
    }
  }, [isColorChoose])

  const apiTransitionIntro = useSpringRef();
  const transitionIntroProps  = useSpring(
      {
        ref: apiTransitionIntro,
        from: { position: "relative", top: "0%" },
        to: [
          { position: "relative", top: "-300%" },
          { position: "relative" },
        ],
        config: { duration: 500, easing: easings.easeInBack },
        onStart: () => {
          setSceneName("color-choice");
        },
        onRest: (result, spring, item) => {
          //apiTransitionThreeJsRenderer.start();
          setAnimationEnd("intro", true);
        }
      }
  );

  const apiTransitionChooseColor = useSpringRef();
  const transitionChooseColorProps  = useSpring(
      {
        ref: apiTransitionChooseColor,
        from: { position: "relative", top: "0%" },
        to: [
          { position: "relative", top: "-200%" },
          { position: "relative" },
        ],
        config: { duration: 500, easing: easings.easeInBack },
        onStart: () => {
          setSceneName("3d-scene");
        },
        onRest: (result, spring, item) => {
          apiTransitionThreeJsRenderer.start();
          setAnimationEnd("color-choice", true);
        }
      }
  );

  const apiTransitionThreeJsRenderer = useSpringRef();
  const transitionThreeJsRendererProps  = useSpring(
      {
        ref: apiTransitionThreeJsRenderer,
        from: { position: "relative", opacity: 0.3, top: "-210%" },
        to: [
          { position: "relative", opacity: 1, top: "0%" },
          { position: "static", opacity: 1, top: "0%" }
        ],
        config: { duration: 500, easing: easings.easeOutBack  },
        onRest: () => {
          setAnimationEnd("3d-scene", true);
        }
      }
  );


  return (
    <>
      <div className="
        absolute -z-10 inset-0 h-full w-full 
        bg-[linear-gradient(to_right,#73737320_1px,#03030349_1px),linear-gradient(to_bottom,#73737320_1px,#03030349_1px)] 
        bg-[size:30px_30px]"
      />
      <div className="w-screen h-screen p-5 flex">
        
        <animated.div className="w-full h-full p-5 items-center justify-center" style={{...transitionIntroProps, display: isIntro() || !animationIntroEnd ? "flex" : "none"}}>
          <ParallaxTilt/>      
        </animated.div>
        
        <animated.div 
            className="w-full"
            style={{
              ...transitionChooseColorProps,
              display: isColorChoose() && !animationColorChoiceEnd ? "block" : "none"
            }}
        >
          <ChooseColor onSubmit={(colorFrom, colorTo, layers) => {
            // Handle the color submission
            setColorFrom(colorFrom);
            setColorTo(colorTo);
            setNumberOfLayers(layers);

            apiTransitionChooseColor.start();
          }} />
        </animated.div>
        <animated.div
          className="w-full h-screen"
          style={{...transitionThreeJsRendererProps, display: is3DScene() ? "block" : "none"}}
        >
          <Card kustomClass="absolute left-10 top-10 z-10 opacity-70">
            <button className="btn btn-primary" onClick={() => {generate(); setAnimationState("started")}}>
              Generate
            </button>
            <button className="btn btn-xs btn-secondary" onClick={() => setLight(!isLight)}>
              {isLight ? "Light" : "Dark"}
            </button>
          </Card>
          <ThreejsRenderer shapes={shapes}/> 
        </animated.div> 
      </div>
    </>
  )
}

export default App
