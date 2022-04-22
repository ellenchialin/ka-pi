import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
// prettier-ignore
import { Flex, Heading, Image, Text, Spinner, IconButton, Button, ButtonGroup, useEditableControls, Editable, EditablePreview, EditableInput, Input, InputGroup, InputRightElement  } from '@chakra-ui/react'
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons'
import { AiOutlineMessage } from 'react-icons/ai'
import { firebase } from '../utils/firebase'
import Map from '../components/map/Map'
import CafeCard from '../components/cafe/CafeCard'
import usePageTracking from '../usePageTracking'
import { useAuth } from '../contexts/AuthContext'
import useUpdateEffect from '../hooks/useUpdateEffect'

function EditableText({
  text,
  type,
  placeholder,
  children,
  childRef,
  ...props
}) {
  const [isEditing, setEditing] = useState(false)

  useEffect(() => {
    if (childRef && childRef.current && isEditing === true) {
      childRef.current.focus()
    }
  }, [isEditing, childRef])

  return (
    <Flex {...props}>
      {isEditing ? (
        <div onBlur={() => setEditing(false)}>{children}</div>
      ) : (
        <Flex align="center">
          <Text fontSize="xl" fontWeight="bold" mr="3">
            {text || placeholder}
          </Text>
          <IconButton
            aria-label="更改顯示名稱"
            icon={<EditIcon />}
            size="sm"
            onClick={() => setEditing(true)}
          />
        </Flex>
      )}
    </Flex>
  )
}

function User() {
  usePageTracking()

  const [userLatitude, setUserLatitude] = useState(null)
  const [userLongitude, setUserLongitude] = useState(null)
  const [userInfo, setUserInfo] = useState({})
  const [updatedUserName, setUpdatedUserName] = useState('')
  const [savedCafes, setSavedCafes] = useState([])
  const [updatedCafeList, setUpdatedCafeList] = useState([])
  const [canDeleteCafe] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const nameRef = useRef()

  const { currentUser, signout } = useAuth()

  // console.log('Current User in user page from context: ', currentUser.uid)

  const navigate = useNavigate()

  useEffect(() => {
    if (!navigator.geolocation) {
      alert('目前使用的瀏覽器版本不支援取得當前位置 😰 ')
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        setUserLatitude(position.coords.latitude)
        setUserLongitude(position.coords.longitude)
      },
      () => {
        alert('請開啟允許取得當前位置，以獲得附近咖啡廳地圖 ☕️ ')
      }
    )
  }, [])

  const getFavCafes = cafesId => {
    fetch('https://ka-pi-server.herokuapp.com/allcafes')
      .then(res => res.json())
      .then(data => {
        const cafeList = data.filter(cafe => {
          return cafesId.some(id => {
            return id === cafe.id
          })
        })
        setSavedCafes(cafeList)
      })
      .catch(error =>
        alert('無法取得咖啡廳資料庫，請確認網路連線，或聯繫開發人員')
      )
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    firebase
      .getUser(currentUser.uid)
      .then(data => {
        console.log('Get user data: ', data)
        setUserInfo(data)
        getFavCafes(data.favCafes)
      })
      .catch(error => alert('無法取得個人資訊，請確認網路連線，或聯繫開發人員'))
  }, [])

  const handleSignout = () => {
    signout().then(() => navigate('/'))
  }

  const deleteCafe = deletedCafeId => {
    const updatedList = savedCafes
      .filter(cafe => cafe.id !== deletedCafeId)
      .map(cafe => cafe.id)

    // console.log('Updated cafe id List: ', updatedList)

    setUpdatedCafeList(updatedList)
    getFavCafes(updatedList)
    firebase.deleteSavedCafe(currentUser.uid, deletedCafeId)
  }

  const updateUserName = e => {
    setUpdatedUserName(e.target.value)
    firebase.updateUserName(currentUser.uid, e.target.value)
  }

  return (
    <Flex direction="column" position="relative">
      {isLoading ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.600"
          siz="xl"
          mt="6"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        />
      ) : (
        <>
          <Flex w="100%" align="center" justify="space-between">
            <Image
              borderRadius="full"
              boxSize="90px"
              objectFit="cover"
              src={userInfo.photo}
              alt={userInfo.name}
              fallbackSrc="https://images.unsplash.com/photo-1639628735078-ed2f038a193e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
            />
            <IconButton
              colorScheme="blackAlpha"
              aria-label="查看訊息"
              fontSize="20px"
              icon={<AiOutlineMessage />}
              isRound
            />
          </Flex>
          <EditableText
            text={updatedUserName}
            type="input"
            placeholder={userInfo.name}
            childRef={nameRef}
          >
            <Input
              ref={nameRef}
              type="text"
              name="username"
              value={updatedUserName}
              placeholder={userInfo.name}
              onChange={e => updateUserName(e)}
            />
          </EditableText>
          <Text>{userInfo.email}</Text>
          <Text>
            共蒐藏 {savedCafes.length > 0 ? savedCafes.length : 0} 間咖啡廳
          </Text>
          <Flex
            w="100%"
            wrap="wrap"
            justifyContent="space-between"
            alignItems="flex-start"
            as="section"
          >
            {userLatitude && userLongitude && (
              <>
                <Map
                  userLatitude={userLatitude}
                  userLongitude={userLongitude}
                  cafes={savedCafes}
                />

                {savedCafes.map(cafe => (
                  <CafeCard
                    key={cafe.id}
                    cafe={cafe}
                    canDeleteCafe={canDeleteCafe}
                    handleDelete={() => deleteCafe(cafe.id)}
                  />
                ))}
              </>
            )}
          </Flex>
          <Button onClick={handleSignout}>Sign out</Button>
        </>
      )}
    </Flex>
  )
}

export default User
