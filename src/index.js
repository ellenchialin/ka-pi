import { ColorModeScript } from '@chakra-ui/react'
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { AuthProvider } from './contexts/AuthContext'
import App from './App'

ReactDOM.render(
  <StrictMode>
    <AuthProvider>
      <ColorModeScript />
      <App />
    </AuthProvider>
  </StrictMode>,
  document.getElementById('root')
)
