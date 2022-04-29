import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
// prettier-ignore
import { Flex, Text, Spinner, IconButton, Button, Input, Avatar, SimpleGrid, VStack, Box, HStack, Tabs, TabList, Tab, TabPanel, TabPanels } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { RiAddFill } from 'react-icons/ri'
import { firebase } from '../utils/firebase'
import Map from '../components/map/Map'
import CafeCard from '../components/cafe/CafeCard'
import usePageTracking from '../usePageTracking'
import { useAuth } from '../contexts/AuthContext'
import BlogCard from '../components/cafe/BlogCard'
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
        <Box h="32px" onBlur={() => setEditing(false)}>
          {children}
        </Box>
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
  const [userPhotoUrl, setUserPhotoUrl] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [savedCafes, setSavedCafes] = useState([])
  const [updatedCafeList, setUpdatedCafeList] = useState([])
  const [canDeleteCafe] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const nameRef = useRef()
  const fileRef = useRef()

  const { currentUser, signout } = useAuth()
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
        // console.log('Get user data: ', data)
        setUserInfo(data)
        getFavCafes(data.favCafes)
      })
      .catch(error => alert('無法取得個人資訊，請確認網路連線，或聯繫開發人員'))
  }, [])

  useEffect(() => {
    firebase.getUserBlogs(currentUser.uid).then(blogs => setBlogs(blogs))
  }, [])

  const handleSignout = () => {
    signout().then(() => navigate('/'))
  }

  const deleteCafe = deletedCafeId => {
    const updatedList = savedCafes
      .filter(cafe => cafe.id !== deletedCafeId)
      .map(cafe => cafe.id)

    setUpdatedCafeList(updatedList)
    getFavCafes(updatedList)
    firebase.deleteSavedCafe(currentUser.uid, deletedCafeId)
  }

  const updateUserName = e => {
    setUpdatedUserName(e.target.value)
    firebase.updateUserName(currentUser.uid, e.target.value)
  }

  const handlePhotoChange = e => {
    if (e.target.files[0]) {
      firebase
        .getUserPhotoUrl(currentUser.uid, e.target.files[0])
        .then(url => setUserPhotoUrl(url))
        .catch(error => {
          alert('頭貼上傳失敗，請重新操作一次；如連續失敗請通知網站開發人員')
          console.error(error)
        })
    }
  }

  return (
    <Flex w="100%" direction="column" align="center" position="relative">
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
          <VStack w="full" align="center" spacing="20px" mb="6">
            <Flex align="center" position="relative">
              <Avatar
                src={userPhotoUrl ? userPhotoUrl : userInfo.photo}
                name={userInfo.name}
                size="xl"
                showBorder={false}
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
                onChange={e => handlePhotoChange(e)}
                hidden
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
                w="150px"
                type="text"
                name="username"
                value={updatedUserName}
                placeholder={userInfo.name}
                onChange={e => updateUserName(e)}
              />
            </EditableText>
            <Text>{userInfo.email}</Text>
          </VStack>
          <Tabs variant="soft-rounded" w="full" colorScheme="gray">
            <TabList>
              <Tab>咖啡因足跡</Tab>
              <Tab>咖啡廳食記</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Text mb="3">
                  共蒐藏 {savedCafes.length > 0 ? savedCafes.length : 0} 間
                </Text>
                <Flex
                  w="100%"
                  wrap="wrap"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  as="section"
                  mb="6"
                >
                  {userLatitude && userLongitude && (
                    <Map
                      userLatitude={userLatitude}
                      userLongitude={userLongitude}
                      cafes={savedCafes}
                    />
                  )}
                  <SimpleGrid
                    w="full"
                    columns={[1, 2, 2, 3]}
                    spacing="20px"
                    justifyItems="center"
                  >
                    {savedCafes.map(cafe => (
                      <CafeCard
                        key={cafe.id}
                        cafe={cafe}
                        canDeleteCafe={canDeleteCafe}
                        handleDelete={() => deleteCafe(cafe.id)}
                      />
                    ))}
                  </SimpleGrid>
                </Flex>
              </TabPanel>
              <TabPanel>
                <Text mb="3">
                  共發表 {blogs.length > 0 ? blogs.length : 0} 篇
                </Text>
                <SimpleGrid
                  w="full"
                  columns={[1, 2, 2, 3]}
                  spacing="20px"
                  justifyItems="center"
                >
                  {blogs.map(blog => (
                    <BlogCard
                      key={blog.blogId}
                      cafeId={blog.cafeId}
                      blogId={blog.blogId}
                      content={blog.content}
                      title={blog.title}
                      date={blog.createdAt}
                      image={blog.image}
                    />
                  ))}
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Button onClick={handleSignout}>Sign out</Button>
        </>
      )}
    </Flex>
  )
}

export default User
