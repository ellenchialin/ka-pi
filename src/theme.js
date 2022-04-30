import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const custumTheme = extendTheme({
  styles: {
    global: props => ({
      'html, body': {
        fontFamily: 'Rubik, sans-serif',
        color: mode('#181818', '#fff')(props),
        bg: mode('#fff', '#181818')(props),
        lineHeight: 'base',
      },
    }),
  },
  fonts: {
    heading: 'Rubik, sans-serif',
  },
  components: {
    Link: {
      sizes: {
        sm: {
          w: '25px',
          h: '25px',
        },
      },
    },
    Button: {
      variants: {
        'auth-buttons': {
          bg: 'secondaryLight',
          color: 'secondaryDark',
          _hover: {
            bg: 'gray.400',
            color: 'primaryLight',
          },
        },
      },
    },
  },
  colors: {
    secondaryDark: '#181818',
    primaryDark: '#121212',
    primaryLight: '#fff',
    secondaryLight: '#b3b3b3',
    accent: '#F4BF3A',
    success: '#62F699',
    warning: '#c34a36',
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: true,
  },
})

export default custumTheme
