import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StickyMenu } from './components/StickyMenu.tsx'

// Montar App
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Montar StickyMenu en su propio div — independiente del App
const menuDiv = document.createElement('div')
menuDiv.id = 'sticky-menu-root'
document.body.appendChild(menuDiv)

createRoot(menuDiv).render(
  <StrictMode>
    <StickyMenu />
  </StrictMode>,
)