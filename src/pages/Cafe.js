import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
// prettier-ignore
import { Flex, Text, Icon, useDisclosure, HStack, useToast } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'

import CafeHeader from '../components/cafe/CafeHeader'
import PageStats from '../components/cafe/PageStats'
import RatingStatsGroup from '../components/cafe/RatingStatsGroup'
import GooglePhotoGroup from '../components/cafe/GooglePhotoGroup'
import BlogGroup from '../components/cafe/BlogGroup'
import CommentGroup from '../components/cafe/CommentGroup'
import CustomSpinner from '../components/CustomSpinner'
import AlertModal from '../components/AlertModal'
import { api } from '../utils/api'
import { firebase } from '../utils/firebase'
import { useAuth } from '../contexts/AuthContext'
import usePageTracking from '../usePageTracking'

function Cafe() {
  usePageTracking()

  const [cafe, setCafe] = useState({})
  const [toggleSaved, setToggleSaved] = useState(false)
  const [savedNumber, setSavedNumber] = useState(0)
  const [blogs, setBlogs] = useState([])
  const [userInfo, setUserInfo] = useState({})
  const [googlePhotoRefs, setGooglePhotoRefs] = useState([])
  const [pageViews, setPageViews] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const { currentUser } = useAuth()
  const { cafeId } = useParams()
  const navigate = useNavigate()
  const successToast = useToast()

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  const {
    isOpen: isGetCafesAlertOpen,
    onOpen: onGetCafesAlertOpen,
    onClose: onGetCafesAlertClose,
  } = useDisclosure()

  useEffect(() => {
    api
      .getAllCafes()
      .then(data => {
        const cafe = data.find(item => item.id === cafeId)
        setCafe(cafe)

        firebase
          .getAllBlogs(cafe.id)
          .then(data => setBlogs(data))
          .catch(error => console.error(error.message))

        firebase.updatePageViews(cafe.id)
        firebase
          .getPageViews(cafe.id)
          .then(views => setPageViews(views))
          .catch(error => console.error(error.message))

        firebase
          .checkSavedNumber(cafe.id)
          .then(doc => setSavedNumber(doc))
          .catch(error => console.error(error.message))

        if (currentUser) {
          firebase
            .getUser(currentUser.uid)
            .then(data => setUserInfo(data))
            .catch(error => console.error(error.message))

          firebase
            .getUserSavedCafes(currentUser.uid)
            .then(list => {
              const cafeIdList = list.map(item => item.cafeId)
              const found = id => id === cafe.id
              setToggleSaved(cafeIdList.some(found))
            })
            .catch(error => console.error(error.message))
        }

        fetch(`https://ka-pi-server.herokuapp.com/photorefs/${cafe.name}`)
          .then(res => res.json())
          .then(data => {
            if (data.length === 0) {
              setGooglePhotoRefs([])
            }

            const references = data
              .slice(0, 6)
              .map(photo => photo.photo_reference)
            setGooglePhotoRefs(references)
          })
          .catch(error => {
            console.error(error)
          })
          .finally(() => setIsLoading(false))
      })
      .catch(error => {
        onGetCafesAlertOpen()
        console.error(error.message)
      })
  }, [])

  const handleToggleSaved = () => {
    if (!currentUser) {
      onAlertOpen()
      return
    }

    if (toggleSaved) {
      firebase.deleteSavedCafe(currentUser.uid, cafe.id).then(() => {
        setToggleSaved(prev => !prev)
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
              <Text>已移除收藏</Text>
            </HStack>
          ),
          isClosable: true,
        })
      })
    }
    firebase.saveCafe(currentUser.uid, cafe.id).then(() => {
      setToggleSaved(prev => !prev)
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
            <Text>已成功收藏</Text>
          </HStack>
        ),
        isClosable: true,
      })
    })
  }

  const handleClickAddBlog = () => {
    if (!currentUser) {
      onAlertOpen()
      return
    }
    navigate('blog/edit')
  }

  const handleAlertAction = () => navigate('/auth')

  const cafeCoverUrl = () => {
    if (googlePhotoRefs.length === 0) {
      if (blogs.length > 0) {
        return blogs[0].image
      }
      return
    }
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${googlePhotoRefs[0]}&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`
  }

  return (
    <Flex
      as="section"
      direction="column"
      align="center"
      w="100%"
      h="100%"
      minH="100vh"
      maxW="1170px"
    >
      {isLoading ? (
        <CustomSpinner />
      ) : (
        <>
          <CafeHeader
            cafe={cafe}
            cafeCoverUrl={cafeCoverUrl}
            toggleSaved={toggleSaved}
            handleToggleSaved={() => handleToggleSaved()}
          />
          <PageStats savedNumber={savedNumber} pageViews={pageViews} />
          <RatingStatsGroup cafe={cafe} />
          <GooglePhotoGroup googlePhotoRefs={googlePhotoRefs} />
          <BlogGroup
            blogs={blogs}
            handleClickAddBlog={() => handleClickAddBlog()}
          />
          <CommentGroup cafeId={cafeId} userInfo={userInfo} />

          <AlertModal
            isAlertOpen={isAlertOpen}
            onAlertClose={onAlertClose}
            alertHeader="Oops! 尚未登入"
            alertBody="請先登入或註冊：）"
            actionText="前往登入"
            alertAction={() => handleAlertAction()}
          />
          <AlertModal
            isAlertOpen={isGetCafesAlertOpen}
            onAlertClose={onGetCafesAlertClose}
            alertHeader="Oops! 暫無法取得咖啡廳資料"
            alertBody="請確認網路連線並重新操作，或聯繫開發人員 chialin76@gmail.com"
          />
        </>
      )}
    </Flex>
  )
}

export default Cafe
