import { useState, useEffect, useRef } from 'react'
// prettier-ignore
import { Flex, Image, Text, IconButton, Divider, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Textarea, InputGroup, InputLeftElement, Input, ModalFooter, Button, useDisclosure, AspectRatio } from '@chakra-ui/react'
import { RiReplyAllFill, RiAddFill } from 'react-icons/ri'
import { firebase } from '../../utils/firebase'
import Reply from './Reply'

function Comment({
  currentUser,
  cafeId,
  commentId,
  commentUserId,
  text,
  date,
  image,
}) {
  const [userInfo, setUserInfo] = useState({})
  const [newReplyText, setNewReplyText] = useState('')
  const [replyPhotoUrl, setReplyPhotoUrl] = useState('')
  const [replyList, setReplyList] = useState([])

  const replyPhotoRef = useRef()

  const {
    isOpen: isCommentPhotoOpen,
    onOpen: onCommentPhotoOpen,
    onClose: onCommentPhotoClose,
  } = useDisclosure()

  const {
    isOpen: isReplyOpen,
    onOpen: onReplyOpen,
    onClose: onReplyClose,
  } = useDisclosure()

  useEffect(() => {
    firebase.getUser(commentUserId).then(data => {
      setUserInfo(data)
    })
  }, [])

  useEffect(() => {
    firebase.getReplyList(cafeId, commentId).then(list => {
      // console.log('Reply List: ', list)
      setReplyList(list)
    })
  }, [])

  const handleReplyPhotoUpload = e => {
    if (e.target.files[0]) {
      firebase
        .getReplyPhotoUrl(e.target.files[0])
        .then(url => setReplyPhotoUrl(url))
        .catch(error => {
          alert('圖片上傳失敗，請重新操作一次；如連續失敗請通知網站開發人員')
          console.error(error)
        })
    }
  }

  const handleClickReply = () => {
    if (!currentUser) {
      alert('請先登入才可以回覆留言')
      return
    }
    onReplyOpen()
  }

  const submitReply = () => {
    const repliedDetails = {
      cafeId,
      commentId,
      userId: currentUser.uid,
      image: replyPhotoUrl,
      text: newReplyText,
    }

    firebase.addReply(repliedDetails).then(() => {
      console.log('Reply Added')
      setNewReplyText('')
      onReplyClose()

      firebase.getReplyList(cafeId, commentId).then(list => {
        console.log('Latest Reply List: ', list)
        setReplyList(list)
      })
    })
  }

  return (
    <Flex w="100%" direction="column" my="2">
      <Flex w="100%" justify="space-between" align="center">
        <Flex align="center">
          <Image
            borderRadius="full"
            boxSize="35px"
            mr="2"
            src={userInfo.photo}
            alt={userInfo.name}
            objectFit="cover"
          />
          <Text fontSize="0.875rem">{userInfo.name}</Text>
        </Flex>
        <IconButton
          icon={<RiReplyAllFill />}
          colorScheme="blackAlpha"
          fontSize="20px"
          variant="ghost"
          aria-label="回覆留言"
          onClick={handleClickReply}
        />
        <Modal
          isOpen={isReplyOpen}
          onClose={onReplyClose}
          size="md"
          isCentered={true}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <Textarea
                value={newReplyText}
                onChange={e => setNewReplyText(e.target.value)}
                placeholder="Leave your reply here..."
                size="md"
                mt="10"
                mb="6"
              />
              <Flex mb="6">
                <AspectRatio w="100%" maxWidth="100px" ratio={1}>
                  <Image
                    src={replyPhotoUrl ? replyPhotoUrl : ''}
                    alt="留言照片"
                    fit="cover"
                    maxW="100px"
                    fallbackSrc="https://via.placeholder.com/100?text=add+photo"
                  />
                </AspectRatio>
                <Button
                  colorScheme="blackAlpha"
                  aria-label="上傳留言照"
                  leftIcon={<RiAddFill />}
                  size="xs"
                  ml="2"
                  mt="auto"
                  onClick={() => replyPhotoRef.current.click()}
                >
                  Upload
                </Button>
                <Input
                  ref={replyPhotoRef}
                  type="file"
                  name="coverPhoto"
                  accept="image/*"
                  onChange={e => handleReplyPhotoUpload(e)}
                  hidden
                />
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button
                variant="ghost"
                isDisabled={newReplyText === '' ? true : false}
                onClick={submitReply}
              >
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
      <Flex justify="space-between" fontSize="0.875rem">
        <Text>{text}</Text>
        <Text>{date}</Text>
      </Flex>
      {image && (
        <>
          <AspectRatio w="100%" maxWidth="100px" ratio={1}>
            <Image
              src={image}
              alt="留言照片"
              fit="cover"
              onClick={onCommentPhotoOpen}
              cursor="pointer"
            />
          </AspectRatio>

          <Modal
            size="full"
            isOpen={isCommentPhotoOpen}
            onClose={onCommentPhotoClose}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <ModalBody p="10">
                <Image src={image} alt="留言照片" fit="cover" />
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      )}
      {/* Replies */}
      {replyList.length > 0 &&
        replyList.map(reply => (
          <Reply
            key={reply.text}
            replyUserId={reply.userId}
            replyText={reply.text}
            replyImage={reply.image}
            replyDate={reply.repliedAt}
          />
        ))}
      <Divider mt="2" />
    </Flex>
  )
}

export default Comment
