import { useState, useEffect } from 'react'
// prettier-ignore
import { Flex, Image, Text } from '@chakra-ui/react'
import { firebase } from '../../utils/firebase'

function Reply({ replyUserId, replyText, replyDate }) {
  console.log('Reply user Id: ', replyUserId)

  const [userInfo, setUserInfo] = useState({})
  const convertedReplyDate = replyDate.toDate().toLocaleDateString()

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
    </Flex>
  )
}

export default Reply
