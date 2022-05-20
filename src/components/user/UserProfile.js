import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
// prettier-ignore
import { Flex, Text, IconButton, Button, Input, Avatar, VStack, useDisclosure } from '@chakra-ui/react'
import { RiAddFill } from 'react-icons/ri'

import EditableText from './EditableText'
import AlertModal from '../shared/AlertModal'
import { firebase } from '../../utils/firebase'
import { useAuth } from '../../contexts/AuthContext'

function UserProfile({ userInfo }) {
  const [userPhotoUrl, setUserPhotoUrl] = useState(null)
  const [updatedUserName, setUpdatedUserName] = useState('')

  const nameRef = useRef()
  const fileRef = useRef()
  const navigate = useNavigate()
  const { currentUser, signout } = useAuth()

  const {
    isOpen: isUploadAlertOpen,
    onOpen: onUploadAlertOpen,
    onClose: onUploadAlertClose,
  } = useDisclosure()

  const handlePhotoChange = file => {
    if (file) {
      firebase
        .getUserPhotoUrl(currentUser.uid, file)
        .then(url => setUserPhotoUrl(url))
        .catch(error => {
          onUploadAlertOpen()
          console.error(error.message)
        })
    }
  }

  const updateUserName = newName => {
    setUpdatedUserName(newName)
    firebase.updateUserName(currentUser.uid, newName)
  }

  const handleSignout = () => {
    signout().then(() => navigate('/auth'))
  }

  return (
    <VStack w="full" align="center" spacing="20px" mb="6">
      <Flex align="center" position="relative">
        <Avatar
          src={userPhotoUrl ? userPhotoUrl : userInfo.photo}
          name={userInfo.name}
          size="xl"
          showBorder={false}
          referrerPolicy="no-referrer"
        />
        <IconButton
          colorScheme="yellow"
          aria-label="上傳頭貼"
          fontSize="20px"
          icon={<RiAddFill color="#121212" />}
          isRound
          size="xs"
          position="absolute"
          bottom="0"
          right="10px"
          onClick={() => fileRef.current.click()}
        />
        <Input
          ref={fileRef}
          type="file"
          name="userPhoto"
          accept="image/*"
          onChange={e => handlePhotoChange(e.target.files[0])}
          hidden
        />
      </Flex>
      <EditableText
        text={updatedUserName}
        type="input"
        placeholder={userInfo.name}
        childRef={nameRef}
        ariaLabel="更改顯示名稱"
      >
        <Input
          ref={nameRef}
          w="150px"
          type="text"
          name="username"
          value={updatedUserName}
          placeholder={userInfo.name}
          fontSize={{ base: '18px', md: '20px' }}
          onChange={e => updateUserName(e.target.value)}
        />
      </EditableText>
      <Text fontSize={{ base: '16px', md: '18px' }} fontWeight="semibold">
        {userInfo.email}
      </Text>
      <Button variant="auth-buttons" w="113px" onClick={handleSignout}>
        登出
      </Button>

      <AlertModal
        isAlertOpen={isUploadAlertOpen}
        onAlertClose={onUploadAlertClose}
        alertHeader="Oops! 頭貼上傳失敗"
        alertBody="請確認網路連線並重新操作，或聯繫開發人員 chialin76@gmail.com"
      />
    </VStack>
  )
}

UserProfile.propTypes = {
  userInfo: PropTypes.shape({
    photo: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
}

export default UserProfile
