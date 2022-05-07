import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
// prettier-ignore
import { Flex, Text, Spinner, IconButton, Button, Input, Avatar, VStack, Tabs, TabList, Tab, TabPanel, TabPanels, SimpleGrid } from '@chakra-ui/react'
import { RiAddFill } from 'react-icons/ri'
import { api } from '../utils/api'
import { firebase } from '../utils/firebase'
import { useAuth } from '../contexts/AuthContext'
import Map from '../components/map/Map'
import EditableText from '../components/EditableText'
import CafeCard from '../components/cafe/CafeCard'
import BlogCard from '../components/cafe/BlogCard'
import Pagination from '@choc-ui/paginator'
import usePageTracking from '../usePageTracking'

function User() {
  usePageTracking()

  const [userLatitude, setUserLatitude] = useState(null)
  const [userLongitude, setUserLongitude] = useState(null)
  const [userInfo, setUserInfo] = useState({})
  const [updatedUserName, setUpdatedUserName] = useState('')
  const [userPhotoUrl, setUserPhotoUrl] = useState(null)
  const [userBlogs, setUserBlogs] = useState([])
  const [savedCafes, setSavedCafes] = useState([])
  const [canDeleteCafe] = useState(true)
  const [canDeleteBlog] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const nameRef = useRef()
  const fileRef = useRef()
  const navigate = useNavigate()
  const { currentUser, signout } = useAuth()

  const [currentPage, setCurrentPage] = useState(1)
  const [cardsPerPage] = useState(10)
  const offset = (currentPage - 1) * cardsPerPage
  const currentCafes = savedCafes.slice(offset, offset + cardsPerPage)
  const currentBlogs = userBlogs.slice(offset, offset + cardsPerPage)

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

  useEffect(() => {
    console.log('current user from user page: ', currentUser.uid)

    firebase
      .getUser(currentUser.uid)
      .then(data => {
        setUserInfo(data)
        getFavCafes(data.favCafes)
      })
      .catch(error => alert('無法取得個人資訊，請確認網路連線，或聯繫開發人員'))
  }, [])

  useEffect(() => {
    firebase.getUserBlogs(currentUser.uid).then(blogs => setUserBlogs(blogs))
  }, [])

  const getFavCafes = cafesId => {
    api
      .getAllCafes()
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

  const deleteCafe = deletedCafeId => {
    firebase.deleteSavedCafe(currentUser.uid, deletedCafeId).then(() => {
      const updatedList = savedCafes
        .filter(cafe => cafe.id !== deletedCafeId)
        .map(cafe => cafe.id)

      getFavCafes(updatedList)
    })
  }

  const deleteBlog = (cafeId, blogId) => {
    firebase.deleteBlog(cafeId, blogId).then(() => {
      const updatedList = userBlogs.filter(blog => blog.blogId !== blogId)
      setUserBlogs(updatedList)
    })
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

  const handleSignout = () => {
    signout().then(() => navigate('/auth'))
  }

  return (
    <VStack
      w="full"
      maxW="1170px"
      h="100%"
      align="center"
      spacing="20px"
      position="relative"
    >
      {isLoading ? (
        <Spinner
          thickness="5px"
          speed="0.65s"
          emptyColor="gray.200"
          color="teal"
          size="lg"
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
                onChange={e => updateUserName(e)}
              />
            </EditableText>
            <Text fontSize={{ base: '16px', md: '18px' }} fontWeight="semibold">
              {userInfo.email}
            </Text>
          </VStack>
          <Tabs variant="enclosed" w="full" colorScheme="teal">
            <TabList>
              <Tab>咖啡因足跡</Tab>
              <Tab>咖啡廳食記</Tab>
            </TabList>
            <TabPanels>
              <TabPanel p="0" pt="4">
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
                  <Flex w="full" direction="column">
                    <SimpleGrid
                      w="full"
                      minChildWidth="270px"
                      spacing="20px"
                      justifyItems="center"
                      mb="4"
                    >
                      {currentCafes.map(cafe => (
                        <CafeCard
                          key={cafe.id}
                          cafe={cafe}
                          canDeleteCafe={canDeleteCafe}
                          handleDeleteCafe={() => deleteCafe(cafe.id)}
                        />
                      ))}
                    </SimpleGrid>
                    <Pagination
                      defaultCurrent={1}
                      total={savedCafes.length}
                      current={currentPage}
                      onChange={page => setCurrentPage(page)}
                      pageSize={cardsPerPage}
                      paginationProps={{
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                      pageNeighbours={2}
                      rounded="full"
                      baseStyles={{ bg: 'transparent' }}
                      activeStyles={{ bg: 'gray.400' }}
                      hoverStyles={{ bg: 'gray.400' }}
                      responsive={{ activePage: true }}
                    />
                  </Flex>
                </Flex>
              </TabPanel>
              <TabPanel p="0" pt="4">
                <Text mb="3">
                  共發表 {userBlogs.length > 0 ? userBlogs.length : 0} 篇
                </Text>
                <Flex w="full" direction="column">
                  <SimpleGrid
                    w="full"
                    minChildWidth="270px"
                    spacing="20px"
                    justifyItems="center"
                    mb="4"
                  >
                    {currentBlogs.map(blog => (
                      <BlogCard
                        key={blog.blogId}
                        cafeId={blog.cafeId}
                        blogId={blog.blogId}
                        content={blog.content}
                        title={blog.title}
                        date={blog.createdAt}
                        image={blog.image}
                        canDeleteBlog={canDeleteBlog}
                        handleBlogDelete={() =>
                          deleteBlog(blog.cafeId, blog.blogId)
                        }
                      />
                    ))}
                  </SimpleGrid>
                  <Pagination
                    defaultCurrent={1}
                    total={userBlogs.length}
                    current={currentPage}
                    onChange={page => setCurrentPage(page)}
                    pageSize={cardsPerPage}
                    paginationProps={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                    pageNeighbours={2}
                    rounded="full"
                    baseStyles={{ bg: 'transparent' }}
                    activeStyles={{ bg: 'gray.400' }}
                    hoverStyles={{ bg: 'gray.400' }}
                    responsive={{ activePage: true }}
                  />
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Button variant="auth-buttons" onClick={handleSignout}>
            Sign out
          </Button>
        </>
      )}
    </VStack>
  )
}

export default User
