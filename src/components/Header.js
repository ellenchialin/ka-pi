import { IconButton, Flex, Text, useColorModeValue } from '@chakra-ui/react'
import { ColorModeSwitcher } from '../ColorModeSwitcher'
import { CgMenuLeft } from 'react-icons/cg'

function Header({ onOpen }) {
  const bgColor = useColorModeValue('secondaryLight', 'primaryDark')
  const textColor = useColorModeValue('primaryDark', 'primaryLight')

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
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

export default Header
