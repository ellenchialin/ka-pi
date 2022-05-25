import { IconButton, Flex, Text, useColorModeValue } from '@chakra-ui/react'
import { ColorModeSwitcher } from './ColorModeSwitcher'
import { CgMenuLeft } from 'react-icons/cg'
import PropTypes from 'prop-types'

function Header({ onOpen }) {
  const bgColor = useColorModeValue('secondaryLight', 'primaryDark')
  const textColor = useColorModeValue('primaryDark', 'primaryLight')

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      position="fixed"
      zIndex="sticky"
      w="full"
      h="14"
      px="4"
      bg={bgColor}
      color={textColor}
      boxShadow="base"
      display={{ base: 'flex', md: 'none' }}
    >
      <IconButton
        aria-label="主選單"
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        icon={<CgMenuLeft />}
        size="md"
      />

      <Text fontSize="3xl" color={textColor} fontWeight="semibold">
        ka-pi
      </Text>
      <ColorModeSwitcher />
    </Flex>
  )
}

Header.propTypes = {
  onOpen: PropTypes.func.isRequired,
}

export default Header
