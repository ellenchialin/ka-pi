import { useState, useEffect } from 'react'
// prettier-ignore
import { Flex, Image, Text, IconButton, Divider, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Textarea, InputGroup, InputLeftElement, Input, ModalFooter, Button, useDisclosure } from '@chakra-ui/react'
import { RiReplyAllFill, RiAddFill } from 'react-icons/ri'
import { firebase } from '../../utils/firebase'

function Comment({ cafeId, commentId, userId, text, date }) {
  const [userInfo, setUserInfo] = useState({})
  const [newReply, setNewReply] = useState('')

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

  const submitReply = () => {
    console.log('Reply to comment: ', commentId)
    // cafeId, commentId, userId, text
    const repliedDetails = {
      cafeId,
      commentId,
      userId,
      text: newReply,
    }
    firebase.addReply(repliedDetails).then(() => console.log('Reply Added'))
  }

  return (
    <Flex w="100%" direction="column" my="2">
      <Flex w="100%" justify="space-between" align="center">
        <Flex align="center">
          <Image
            borderRadius="full"
            boxSize="50px"
            mr="2"
            src={userInfo.photo}
            alt={userInfo.name}
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
                value={newReply}
                onChange={e => setNewReply(e.target.value)}
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
                isDisabled={newReply === '' ? true : false}
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
      <Flex></Flex>
      <Divider mt="2" />
    </Flex>
  )
}

export default Comment
