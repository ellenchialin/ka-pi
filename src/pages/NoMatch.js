import { Flex, Text, Button, Icon } from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'

function NoMatch() {
  const navigate = useNavigate()

  const handleClick = () => navigate('/')

  return (
    <Flex w="full" h="100%" direction="column" align="center" justify="center">
      <Icon as={WarningIcon} boxSize={{ base: '28px', md: '40px' }} />
      <Text fontSize={{ base: '28px', md: '40px' }} fontWeight="bold">
        Oops
      </Text>
      <Text mb="4" fontSize={{ base: '18px', md: '24px' }}>
        這個頁面不存在
      </Text>
      <Button onClick={handleClick}>回到首頁</Button>
    </Flex>
  )
}

export default NoMatch
