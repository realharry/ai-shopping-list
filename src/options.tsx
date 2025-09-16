import React from 'react'
import ReactDOM from 'react-dom/client'
import { OptionsApp } from './components/OptionsApp'
import './index.css'

ReactDOM.createRoot(document.getElementById('options-root')!).render(
  <React.StrictMode>
    <OptionsApp />
  </React.StrictMode>
)