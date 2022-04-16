import { useState, useEffect } from 'react'
// prettier-ignore
import { Flex, Image, Text, IconButton, Divider } from '@chakra-ui/react'
import { RiReplyAllFill } from 'react-icons/ri'
import { firebase } from '../../utils/firebase'

function Comment({ userId, text, date }) {
  const [userInfo, setUserInfo] = useState({})

  useEffect(() => {
    firebase.getUser(userId).then(data => {
      setUserInfo(data)
      console.log(data)
    })
  }, [])

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
        />
      </Flex>
      <Flex justify="space-between" fontSize="0.875rem">
        <Text>{text}</Text>
        <Text>{date}</Text>
      </Flex>
      <Divider mt="2" />
    </Flex>
  )
}

export default Comment
