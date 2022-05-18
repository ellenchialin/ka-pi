import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
// prettier-ignore
import { Flex, Image, Text, AspectRatio, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, Box, useColorModeValue, HStack, Avatar } from '@chakra-ui/react'

import { firebase } from '../../utils/firebase'
import AlertModal from '../AlertModal'

function Reply({ reply }) {
  const { userId: replyUserId, repliedAt, text, image } = reply
  const [userInfo, setUserInfo] = useState({})
  const convertedReplyDate = repliedAt.toDate().toLocaleDateString()

  const {
    isOpen: isReplyPhotoOpen,
    onOpen: onReplyPhotoOpen,
    onClose: onReplyPhotoClose,
  } = useDisclosure()

  const {
    isOpen: isGetUserAlertOpen,
    onOpen: onGetUserAlertOpen,
    onClose: onGetUserAlertClose,
  } = useDisclosure()

  useEffect(() => {
    firebase
      .getUser(replyUserId)
      .then(data => {
        setUserInfo(data)
      })
      .catch(error => {
        onGetUserAlertOpen()
        console.error(error)
      })
  }, [])

  return (
    <HStack w="100%" pl="16" spacing="0" mt="1">
      <Avatar
        size="md"
        name={userInfo.name}
        src={userInfo.photo}
        alignSelf="flex-start"
      />
      <Flex w="100%" direction="column">
        <Box
          w="100%"
          maxW="460px"
          bg={useColorModeValue('gray.100', 'secondaryLight')}
          borderRadius="xl"
          p="4"
          mb="2"
          ml="4"
        >
          <Text color="primaryDark" fontWeight="bold">
            {userInfo.name}
          </Text>
          <Text color="primaryDark">{text}</Text>
          {image && (
            <>
              <AspectRatio w="100%" maxWidth="100px" mt="2" ratio={1}>
                <Image
                  src={image}
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
                        src={image}
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
        <Text fontSize="0.75rem" ml="4">
          {convertedReplyDate}
        </Text>
      </Flex>

      <AlertModal
        isAlertOpen={isGetUserAlertOpen}
        onAlertClose={onGetUserAlertClose}
        alertHeader="Oops! 暫無法取得回覆資訊"
        alertBody="請確認網路連線並重新操作，或聯繫開發人員 chialin76@gmail.com"
      />
    </HStack>
  )
}

Reply.propTypes = {
  reply: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    repliedAt: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }),
}

export default Reply
