import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
// prettier-ignore
import { Flex, Input, Image, Button, AspectRatio, Text, HStack, useDisclosure } from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'
import { RiAddFill } from 'react-icons/ri'
import { firebase } from '../utils/firebase'
import { useAuth } from '../contexts/AuthContext'
import TextEditor from '../components/TextEditor'
import AlertModal from '../components/AlertModal'

function EditBlog() {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogContent, setBlogContent] = useState('')
  const [coverPhotoUrl, setCoverPhotoUrl] = useState('')
  const [disablePublish, setDisablePublish] = useState(true)

  const titleInputRef = useRef(null)
  const coverPhototRef = useRef()
  const { currentUser } = useAuth()
  const { cafeId } = useParams()
  const navigate = useNavigate()

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  useEffect(() => {
    titleInputRef.current.focus()
  }, [])

  useEffect(() => {
    blogTitle && blogContent.blocks[0].text !== '' && coverPhotoUrl
      ? setDisablePublish(false)
      : setDisablePublish(true)
  }, [blogTitle, blogContent, coverPhotoUrl])

  const handlePhotoUpload = e => {
    if (e.target.files[0]) {
      firebase
        .getBlogPhotoUrl(e.target.files[0])
        .then(url => setCoverPhotoUrl(url))
        .catch(error => {
          onAlertOpen()
          console.error(error)
        })
    }
  }

  const handlePublishBlog = () => {
    const blogData = {
      title: blogTitle,
      content: blogContent,
      image: coverPhotoUrl,
    }

    firebase.uploadBlog(cafeId, currentUser.uid, blogData).then(blogId => {
      navigate(`/cafe/${cafeId}/blog/${blogId}`)
    })
  }

  return (
    <Flex direction="column" w="100%" h="100%" maxWidth="800px">
      <Flex mb="6" maxWidth="800px" position="relative">
        <AspectRatio w="100%" maxWidth="800px" ratio={21 / 9}>
          <Image
            src={coverPhotoUrl ? coverPhotoUrl : ''}
            alt="食記封面照"
            fit="cover"
            rounded="lg"
            maxW="800px"
            fallbackSrc="https://via.placeholder.com/800x470?text=blog+cover"
          />
        </AspectRatio>
        <Button
          colorScheme="blackAlpha"
          aria-label="上傳封面照"
          leftIcon={<RiAddFill />}
          size="xs"
          position="absolute"
          top="20px"
          right="20px"
          onClick={() => coverPhototRef.current.click()}
        >
          上傳
        </Button>
        <Input
          ref={coverPhototRef}
          type="file"
          name="coverPhoto"
          accept="image/*"
          onChange={e => handlePhotoUpload(e)}
          hidden
        />
      </Flex>
      <Input
        variant="filled"
        placeholder="Blog Title"
        mb="6"
        size="lg"
        value={blogTitle}
        onChange={e => setBlogTitle(e.target.value)}
        ref={titleInputRef}
        isRequired
      />
      <TextEditor setBlogContent={setBlogContent} />

      <HStack spacing="2" mb="6" alignSelf="flex-end">
        <WarningIcon />
        <Text fontSize="sm">發佈前，請確認圖片、標題與內容皆需完整填入</Text>
      </HStack>

      <Button
        alignSelf="center"
        w="150px"
        onClick={handlePublishBlog}
        isDisabled={disablePublish}
      >
        發佈
      </Button>
      <AlertModal
        isAlertOpen={isAlertOpen}
        onAlertClose={onAlertClose}
        alertHeader="圖片上傳失敗"
        alertBody="請確認網路連線並重新操作；如連續失敗請通知網站開發人員 chialin76@gmail.com "
      />
    </Flex>
  )
}

export default EditBlog
