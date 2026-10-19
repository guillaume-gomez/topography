import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.tsx';

import SettingsContextWrapper from "./context/SettingsContextWrapper";
import RendererContextWrapper from "./context/RendererContextWrapper";
import SceneContextWrapper from "./context/SceneContextWrapper";
import SoundsContextWrapper from "./context/SoundsContextWrapper";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsContextWrapper>
      <RendererContextWrapper>
        <SceneContextWrapper>
          <SoundsContextWrapper>
            <App />
          </SoundsContextWrapper>
        </SceneContextWrapper>
      </RendererContextWrapper>
    </SettingsContextWrapper>
  </StrictMode>,
)
