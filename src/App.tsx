import { useContext, useEffect, type CSSProperties } from 'react';
import { SettingsContext } from "./context/SettingsContextWrapper";
import { SceneContext } from "./context/SceneContextWrapper";
import { useSpring, useSpringRef, animated, easings, useTransition, type AnimatedProps } from '@react-spring/web';

import ChooseColor from "./ChooseColor";
import ThreejsRenderer from './components/threeJs/ThreeJsRenderer';
import useTopography from "./components/hooks/useTopography";
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
  const transitionIntroProps  = useTransition(
      isIntro(),
      {
        ref: apiTransitionIntro,
        from: { position: "relative", top: "0%", display: "flex" },
        enter: [
          { position: "relative", top: "-300%", display: "flex" },
          { position: "static", top: "-300%", display: "none" }
        ],
        //leave: { position: "relative", top: "-300%", display: "none" },
        config: { duration: 500, easing: easings.easeInBack },
        onStart: () => {
          setSceneName("color-choice");
        },
        onRest: () => {
          setAnimationEnd("intro", true);
        }
      }
  );

  const apiTransitionChooseColor = useSpringRef();
  const transitionChooseColorProps  = useTransition(
      isColorChoose(),
      {
        ref: apiTransitionChooseColor,
        from: { position: "relative", top: "0%", display: "flex " },
        enter: { position: "relative", top: "200%", display: "flex" },
        leave: [
          { position: "relative", top: "-200%", display: "flex" },
          { position: "relative", display: "none" },
        ],
        config: { duration: 500, easing: easings.easeInBack },
        onStart: () => {
          setSceneName("3d-scene");
        },
        onRest: () => {
          apiTransitionThreeJsRenderer.start();
          setAnimationEnd("color-choice", true);
        }
      }
  );

  const apiTransitionThreeJsRenderer = useSpringRef();
  const transitionThreeJsRendererProps  = useTransition(
      is3DScene(),
      {
        ref: apiTransitionThreeJsRenderer,
        from: { position: "relative", opacity: 0.3, top: "-210%" },
        enter: [
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
            className="w-full"
            style={style as AnimationProps}
            >
              <ChooseColor onSubmit={(colorFrom, colorTo, layers) => {
                // Handle the color submission
                setColorFrom(colorFrom);
                setColorTo(colorTo);
                setNumberOfLayers(layers);

                apiTransitionChooseColor.start();
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
          ))
        }
      </div>
    </>
  )
}

export default App
