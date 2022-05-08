import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
// prettier-ignore
import { Flex, Text, Spinner, Heading, Avatar, Box, Image, AspectRatio, Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink, } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { Editor, EditorState, convertFromRaw } from 'draft-js'
import { api } from '../utils/api'
import { firebase } from '../utils/firebase'
// import ImageSlider from '../components/ImageSlider'

function Blog() {
  const [cafeName, setCafeName] = useState(null)
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

        api
          .getAllCafes()
          .then(cafes => {
            const cafe = cafes.find(item => item.id === cafeId)
            setCafeName(cafe.name)
          })
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
      maxW="800px"
      h="100%"
    >
      {isLoading ? (
        <Spinner
          thickness="5px"
          speed="0.65s"
          emptyColor="gray.200"
          color="teal"
          size="lg"
          mt="6"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        />
      ) : (
        <Flex direction="column" h="100%" w="100%">
          <Breadcrumb
            spacing="2px"
            separator={<ChevronRightIcon color="secondaryLight" />}
            mb="4"
            fontSize="14px"
          >
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to="/" isExternal>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to={`/cafe/${cafeId}`} isExternal>
                {cafeName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink
                cursor="not-allowed"
                color="secondaryLight"
                textDecoration="underline"
              >
                {blog.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          {/*<ImageSlider slides={blog.images} />*/}
          <AspectRatio w="100%" ratio={21 / 9}>
            <Image
              src={blog.image}
              alt="食記照片"
              rounded="lg"
              fit="cover"
              w="100%"
            />
          </AspectRatio>
          <Heading as="h1" size="2xl" letterSpacing="widest" mt="6" mb="3">
            {blog.title}
          </Heading>
          <Flex justify="space-between" align="center" my="3">
            <Flex align="center">
              <Avatar
                size="md"
                name={blogAuthor.name}
                src={blogAuthor.photo}
                mr="3"
              />
              <Text>{blogAuthor.name}</Text>
            </Flex>
            <Text>{convertedBlogDate}</Text>
          </Flex>
          <Flex direction="column">
            <Editor
              readOnly
              editorState={EditorState.createWithContent(
                convertFromRaw(blog.content)
              )}
            />
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}

export default Blog
