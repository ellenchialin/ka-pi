import {
  ChakraProvider,
  Box,
  theme,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  Flex,
  IconButton,
} from '@chakra-ui/react'
// import { ColorModeSwitcher } from './ColorModeSwitcher'
import { CgMenuLeft } from 'react-icons/cg'
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

          {/*<Flex
            as="header"
            align="center"
            justify="space-between"
            w="full"
            px="4"
            bg="gray.800"
            borderBottomWidth="1px"
            borderColor="gray.700"
            h="14"
            display={{ base: 'block', md: 'none' }}
          >
            <IconButton
              aria-label="主選單"
              display={{ base: 'inline-flex', md: 'none' }}
              onClick={onOpen}
              icon={<CgMenuLeft />}
              size="md"
            />
            {<ColorModeSwitcher />
          </Flex>*/}
          <Box as="main" p="4">
            <Home />
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  )
}

export default App
