import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
// prettier-ignore
import { Flex, Text, Input, Image, Button, AspectRatio, Textarea } from '@chakra-ui/react'
import { RiAddFill } from 'react-icons/ri'
import { firebase } from '../utils/firebase'
import TextEditor from '../components/TextEditor'

function EditBlog() {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogContent, setBlogContent] = useState('')
  const [coverPhotoUrl, setCoverPhotoUrl] = useState('')

  const titleInputRef = useRef(null)
  const coverPhototRef = useRef()
  const { cafeId, blogId } = useParams()
  const navigate = useNavigate()

  console.log(`Cafe Id: ${cafeId}`)
  console.log(`Blog Id: ${blogId}`)

  useEffect(() => {
    titleInputRef.current.focus()
  }, [])

  const handlePhotoUpload = e => {
    if (e.target.files[0]) {
      firebase
        .getBlogPhotoUrl(cafeId, blogId, e.target.files[0])
        .then(url => setCoverPhotoUrl(url))
        .catch(error => {
          alert('圖片上傳失敗，請重新操作一次；如連續失敗請通知網站開發人員')
          console.error(error)
        })
    }
  }

  const handleUploadBlog = () => {
    const data = {
      title: blogTitle,
      content: blogContent,
      image: coverPhotoUrl,
    }

    firebase
      .uploadBlog(cafeId, blogId, data)
      .then(() => navigate(`/cafe/${cafeId}/blog/${blogId}`))
  }

  return (
    <Flex direction="column" w="100%" maxWidth="800px">
      <Flex mb="6" maxWidth="800px" position="relative">
        <AspectRatio w="100%" maxWidth="800px" ratio={21 / 9}>
          <Image
            src={coverPhotoUrl ? coverPhotoUrl : ''}
            alt="食記封面照"
            fit="cover"
            maxW="800px"
            fallbackSrc="https://via.placeholder.com/800x470?text=cover+photo"
          />
        </AspectRatio>
        <Button
          colorScheme="blackAlpha"
          aria-label="上傳封面照"
          leftIcon={<RiAddFill />}
          size="xs"
          position="absolute"
          top="10px"
          right="10px"
          onClick={() => coverPhototRef.current.click()}
        >
          Upload
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
        value={blogTitle}
        onChange={e => setBlogTitle(e.target.value)}
        ref={titleInputRef}
        isRequired
      />
      <Textarea
        placeholder="Share your experience"
        size="lg"
        value={blogContent}
        onChange={e => setBlogContent(e.target.value)}
        rows={15}
        height="auto"
        isRequired
      />
      <Button alignSelf="center" w="150px" onClick={handleUploadBlog}>
        Publish
      </Button>

      <TextEditor />
    </Flex>
  )
}

export default EditBlog
