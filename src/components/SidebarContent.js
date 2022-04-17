import { Link as NavLink } from 'react-router-dom'
import {
  Box,
  Flex,
  Text,
  Link,
  Divider,
  Icon,
  Collapse,
  CloseButton,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { HiOutlineHome } from 'react-icons/hi'
import { CgCoffee } from 'react-icons/cg'
import { VscLibrary } from 'react-icons/vsc'
import { RiStarSmileLine } from 'react-icons/ri'

function SidebarContent({ onClose, ...rest }) {
  const integrations = useDisclosure()

  const NavItem = props => {
    const { icon, children, ...rest } = props
    return (
      <Flex
        align="center"
        px="4"
        pl="4"
        py="3"
        cursor="pointer"
        _hover={{
          bg: 'gray.400',
          color: 'white',
        }}
        role="group"
        transition=".15s ease"
        {...rest}
      >
        {icon && (
          <Icon
            mx="2"
            fontSize="20"
            _groupHover={{ color: 'gray.200' }}
            as={icon}
          />
        )}
        <Text fontSize="1.2rem">{children}</Text>
      </Flex>
    )
  }

  return (
    <Box
      as="nav"
      pos="fixed"
      zIndex="sticky"
      h="full"
      bg="white"
      color="gray.800"
      borderRight="1px"
      borderRightColor="gray.200"
      overflowX="hidden"
      overflowY="auto"
      w="60"
      {...rest}
    >
      <Flex px="4" py="5" alignItems="center" justifyContent="space-between">
        <Text
          fontSize="3xl"
          ml="2"
          color={useColorModeValue('inherit', 'white')}
          fontWeight="semibold"
        >
          ka-pi
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Flex
        direction="column"
        as="nav"
        fontSize="sm"
        color="grey.600"
        aria-label="主選單"
        h="100%"
      >
        <NavItem as={NavLink} to="/" icon={HiOutlineHome}>
          Home
        </NavItem>
        <NavItem icon={VscLibrary} onClick={integrations.onToggle}>
          Explore
          <Icon
            as={MdKeyboardArrowRight}
            ml="auto"
            transform={integrations.isOpen && 'rotate(90deg)'}
          />
        </NavItem>
        <Collapse in={integrations.isOpen}>
          <NavItem as={NavLink} to="search" pl="12" py="2">
            by Keywords
          </NavItem>
          <NavItem as={NavLink} to="search/features" pl="12" py="2">
            by Features
          </NavItem>
        </Collapse>
        <NavItem icon={VscLibrary} onClick={integrations.onToggle}>
          Collections
          <Icon
            as={MdKeyboardArrowRight}
            ml="auto"
            transform={integrations.isOpen && 'rotate(90deg)'}
          />
        </NavItem>
        <Collapse in={integrations.isOpen}>
          <NavItem as={NavLink} to="collections/work" pl="12" py="2">
            for Work
          </NavItem>
          <NavItem as={NavLink} to="collections/hangout" pl="12" py="2">
            for HangOut
          </NavItem>
        </Collapse>
        <NavItem as={NavLink} to="picks" icon={RiStarSmileLine}>
          Picks For you
        </NavItem>
        <NavItem as={NavLink} to="user" icon={CgCoffee}>
          Your Cafe Map
        </NavItem>
        <Box mt="auto" px="4" pb="5">
          <Divider />
          <Text fontSize="0.75em" pt="5">
            © 2022 ka-pi. All rights reserved.
          </Text>
          <Text fontSize="0.75em">
            此站使用咖啡廳社群
            <Link href="https://cafenomad.tw/developers/docs/v1.2" color="blue">
              Cafe Nomad
            </Link>
            資料庫
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}

export default SidebarContent
