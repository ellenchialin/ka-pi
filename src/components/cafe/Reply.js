import { useState, useEffect } from 'react'
// prettier-ignore
import { Flex, Image, Text, AspectRatio, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, Box, useColorModeValue, HStack } from '@chakra-ui/react'
import { firebase } from '../../utils/firebase'

function Reply({ replyUserId, replyText, replyImage, replyDate }) {
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
    <HStack w="100%" pl="12" spacing="0" mt="1">
      <Image
        borderRadius="full"
        boxSize="35px"
        mr="2"
        alignSelf="flex-start"
        src={userInfo.photo}
        alt={userInfo.name}
        objectFit="cover"
        fallbackSrc="https://images.unsplash.com/photo-1639628735078-ed2f038a193e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
      />
      <Flex w="100%" direction="column">
        <Box
          w="100%"
          maxW="460px"
          bg={useColorModeValue('gray.100', 'secondaryLight')}
          borderRadius="xl"
          p="4"
          mb="2"
        >
          <Text color="primaryDark">{replyText}</Text>
          {replyImage && (
            <>
              <AspectRatio w="100%" maxWidth="100px" mt="2" ratio={1}>
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
                    <AspectRatio h="85vh" _before={{ pb: '0' }}>
                      <Image
                        src={replyImage}
                        alt="留言照片"
                        fit="cover"
                        align="center"
                      />
                    </AspectRatio>
                  </ModalBody>
                </ModalContent>
              </Modal>
            </>
          )}
        </Box>
        <Text fontSize="0.75rem">{convertedReplyDate}</Text>
      </Flex>
    </HStack>
  )
}

export default Reply
