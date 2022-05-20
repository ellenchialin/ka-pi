import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// prettier-ignore
import { Box, useDisclosure, Drawer, DrawerOverlay, DrawerContent, Flex } from '@chakra-ui/react'

import { useAuth } from './contexts/AuthContext'
import Header from './components/layout/Header'
import SidebarContent from './components/layout/SidebarContent'
import Home from './pages/Home'
import Collections from './pages/Collections'
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
      <Box minH="100vh">
        <SidebarContent display={{ base: 'none', md: 'flex' }} />
        <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="xs">
          <DrawerOverlay />
          <DrawerContent>
            <SidebarContent onClose={onClose} w="full" />
          </DrawerContent>
        </Drawer>
        <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
          <Header onOpen={onOpen} />

          <Flex
            as="main"
            maxW="1280px"
            h="100%"
            minH="100vh"
            direction="column"
            align="center"
            pt={{ base: '20', sm: '20', md: '8' }}
            pb="8"
            px="6"
            my="0"
            mx="auto"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="city">
                <Route path=":cityName" element={<City />} />
              </Route>
              <Route path="search">
                <Route index element={<SearchByKeyword />} />
                <Route path="features" element={<SearchByFeature />} />
              </Route>
              <Route path="collections/:type" element={<Collections />} />
              <Route path="cafe">
                <Route path=":cafeId" element={<Cafe />} />
                <Route path=":cafeId/blog/:blogId" element={<Blog />} />
                <Route path=":cafeId/blog/edit" element={<EditBlog />} />
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
          </Flex>
        </Box>
      </Box>
    </BrowserRouter>
  )
}

export default App
