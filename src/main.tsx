import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.tsx';

import SettingsContextWrapper from "./components/contexts/SettingsContextWrapper";
import SoundContextWrapper from "./components/contexts/SoundContextWrapper";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SoundContextWrapper>
      <SettingsContextWrapper>
        <App />
      </SettingsContextWrapper>
    </SoundContextWrapper>
  </StrictMode>,
)
