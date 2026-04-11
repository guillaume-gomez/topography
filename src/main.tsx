import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.tsx';

import SettingsContextWrapper from "./context/SettingsContextWrapper";
import SceneContextWrapper from "./context/SceneContextWrapper";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsContextWrapper>
      <SceneContextWrapper>
        <App />
      </SceneContextWrapper> 
    </SettingsContextWrapper>
  </StrictMode>,
)
