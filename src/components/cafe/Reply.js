import { useState, useEffect } from 'react'
// prettier-ignore
import { Flex, Image, Text, AspectRatio, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react'
import { firebase } from '../../utils/firebase'

function Reply({ replyUserId, replyText, replyImage, replyDate }) {
  console.log('Reply user Id: ', replyUserId)

  const [userInfo, setUserInfo] = useState({})
  const convertedReplyDate = replyDate.toDate().toLocaleDateString()

  const {
    isOpen: isReplyPhotoOpen,
    onOpen: onReplyPhotoOpen,
    onClose: onReplyPhotoClose,
  } = useDisclosure()

  useEffect(() => {
    firebase.getUser(replyUserId).then(data => {
      setUserInfo(data)
    })
  }, [])

  return (
    <Flex w="80%" justify="space-between" align="center" alignSelf="flex-end">
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
        <Text fontSize="0.875rem" color="blue.500">
          {userInfo.name}
        </Text>
      </Flex>
      <Text color="blue.500" fontSize="0.875rem">
        {replyText}
      </Text>
      <Text color="blue.500" fontSize="0.875rem">
        {convertedReplyDate}
      </Text>
      {replyImage && (
        <>
          <AspectRatio w="100%" maxWidth="100px" ratio={1}>
            <Image
              src={replyImage}
              alt="留言照片"
              fit="cover"
              onClick={onReplyPhotoOpen}
              cursor="pointer"
            />
          </AspectRatio>

          <Modal
            size="full"
            isOpen={isReplyPhotoOpen}
            onClose={onReplyPhotoClose}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <ModalBody p="10">
                <Image src={replyImage} alt="留言照片" fit="cover" />
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      )}
    </Flex>
  )
}

export default Reply
