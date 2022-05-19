import { useState, useEffect } from 'react'
// prettier-ignore
import { VStack, Tabs, TabList, Tab, TabPanel, TabPanels, useDisclosure } from '@chakra-ui/react'

import { api } from '../utils/api'
import { firebase } from '../utils/firebase'
import { useAuth } from '../contexts/AuthContext'
import UserProfile from '../components/user/UserProfile'
import UserCafesMap from '../components/user/UserCafesMap'
import UserBlogs from '../components/user/UserBlogs'
import CustomSpinner from '../components/CustomSpinner'
import AlertModal from '../components/AlertModal'
import usePageTracking from '../usePageTracking'

function User() {
  usePageTracking()

  const [userLocation, setUserLocation] = useState({
    userLatitude: null,
    userLongitude: null,
  })
  const [defaultLocation, setDefaultLocation] = useState({
    defaultLatitude: null,
    defaultLongitude: null,
  })
  const [hasLocation, setHasLocation] = useState(false)
  const [userInfo, setUserInfo] = useState({})
  const [savedCafes, setSavedCafes] = useState([])
  const [alertHeader, setAlertHeader] = useState('')
  const [alertBody, setAlertBody] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const { currentUser } = useAuth()

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

  useEffect(() => {
    if (!navigator.geolocation) {
      setFallbackLocation()
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        setUserLocation({
          userLatitude: position.coords.latitude,
          userLongitude: position.coords.longitude,
        })
        setHasLocation(true)
      },
      () => {
        setFallbackLocation()
      }
    )
  }, [])

  const setFallbackLocation = () => {
    setAlertHeader('Oops! 無法取得當前位置')
    setAlertBody(
      '可能的原因為：當前瀏覽器不支援定位、您尚未開啟定位，或網路連線中斷，請確認後重新操作。'
    )
    onLocationAlertOpen()
    setDefaultLocation({
      defaultLatitude: 25.0384851,
      defaultLongitude: 121.530177,
    })
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
        setAlertHeader('Oops! 暫無法取得個人資訊')
        setAlertBody(
          '請確認網路連線並重新操作，或聯繫開發人員 chialin76@gmail.com'
        )
        onGetUserAlertOpen()
        console.error(error.message)
      })
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
        setAlertHeader('Oops! 暫無法取得咖啡廳資料')
        setAlertBody(
          '請確認網路連線並重新操作，或聯繫開發人員 chialin76@gmail.com'
        )
        onGetCafesAlertOpen()
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
        <CustomSpinner />
      ) : (
        <>
          <UserProfile userInfo={userInfo} />
          <Tabs variant="enclosed" w="full" colorScheme="teal">
            <TabList>
              <Tab>咖啡因足跡</Tab>
              <Tab>咖啡廳食記</Tab>
            </TabList>
            <TabPanels>
              <TabPanel p="0" pt="4">
                <UserCafesMap
                  savedCafes={savedCafes}
                  hasLocation={hasLocation}
                  userLocation={userLocation}
                  defaultLocation={defaultLocation}
                  getSavedCafes={getSavedCafes}
                />
              </TabPanel>
              <TabPanel p="0" pt="4">
                <UserBlogs currentUserId={currentUser.uid} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      )}
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
    </VStack>
  )
}

export default User
