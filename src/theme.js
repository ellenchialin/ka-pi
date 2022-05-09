import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const custumTheme = extendTheme({
  styles: {
    global: props => ({
      'html, body': {
        fontFamily: 'Rubik, sans-serif',
        color: mode('#212121', '#fff')(props),
        bg: mode('#fff', '#212121')(props),
        lineHeight: 'base',
      },
      h1: {
        fontSize: '36px',
        fontWeight: 'bold',
      },
      h2: {
        fontSize: '30px',
        fontWeight: 'bold',
      },
      h3: {
        fontSize: '24px',
        fontWeight: 'bold',
      },
      h4: {
        fontSize: '18px',
        fontWeight: 'bold',
      },
      h5: {
        fontSize: '14px',
        fontWeight: 'bold',
      },
      h6: {
        fontSize: '12px',
        fontWeight: 'bold',
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
        'auth-buttons': props => ({
          bg: mode('thirdDark', 'secondaryLight')(props),
          color: mode('primaryLight', 'primaryDark')(props),
          _hover: {
            bg: mode('primaryDark', 'primaryLight')(props),
            color: mode('primaryLight', 'primaryDark')(props),
          },
        }),
        'auth-thirdParty': props => ({
          bg: 'transparent',
          color: mode('thirdDark', 'secondaryLight')(props),
          border: '2px',
          borderColor: mode('thirdDark', 'secondaryLight')(props),
          _hover: {
            color: mode('primaryDark', 'primaryLight')(props),
            borderColor: mode('primaryDark', 'primaryLight')(props),
          },
        }),
      },
    },
    Modal: {
      variants: {
        comment: {
          dialog: {
            bg: 'primaryLight',
          },
        },
      },
    },
    Popover: {
      variants: {
        search: {
          content: {
            bg: 'gray.200',
          },
        },
      },
    },
    Divider: {
      colorScheme: 'secondaryLight',
    },
    Skeleton: {
      sizes: {
        sm: {
          width: '270px',
          height: '300px',
          rounded: 'lg',
        },
      },
    },
  },
  colors: {
    primaryDark: '#121212',
    secondaryDark: '#212121',
    thirdDark: '#535353',
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
