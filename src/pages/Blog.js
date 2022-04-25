import { useParams } from 'react-router-dom'
import { Flex, Text } from '@chakra-ui/react'

function Blog() {
  const { cafeId, blogId } = useParams()

  return (
    <Flex direction="column">
      <Text>Cafe Id: {cafeId}</Text>
      <Text>Blog Id: {blogId}</Text>
    </Flex>
  )
}

export default Blog
