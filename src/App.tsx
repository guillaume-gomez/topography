import { useContext } from 'react';
import { SettingsContext } from "./components/SettingsContextWrapper";
import { useSpring, useSpringRef, animated, easings } from '@react-spring/web';

import ChooseColor from "./ChooseColor";
import ThreejsRenderer from './components/threeJs/ThreeJsRenderer';
import useTopography from "./components/hooks/useTopography";
import ProgressButton from "./components/ProgressButton";

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
      <div className="
        absolute -z-10 inset-0 h-full w-full 
        bg-[linear-gradient(to_right,#73737320_1px,#03030349_1px),linear-gradient(to_bottom,#73737320_1px,#03030349_1px)] 
        bg-[size:30px_30px]"
      />
      {/*<TiltCard />*/}
      <button className="btn btn-primary" onClick={() => {generate(); setAnimationState("started")}}>
        Generate
      </button>
      <ProgressButton label="Generate" onClick={() => {generate(); setAnimationState("started")}} />
      <button className="btn btn-xs btn-secondary" onClick={() => setLight(!isLight)}>
        {isLight ? "Light" : "Dark"}
      </button>

      <div className="w-full h-screen p-5">
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
          <ThreejsRenderer shapes={shapes} rendered={colorChosen}/> 
        </animated.div> 
      </div>
    </>
  )
}

export default App
