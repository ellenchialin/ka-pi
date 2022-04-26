import { useState, useEffect } from 'react'
// prettier-ignore
import { Flex, Image, Text, IconButton, Divider, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Textarea, InputGroup, InputLeftElement, Input, ModalFooter, Button, useDisclosure } from '@chakra-ui/react'
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
}) {
  // console.log('In Comment Page Current User: ', currentUser)

  const [userInfo, setUserInfo] = useState({})
  const [newReplyText, setNewReplyText] = useState('')
  const [replyList, setReplyList] = useState([])
  console.log(date)
  const convertedCommentDate = date.toDate().toLocaleDateString()

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
      console.log('Reply List: ', list)
      setReplyList(list)
    })
  }, [])

  const handleClickReply = () => {
    if (!currentUser) {
      alert('請先登入才可以回覆留言')
      return
    }
    onReplyOpen()
  }

  const submitReply = () => {
    console.log('Reply to comment: ', commentId)

    const repliedDetails = {
      cafeId,
      commentId,
      userId: currentUser.uid,
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
            fallbackSrc="https://images.unsplash.com/photo-1639628735078-ed2f038a193e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
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
              <InputGroup>
                <InputLeftElement children={<RiAddFill color="gray.300" />} />
                <Input
                  type="file"
                  border="none"
                  name="image"
                  accept="image/*"
                />
              </InputGroup>
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
        <Text>{convertedCommentDate}</Text>
      </Flex>
      {/* Replies */}
      {replyList.length > 0 &&
        replyList.map(reply => (
          <Reply
            key={reply.text}
            replyUserId={reply.userId}
            replyText={reply.text}
            replyDate={reply.repliedAt}
          />
        ))}
      <Divider mt="2" />
    </Flex>
  )
}

export default Comment
