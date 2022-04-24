import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// prettier-ignore
import { ChakraProvider, Box, theme, useDisclosure, Drawer, DrawerOverlay, DrawerContent } from '@chakra-ui/react'
// import { ColorModeSwitcher } from './ColorModeSwitcher'

import { useAuth } from './contexts/AuthContext'
import Header from './components/Header'
import SidebarContent from './components/SidebarContent'
import Home from './pages/Home'
import ForWork from './pages/collections/ForWork'
import ForHangout from './pages/collections/ForHangout'
import Picks from './pages/Picks'
import Auth from './pages/Auth'
import User from './pages/User'
import City from './pages/City'
import Cafe from './pages/Cafe'
import Blog from './pages/Blog'
import EditBlog from './pages/EditBlog'
import SearchByKeyword from './pages/search/SearchByKeyword'
import SearchByFeature from './pages/search/SearchByFeature'
import NoMatch from './pages/NoMatch'

function App() {
  const { currentUser } = useAuth()
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
                <Route path="collections">
                  <Route path="work" element={<ForWork />} />
                  <Route path="hangout" element={<ForHangout />} />
                </Route>
                <Route path="city">
                  <Route path=":cityName" element={<City />} />
                </Route>
                <Route path="search">
                  <Route index element={<SearchByKeyword />} />
                  <Route path="features" element={<SearchByFeature />} />
                </Route>
                <Route path="cafe">
                  <Route path=":cafeId" element={<Cafe />} />
                  <Route path="blog/:blogId" element={<Blog />} />
                  <Route path="blog/edit/:blogId" element={<EditBlog />} />
                </Route>

                <Route path="picks" element={<Picks />} />
                <Route
                  path="user"
                  element={
                    currentUser ? <User /> : <Navigate to="/auth" replace />
                  }
                />
                <Route
                  path="/auth"
                  element={
                    currentUser ? <Navigate to="/user" replace /> : <Auth />
                  }
                />
                <Route path="*" element={<NoMatch />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </ChakraProvider>
    </BrowserRouter>
  )
}

export default App
