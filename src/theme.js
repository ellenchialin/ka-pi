import { extendTheme } from '@chakra-ui/react'

const custumTheme = extendTheme({
  fonts: {
    heading: 'Rubik, sans-serif',
    body: 'Rubik, sans-serif',
  },
  colors: {
    primary: '#212226',
    secondary: '#727787',
    cream: '#FFEECA',
    accent: '#F4BF3A',
    success: '#62F699',
    warning: '#c34a36',
  },
})

export default custumTheme
