import { Link as NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
// prettier-ignore
import { Box, Flex, Text, Link, Divider, Icon, Collapse, CloseButton, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { HiOutlineHome } from 'react-icons/hi'
import { BsSearch } from 'react-icons/bs'
import { CgCoffee } from 'react-icons/cg'
import { VscLibrary } from 'react-icons/vsc'
import { RiStarSmileLine } from 'react-icons/ri'
import { ColorModeSwitcher } from '../ColorModeSwitcher'

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
      _focus={{ bg: 'gray.400', color: 'white' }}
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
      <Flex fontSize="1.2rem" align="center" justify="space-between" w="100%">
        {children}
      </Flex>
    </Flex>
  )
}

NavItem.propTypes = {
  icon: PropTypes.func,
  children: PropTypes.node,
}

function SidebarContent({ onClose, ...rest }) {
  const { isOpen: discoverIsOpen, onToggle: discoverOnToggle } = useDisclosure()
  const { isOpen: collectionsIsOpen, onToggle: collectionsOnToggle } =
    useDisclosure()

  const bgColor = useColorModeValue('primaryLight', 'primaryDark')
  const textColor = useColorModeValue('primaryDark', 'primaryLight')

  return (
    <Flex
      as="nav"
      pos="fixed"
      zIndex="sticky"
      h="100vh"
      w="60"
      bg={bgColor}
      color={textColor}
      direction="column"
      boxShadow="base"
      overflowX="hidden"
      overflowY="auto"
      {...rest}
    >
      <Flex px="4" py="5" alignItems="center" justifyContent="space-between">
        <Text fontSize="3xl" ml="2" color={textColor} fontWeight="semibold">
          ka-pi
        </Text>
        <ColorModeSwitcher display={{ base: 'none', md: 'inline-flex' }} />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Flex
        direction="column"
        as="nav"
        fontSize="sm"
        color="grey.600"
        aria-label="主選單"
      >
        <NavItem
          as={NavLink}
          to="/"
          icon={HiOutlineHome}
          _activeLink={{ color: 'red.400' }}
        >
          Home
        </NavItem>
        <NavItem icon={BsSearch} onClick={discoverOnToggle}>
          Discover
          <Icon
            as={MdKeyboardArrowRight}
            ml="3"
            transform={discoverIsOpen && 'rotate(90deg)'}
          />
        </NavItem>
        <Collapse in={discoverIsOpen}>
          <NavItem as={NavLink} to="search" pl="12" py="2">
            by Keywords
          </NavItem>
          <NavItem as={NavLink} to="search/features" pl="12" py="2">
            by Features
          </NavItem>
        </Collapse>
        <NavItem icon={VscLibrary} onClick={collectionsOnToggle}>
          Collections
          <Icon
            as={MdKeyboardArrowRight}
            ml="3"
            transform={collectionsIsOpen && 'rotate(90deg)'}
          />
        </NavItem>
        <Collapse in={collectionsIsOpen}>
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
      </Flex>
      <Box px="4" pb="5" mt="auto">
        <Divider />
        <Text fontSize="0.75em" pt="5">
          © 2022 ka-pi. All rights reserved.
        </Text>
        <Text fontSize="0.75em">
          Cafes data source:{' '}
          <Link href="https://cafenomad.tw/developers/docs/v1.2" color="teal">
            Cafe Nomad
          </Link>
        </Text>
      </Box>
    </Flex>
  )
}

SidebarContent.propTypes = {
  onClose: PropTypes.func,
}

export default SidebarContent
