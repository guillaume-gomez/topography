import { useContext } from 'react';
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
  } = useContext(SceneContext);

  const { generate, shapes } = useTopography({
    width, 
    height,
    numberOfLayers,
    fromToColors: [colorFrom, colorTo]
  });

  const apiTransitionChooseColor = useSpringRef();
  const transitionChooseColorProps  = useSpring(
      {
        ref: apiTransitionChooseColor,
        from: { position: "relative", top: "0%", },
        to: [
          { position: "relative", top: "-200%" },
          { position: "relative", },
        ],
        config: { duration: 500, easing: easings.easeInBack },
        onStart: () => {
          setSceneName("3d-scene");
        },
        onRest: (result, spring, item) => {
          apiTransitionThreeJsRenderer.start();  
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
      }
  );

  return (
    <>
      <div className="
        absolute -z-10 inset-0 h-full w-full 
        bg-[linear-gradient(to_right,#73737320_1px,#03030349_1px),linear-gradient(to_bottom,#73737320_1px,#03030349_1px)] 
        bg-[size:30px_30px]"
      />
      {/*<TiltCard />*/}
      <div className="w-full h-screen p-5 flex flex-row items-center justify-center" style={{display: isIntro() ? "block" : "none" }}>
        <ParallaxTilt/>
      </div>

      <div className="w-full h-screen p-5">
        <animated.div style={{...transitionChooseColorProps, display: isColorChoose() ? "block" : "none" }}>
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
          <ThreejsRenderer shapes={shapes} rendered={is3DScene()}/> 
        </animated.div> 
      </div>
    </>
  )
}

export default App
