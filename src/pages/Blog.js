import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
// prettier-ignore
import { Flex, Text, Spinner, Heading, Avatar, Box } from '@chakra-ui/react'
import { firebase } from '../utils/firebase'
import ImageSlider from '../components/ImageSlider'

function Blog() {
  const [blog, setBlog] = useState({})
  const [convertedBlogDate, setConvertedBlogDate] = useState(null)
  const [blogAuthor, setBlogAuthor] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const { cafeId, blogId } = useParams()

  useEffect(() => {
    firebase
      .getBlog(cafeId, blogId)
      .then(blog => {
        setBlog(blog)
        setConvertedBlogDate(blog.createdAt.toDate().toLocaleDateString())

        firebase
          .getUser(blog.userId)
          .then(user => setBlogAuthor(user))
          .catch(error => {
            console.error(error)
            alert('無法取得食記作者資訊，請先確認網路連線，或通知網站開發人員')
          })
          .finally(() => setIsLoading(false))
      })
      .catch(error => {
        alert('暫無法取得食記資料，請先確認網路連線，或通知網站開發人員')
        console.error(error)
      })
  }, [])

  return (
    <Flex
      as="section"
      direction="column"
      align="center"
      position="relative"
      w="100%"
      minH="100vh"
    >
      {isLoading ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.600"
          siz="xl"
          mt="6"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        />
      ) : (
        <Flex direction="column">
          <Box mb="4">
            <ImageSlider slides={blog.images} />
          </Box>
          <Heading
            as="h1"
            size="2xl"
            color="gray.800"
            letterSpacing="widest"
            mb="3"
          >
            {blog.title}
          </Heading>
          <Flex justify="space-between" align="center" my="3" color="gray.500">
            <Flex align="center">
              <Avatar
                size="sm"
                name={blogAuthor.name}
                src={blogAuthor.photo}
                mr="3"
              />
              <Text>{blogAuthor.name}</Text>
            </Flex>
            <Text>{convertedBlogDate}</Text>
          </Flex>
          <Flex direction="column">
            <Text>{blog.content}</Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}

export default Blog
