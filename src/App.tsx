import { useContext } from 'react';
import { SettingsContext } from "./components/SettingsContextWrapper";

import ChooseColor from "./ChooseColor";
import ThreejsRenderer from './components/threeJs/ThreeJsRenderer';
import useTopography from "./components/hooks/useTopography";

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

  return (
    <>
      <h1>Vite + React</h1>
      {/*<TiltCard />*/}
      <button className="btn btn-primary" onClick={() => {generate(); setAnimationState("started")}}>
        Generate
      </button>
      <button className="btn btn-xs btn-secondary" onClick={() => setLight(!isLight)}>
        {isLight ? "Light" : "Dark"}
      </button>

      <div className="w-full h-screen">
        {colorChosen ? 
          <ThreejsRenderer shapes={shapes} rendered={colorChosen}/> :
          <ChooseColor onSubmit={(colorFrom, colorTo, layers) => {
            // Handle the color submission
            setColorFrom(colorFrom);
            setColorTo(colorTo);
            setNumberOfLayers(layers);
            setColorChosen(true);
          }} />
       }
      </div>
    </>
  )
}

export default App
