import { ColorModeScript, ChakraProvider, extendTheme } from '@chakra-ui/react'
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { AuthProvider } from './contexts/AuthContext'
import App from './App'
import custumTheme from './theme'
import '@fontsource/rubik'

ReactDOM.render(
  <StrictMode>
    <ChakraProvider theme={custumTheme}>
      <AuthProvider>
        <ColorModeScript />
        <App />
      </AuthProvider>
    </ChakraProvider>
  </StrictMode>,
  document.getElementById('root')
)
