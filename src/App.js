import {
  ChakraProvider,
  Box,
  theme,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react'
// import { ColorModeSwitcher } from './ColorModeSwitcher'
import Header from './components/Header'

import SidebarContent from './components/SidebarContent'
import Home from './pages/Home'

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <ChakraProvider theme={theme}>
      <Box as="section" minH="100vh">
        <SidebarContent display={{ base: 'none', md: 'unset' }} />
        <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="xs">
          <DrawerOverlay />
          <DrawerContent>
            <SidebarContent onClose={onClose} w="full" borderRight="none" />
          </DrawerContent>
        </Drawer>
        <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
          <Header onOpen={onOpen} />
          <Box as="main" p="4">
            <Home />
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  )
}

export default App
