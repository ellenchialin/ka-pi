import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
// prettier-ignore
import { Flex, Text, Spinner, IconButton, Button, Input, Avatar, VStack, Tabs, TabList, Tab, TabPanel, TabPanels, SimpleGrid, useDisclosure, HStack, Icon, useToast } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { RiAddFill } from 'react-icons/ri'

import { api } from '../utils/api'
import { firebase } from '../utils/firebase'
import { useAuth } from '../contexts/AuthContext'
import Map from '../components/map/Map'
import EditableText from '../components/EditableText'
import CafeCard from '../components/cafe/CafeCard'
import BlogCard from '../components/cafe/BlogCard'
import AlertModal from '../components/AlertModal'
import Pagination from '@choc-ui/paginator'
import usePageTracking from '../usePageTracking'

function User() {
  usePageTracking()

  const [userLatitude, setUserLatitude] = useState(null)
  const [userLongitude, setUserLongitude] = useState(null)
  const [defaultLatitude, setDefaultLatitude] = useState(null)
  const [defaultLongitude, setDefaultLongitude] = useState(null)
  const [hasLocation, setHasLocation] = useState(false)
  const [userInfo, setUserInfo] = useState({})
  const [updatedUserName, setUpdatedUserName] = useState('')
  const [userPhotoUrl, setUserPhotoUrl] = useState(null)
  const [userBlogs, setUserBlogs] = useState([])
  const [savedCafes, setSavedCafes] = useState([])
  const [alertHeader, setAlertHeader] = useState('')
  const [alertBody, setAlertBody] = useState('')
  const [canDeleteCafe] = useState(true)
  const [canDeleteBlog] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const nameRef = useRef()
  const fileRef = useRef()
  const navigate = useNavigate()
  const { currentUser, signout } = useAuth()
  const successToast = useToast()

  const [currentPage, setCurrentPage] = useState(1)
  const [cardsPerPage] = useState(10)
  const offset = (currentPage - 1) * cardsPerPage
  const currentCafes = savedCafes.slice(offset, offset + cardsPerPage)
  const currentBlogs = userBlogs.slice(offset, offset + cardsPerPage)

  const {
    isOpen: isLocationAlertOpen,
    onOpen: onLocationAlertOpen,
    onClose: onLocationAlertClose,
  } = useDisclosure()

  const {
    isOpen: isGetCafesAlertOpen,
    onOpen: onGetCafesAlertOpen,
    onClose: onGetCafesAlertClose,
  } = useDisclosure()

  const {
    isOpen: isGetUserAlertOpen,
    onOpen: onGetUserAlertOpen,
    onClose: onGetUserAlertClose,
  } = useDisclosure()

  const {
    isOpen: isUploadAlertOpen,
    onOpen: onUploadAlertOpen,
    onClose: onUploadAlertClose,
  } = useDisclosure()

  useEffect(() => {
    if (!navigator.geolocation) {
      setFallbackLocation()
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        setUserLatitude(position.coords.latitude)
        setUserLongitude(position.coords.longitude)
        setHasLocation(true)
      },
      () => {
        setFallbackLocation()
      }
    )
  }, [])

  const setFallbackLocation = () => {
    onLocationAlertOpen()
    setAlertHeader('Oops! 無法取得當前位置')
    setAlertBody('目前瀏覽器不支援定位，或您尚未開啟定位。')
    setDefaultLatitude(25.0384851)
    setDefaultLongitude(121.530177)
    setHasLocation(true)
  }

  useEffect(() => {
    firebase
      .getUser(currentUser.uid)
      .then(data => {
        setUserInfo(data)
        getSavedCafes()
      })
      .catch(error => {
        onGetUserAlertOpen()
        setAlertHeader('Oops! 暫無法取得個人資訊')
        setAlertBody(
          '請確認網路連線並重新操作，或聯繫開發人員 chialin76@gmail.com'
        )
        console.error(error.message)
      })
  }, [])

  useEffect(() => {
    firebase
      .getUserBlogs(currentUser.uid)
      .then(blogs => setUserBlogs(blogs))
      .catch(error => console.error(error.message))
  }, [])

  const getSavedCafes = () => {
    api
      .getAllCafes()
      .then(allCafes => {
        firebase
          .getUserSavedCafes(currentUser.uid)
          .then(list => getSavedCafesByOrder(allCafes, list))
          .catch(error => {
            console.error(error.message)
          })
      })
      .catch(error => {
        onGetCafesAlertOpen()
        setAlertHeader('Oops! 暫無法取得咖啡廳資料')
        setAlertBody(
          '請確認網路連線並重新操作，或聯繫開發人員 chialin76@gmail.com'
        )
        console.error(error.message)
      })
      .finally(() => setIsLoading(false))
  }

  const getSavedCafesByOrder = (allCafes, cafeIdList) => {
    let savedListByOrder = []
    cafeIdList.forEach(item => {
      const found = allCafes.find(cafe => cafe.id === item.cafeId)
      savedListByOrder.push(found)
    })
    setSavedCafes(savedListByOrder)
  }

  const deleteSavedCafe = deletedCafeId => {
    firebase
      .deleteSavedCafe(currentUser.uid, deletedCafeId)
      .then(() => {
        getSavedCafes()

        successToast({
          position: 'top-right',
          duration: 5000,
          render: () => (
            <HStack
              spacing="4"
              color="primaryDark"
              p={3}
              bg="teal.200"
              borderRadius="md"
            >
              <Icon as={CheckCircleIcon} />
              <Text>成功移除收藏</Text>
            </HStack>
          ),
          isClosable: true,
        })
      })
      .catch(error => console.error(error.message))
  }

  const deleteBlog = (cafeId, blogId) => {
    firebase
      .deleteUserBlog(cafeId, blogId)
      .then(() => {
        const updatedList = userBlogs.filter(blog => blog.blogId !== blogId)
        setUserBlogs(updatedList)

        successToast({
          position: 'top-right',
          duration: 3000,
          render: () => (
            <HStack
              spacing="4"
              color="primaryDark"
              p={3}
              bg="teal.200"
              borderRadius="md"
            >
              <Icon as={CheckCircleIcon} />
              <Text>成功刪除食記</Text>
            </HStack>
          ),
          isClosable: true,
        })
      })
      .catch(error => console.error(error.message))
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
          onUploadAlertOpen()
          setAlertHeader('Oops! 頭貼上傳失敗')
          setAlertBody(
            '請確認網路連線並重新操作，或聯繫開發人員 chialin76@gmail.com'
          )
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
      <AlertModal
        isAlertOpen={isLocationAlertOpen}
        onAlertClose={onLocationAlertClose}
        alertHeader={alertHeader}
        alertBody={alertBody}
      />

      <AlertModal
        isAlertOpen={isGetCafesAlertOpen}
        onAlertClose={onGetCafesAlertClose}
        alertHeader={alertHeader}
        alertBody={alertBody}
      />

      <AlertModal
        isAlertOpen={isGetUserAlertOpen}
        onAlertClose={onGetUserAlertClose}
        alertHeader={alertHeader}
        alertBody={alertBody}
      />

      <AlertModal
        isAlertOpen={isUploadAlertOpen}
        onAlertClose={onUploadAlertClose}
        alertHeader={alertHeader}
        alertBody={alertBody}
      />

      {isLoading ? (
        <Spinner
          thickness="5px"
          speed="0.65s"
          emptyColor="gray.200"
          color="teal"
          size="lg"
          mt="6"
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
            <Button variant="auth-buttons" w="113px" onClick={handleSignout}>
              登出
            </Button>
          </VStack>
          <Tabs variant="enclosed" w="full" colorScheme="teal">
            <TabList>
              <Tab>咖啡因足跡</Tab>
              <Tab>咖啡廳食記</Tab>
            </TabList>
            <TabPanels>
              <TabPanel p="0" pt="4">
                <Text mb="3">
                  {savedCafes.length > 0
                    ? `${savedCafes.length} Cafes`
                    : '尚未收藏任何咖啡廳'}
                </Text>
                <Flex
                  w="100%"
                  wrap="wrap"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  as="section"
                  mb="6"
                >
                  {hasLocation && (
                    <Map
                      userLatitude={userLatitude}
                      userLongitude={userLongitude}
                      defaultLatitude={defaultLatitude}
                      defaultLongitude={defaultLongitude}
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
                      {currentCafes.length > 0 &&
                        currentCafes.map(cafe => (
                          <CafeCard
                            key={cafe.id}
                            cafe={cafe}
                            canDeleteCafe={canDeleteCafe}
                            handleDeleteCafe={() => deleteSavedCafe(cafe.id)}
                          />
                        ))}
                    </SimpleGrid>
                    {savedCafes.length > cardsPerPage && (
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
                    )}
                  </Flex>
                </Flex>
              </TabPanel>
              <TabPanel p="0" pt="4">
                <Text mb="3">
                  {userBlogs.length > 0
                    ? `${userBlogs.length} Blogs`
                    : '尚未發佈任何食記'}
                </Text>
                <Flex w="full" direction="column">
                  <SimpleGrid
                    w="full"
                    minChildWidth="270px"
                    spacing="20px"
                    justifyItems="center"
                    mb="4"
                  >
                    {currentBlogs.length > 0 &&
                      currentBlogs.map(blog => (
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
                  {userBlogs.length > cardsPerPage && (
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
                  )}
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      )}
    </VStack>
  )
}

export default User
