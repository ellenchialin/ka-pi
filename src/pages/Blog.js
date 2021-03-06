import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
// prettier-ignore
import { Flex, Text, Heading, Avatar, Image, AspectRatio, useDisclosure } from '@chakra-ui/react'
import { Editor, EditorState, convertFromRaw } from 'draft-js'

import { api } from '../utils/api'
import { firebase } from '../utils/firebase'
import CustomSpinner from '../components/shared/CustomSpinner'
import CustomBreadcrumb from '../components/shared/CustomBreadcrumb'
import AlertModal from '../components/shared/AlertModal'

function Blog() {
  const [cafeName, setCafeName] = useState(null)
  const [blog, setBlog] = useState({})
  const [convertedBlogDate, setConvertedBlogDate] = useState(null)
  const [blogAuthor, setBlogAuthor] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const { cafeId, blogId } = useParams()

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

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
            onAlertOpen()
            console.error(error)
          })

        api
          .getAllCafes()
          .then(cafes => {
            const cafe = cafes.find(item => item.id === cafeId)
            setCafeName(cafe.name)
          })
          .catch(error => {
            onAlertOpen()
            console.error(error)
          })
          .finally(() => setIsLoading(false))
      })
      .catch(error => {
        onAlertOpen()
        console.error(error)
      })
  }, [])

  return (
    <Flex
      as="section"
      direction="column"
      align="center"
      w="100%"
      maxW="800px"
      h="100%"
    >
      <AlertModal
        isAlertOpen={isAlertOpen}
        onAlertClose={onAlertClose}
        alertHeader="Oops! 暫無法取得資料"
        alertBody="請確認網路連線並重新操作，多次失敗請聯繫開發人員 chialin76@gmail.com "
      />
      {isLoading ? (
        <CustomSpinner />
      ) : (
        <Flex direction="column" h="100%" w="100%">
          <CustomBreadcrumb
            secondDestination={{
              secondUrl: `/cafe/${cafeId}`,
              secondText: cafeName,
            }}
            currentDestinationText={blog.title}
          />
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
