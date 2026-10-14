import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AssetProvider } from './context/AssetContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AssetProvider>
        <App />
      </AssetProvider>
    </BrowserRouter>
  </StrictMode>,
)
