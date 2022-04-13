import { Flex, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

function NoMatch() {
  return (
    <Flex direction="column" align="center">
      <Text>此頁面不存在</Text>
      <Link to="/">Back Home</Link>
    </Flex>
  )
}

export default NoMatch
