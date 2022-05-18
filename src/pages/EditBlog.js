import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
// prettier-ignore
import { Flex, Input, Image, Button, AspectRatio, Text, HStack, useDisclosure } from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'
import { RiAddFill } from 'react-icons/ri'

import { firebase } from '../utils/firebase'
import { useAuth } from '../contexts/AuthContext'
import TextEditor from '../components/editor/TextEditor'
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
    isOpen: isPublishAlertOpen,
    onOpen: onPublishAlertOpen,
    onClose: onPublishAlertClose,
  } = useDisclosure()

  const {
    isOpen: isInvalidContentAlertOpen,
    onOpen: onInvalidContentAlertOpen,
    onClose: onInvalidContentAlertClose,
  } = useDisclosure()

  const {
    isOpen: isUploadAlertOpen,
    onOpen: onUploadAlertOpen,
    onClose: onUploadAlertClose,
  } = useDisclosure()

  useEffect(() => {
    titleInputRef.current.focus()
  }, [])

  useEffect(() => {
    blogTitle && blogContent !== '' && coverPhotoUrl
      ? setDisablePublish(false)
      : setDisablePublish(true)
  }, [blogTitle, blogContent, coverPhotoUrl])

  const handlePhotoUpload = file => {
    if (file) {
      firebase
        .getBlogPhotoUrl(file)
        .then(url => setCoverPhotoUrl(url))
        .catch(error => {
          onUploadAlertOpen()
          console.error(error)
        })
    }
  }

  const handlePublishBlog = () => {
    if (blogContent.blocks[0].text === '') {
      onInvalidContentAlertOpen()
      return
    }

    const blogData = {
      title: blogTitle,
      content: blogContent,
      image: coverPhotoUrl,
    }

    firebase
      .publishBlog(cafeId, currentUser.uid, blogData)
      .then(blogId => {
        navigate(`/cafe/${cafeId}/blog/${blogId}`)
      })
      .catch(error => {
        onPublishAlertOpen()
        console.error(error)
      })
  }

  const handleDiscardBlog = () => {
    navigate(`/cafe/${cafeId}`)
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
          onChange={e => handlePhotoUpload(e.target.files[0])}
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

      <HStack spacing="2" mb="10" alignSelf="flex-end">
        <WarningIcon />
        <Text fontSize="sm">發佈前，請確認圖片、標題與內容皆需完整填入</Text>
      </HStack>

      <HStack spacing="6" alignSelf="center">
        <Button alignSelf="center" w="150px" onClick={handleDiscardBlog}>
          取消
        </Button>

        <Button
          alignSelf="center"
          w="150px"
          onClick={handlePublishBlog}
          isDisabled={disablePublish}
        >
          發佈
        </Button>
      </HStack>
      <AlertModal
        isAlertOpen={isUploadAlertOpen}
        onAlertClose={onUploadAlertClose}
        alertHeader="圖片上傳失敗"
        alertBody="請確認網路連線並重新操作；如連續失敗請通知網站開發人員 chialin76@gmail.com "
      />
      <AlertModal
        isAlertOpen={isInvalidContentAlertOpen}
        onAlertClose={onInvalidContentAlertClose}
        alertHeader="發佈失敗"
        alertBody="請確認圖片、標題與內容皆不可為空。"
      />
      <AlertModal
        isAlertOpen={isPublishAlertOpen}
        onAlertClose={onPublishAlertClose}
        alertHeader="發佈失敗"
        alertBody="請確認網路連線並重新操作；如連續失敗請通知網站開發人員 chialin76@gmail.com "
      />
    </Flex>
  )
}

export default EditBlog
