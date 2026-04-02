import { useContext } from 'react';
import { SettingsContext } from "./components/SettingsContextWrapper";
import { useSpring, useSpringRef, animated, easings } from '@react-spring/web';

import ChooseColor from "./ChooseColor";
import ThreejsRenderer from './components/threeJs/ThreeJsRenderer';
import useTopographies from "./components/hooks/useTopographies";

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
    setColorChosen,
    colorChosen,
    colorFrom, 
    colorTo
  } = useContext(SettingsContext);
  const { generateShapes, shapesByGroup } = useTopographies({
    width, 
    height,
    numberOfLayers,
    numberOfTopograhies: 4,
    fromToColors: [colorFrom, colorTo]
  });

  const apiTransitionChooseColor = useSpringRef();
  const transitionChooseColorProps  = useSpring(
      {
        ref: apiTransitionChooseColor,
        from: { display: "block", position: "relative", top: "0%", },
        to: [
          { display: "block", position: "relative", top: "-200%" },
          { display: "none", },
        ],
        config: { duration: 500, easing: easings.easeInBack },
        onStart: () => {
          setColorChosen(true);
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
      <h1>Vite + React</h1>
      {/*<TiltCard />*/}
      <button className="btn btn-primary" onClick={() => {generateShapes(); setAnimationState("started")}}>
        Generate
      </button>
      <button className="btn btn-xs btn-secondary" onClick={() => setLight(!isLight)}>
        {isLight ? "Light" : "Dark"}
      </button>

      <div className="w-full h-screen">
        <animated.div style={transitionChooseColorProps}>
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
          style={{...transitionThreeJsRendererProps, display: colorChosen ? "block" : "none"}}
        >
          <ThreejsRenderer shapesByGroup={shapesByGroup} rendered={colorChosen}/> 
        </animated.div> 
      </div>
    </>
  )
}

export default App
