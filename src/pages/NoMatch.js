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
        We can't seem to find the page you're looking for.
      </Text>
      <Button onClick={handleClick}>Back Home</Button>
    </Flex>
  )
}

export default NoMatch
