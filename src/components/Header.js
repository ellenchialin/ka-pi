import React from 'react'
import { IconButton, Flex, Text } from '@chakra-ui/react'
import { ColorModeSwitcher } from '../ColorModeSwitcher'
import { CgMenuLeft } from 'react-icons/cg'

function Header({ onOpen }) {
  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      w="full"
      px="4"
      bg="gray.800"
      borderBottomWidth="1px"
      borderColor="gray.700"
      h="14"
      display={{ base: 'flex', md: 'none' }}
    >
      <IconButton
        aria-label="主選單"
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        icon={<CgMenuLeft />}
        size="md"
      />

      <Text fontSize="3xl" color="white" fontWeight="semibold">
        ka-pi
      </Text>
      <ColorModeSwitcher />
    </Flex>
  )
}

export default Header
