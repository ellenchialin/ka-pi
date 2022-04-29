import { ColorModeScript, ChakraProvider } from '@chakra-ui/react'
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
        <ColorModeScript
          initialColorMode={custumTheme.config.initialColorMode}
        />
        <App />
      </AuthProvider>
    </ChakraProvider>
  </StrictMode>,
  document.getElementById('root')
)
