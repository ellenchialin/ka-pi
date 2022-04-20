import { useState, useEffect } from 'react'
// prettier-ignore
import { Flex, Image, Text, IconButton, Divider, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Textarea, InputGroup, InputLeftElement, Input, ModalFooter, Button, useDisclosure } from '@chakra-ui/react'
import { RiReplyAllFill, RiAddFill } from 'react-icons/ri'
import { firebase } from '../../utils/firebase'
import Reply from './Reply'

function Comment({ cafeId, commentId, userId, text, date }) {
  const [userInfo, setUserInfo] = useState({})
  const [newReplyText, setNewReplyText] = useState('')
  const [replyList, setReplyList] = useState([])

  const {
    isOpen: isReplyOpen,
    onOpen: onReplyOpen,
    onClose: onReplyClose,
  } = useDisclosure()

  useEffect(() => {
    firebase.getUser(userId).then(data => {
      setUserInfo(data)
      // console.log('Current User info: ', data)
    })
  }, [])

  useEffect(() => {
    firebase.getReplyList(cafeId, commentId).then(list => {
      console.log('Reply List: ', list)
      setReplyList(list)
    })
  }, [])

  const submitReply = () => {
    console.log('Reply to comment: ', commentId)
    if (!userId) {
      alert('請先登入才可以回覆留言')
      return
    }

    const repliedDetails = {
      cafeId,
      commentId,
      userId,
      text: newReplyText,
    }

    firebase.addReply(repliedDetails).then(() => {
      console.log('Reply Added')
      setNewReplyText('')
      onReplyClose()
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
          onClick={onReplyOpen}
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
        <Text>{date}</Text>
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
