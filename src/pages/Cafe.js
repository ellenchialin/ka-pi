import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
// prettier-ignore
import { Flex, useDisclosure } from '@chakra-ui/react'

import CafeHeader from '../components/cafe/CafeHeader'
import PageStats from '../components/cafe/PageStats'
import RatingStatsGroup from '../components/cafe/RatingStatsGroup'
import GooglePhotoGroup from '../components/cafe/GooglePhotoGroup'
import BlogGroup from '../components/cafe/BlogGroup'
import CommentGroup from '../components/cafe/CommentGroup'
import CustomSpinner from '../components/shared/CustomSpinner'
import AlertModal from '../components/shared/AlertModal'
import { api } from '../utils/api'
import { firebase } from '../utils/firebase'
import { useAuth } from '../contexts/AuthContext'
import usePageTracking from '../usePageTracking'

function Cafe() {
  usePageTracking()

  const [cafe, setCafe] = useState({})
  const [savedNumber, setSavedNumber] = useState(0)
  const [blogs, setBlogs] = useState([])
  const [userInfo, setUserInfo] = useState({})
  const [googlePhotoRefs, setGooglePhotoRefs] = useState([])
  const [pageViews, setPageViews] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const { currentUser } = useAuth()
  const { cafeId } = useParams()
  const navigate = useNavigate()

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
        }

        api
          .getGooglePhotoRefs(cafe.name)
          .then(data => {
            if (data.length === 0) {
              setGooglePhotoRefs([])
              return
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
      return null
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
          <CafeHeader cafe={cafe} cafeCoverUrl={cafeCoverUrl} />
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
