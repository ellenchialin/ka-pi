import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import ForWork from './pages/collections/ForWork'
import ForHangout from './pages/collections/ForHangout'
import Picks from './pages/Picks'
import User from './pages/User'
import City from './pages/City'

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <Box minH="100vh">
          <SidebarContent display={{ base: 'none', md: 'unset' }} />
          <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="xs">
            <DrawerOverlay />
            <DrawerContent>
              <SidebarContent onClose={onClose} w="full" borderRight="none" />
            </DrawerContent>
          </Drawer>
          <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
            <Header onOpen={onOpen} />

            <Box as="main" py="8" px="6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/collections">
                  <Route path="work" element={<ForWork />} />
                  <Route path="hangout" element={<ForHangout />} />
                </Route>
                <Route path="city" element={<City />} />
                <Route path="picks" element={<Picks />} />
                <Route path="user" element={<User />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </ChakraProvider>
    </BrowserRouter>
  )
}

export default App
