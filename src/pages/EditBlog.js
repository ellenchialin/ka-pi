import { useParams } from 'react-router-dom'
import { Flex, Text } from '@chakra-ui/react'
import TextEditor from '../components/TextEditor'

function EditBlog() {
  const { cafeId, blogId } = useParams()

  return (
    <Flex direction="column">
      <Text>Edit Page</Text>
      <Text>Cafe Id: {cafeId}</Text>
      <Text>Blog Id: {blogId}</Text>
      <TextEditor />
    </Flex>
  )
}

export default EditBlog
