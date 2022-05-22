import { useState, useEffect, useRef } from 'react'
// prettier-ignore
import { Flex, Heading, Text, SimpleGrid, Skeleton, useDisclosure } from '@chakra-ui/react'

import { api } from '../utils/api'
import { cityData } from '../cityData'
import Intro from '../components/home/Intro.js'
import Map from '../components/map/Map'
import CafeCard from '../components/cafe/CafeCard'
import CustomPagination from '../components/shared/CustomPagination'
import AlertModal from '../components/shared/AlertModal'
import usePageTracking from '../usePageTracking'

function Home() {
  usePageTracking()

  const [userLatitude, setUserLatitude] = useState(null)
  const [userLongitude, setUserLongitude] = useState(null)
  const [defaultLatitude, setDefaultLatitude] = useState(null)
  const [defaultLongitude, setDefaultLongitude] = useState(null)
  const [userNearbyCafes, setUserNearbyCafes] = useState([])
  const [alertHeader, setAlertHeader] = useState('')
  const [alertBody, setAlertBody] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const scrollIntroRef = useRef(null)
  const scrollToTopRef = useRef(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [cafesPerPage] = useState(12)
  const offset = (currentPage - 1) * cafesPerPage
  const currentCafes = userNearbyCafes.slice(offset, offset + cafesPerPage)

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  useEffect(() => {
    if (!navigator.geolocation) {
      setFallbackLocation()
      return
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        setUserLatitude(position.coords.latitude)
        setUserLongitude(position.coords.longitude)
        getNearbyCafes(position.coords.latitude, position.coords.longitude)
      },
      () => {
        setFallbackLocation()
      }
    )
  }, [])

  const setFallbackLocation = () => {
    setAlertHeader('Oops! 無法取得當前位置')
    setAlertBody(
      '目前瀏覽器不支援定位，或您尚未開啟定位，將預先顯示台北市部分咖啡廳。建議開啟定位，取得鄰近咖啡廳推薦：）'
    )
    onAlertOpen()
    setDefaultLatitude(25.0384851)
    setDefaultLongitude(121.530177)
    getDefaultCafes()
  }

  const getDefaultCafes = () => {
    api
      .getCityCafes('taipei')
      .then(cafes =>
        setUserNearbyCafes(
          cafes.filter(cafe => cafe.address.includes('台北')).slice(0, 50)
        )
      )
      .catch(error => {
        showGetCafesAlert()
        console.error(error)
      })
      .finally(() => setIsLoading(false))
  }

  const getNearbyCafes = (lat, lng) => {
    api
      .getGoogleGeocode(lat, lng)
      .then(data => {
        const currentCity = data.plus_code.compound_code
          .split(' ')
          .slice(1)[0]
          .slice(2, 4)

        if (currentCity === '台北') {
          getDefaultCafes()
          return
        }
        if (currentCity === '新北') {
          api
            .getCityCafes('taipei')
            .then(cafes =>
              setUserNearbyCafes(
                cafes.filter(cafe => cafe.address.includes('新北')).slice(0, 50)
              )
            )
            .catch(error => {
              showGetCafesAlert()
              console.error(error)
            })
            .finally(() => setIsLoading(false))
          return
        }

        const city = cityData.find(city => city.place === currentCity).tag
        api
          .getCityCafes(city)
          .then(cafes => setUserNearbyCafes(cafes.slice(0, 50)))
          .catch(error => {
            showGetCafesAlert()
            console.error(error)
          })
          .finally(() => setIsLoading(false))
      })
      .catch(error => {
        showGetCafesAlert()
        console.error(error)
      })
  }

  const showGetCafesAlert = () => {
    setAlertHeader('Oops! 暫無法取得咖啡廳資料')
    setAlertBody('請確認網路連線並重新操作，或聯繫開發人員 chialin76@gmail.com')
    onAlertOpen()
  }

  const handleScroll = () =>
    scrollIntroRef.current.scrollIntoView({ behavior: 'smooth' })

  return (
    <Flex w="full" h="100%" maxW="1170px" direction="column" align="center">
      <Intro handleScroll={handleScroll} />

      <Flex
        ref={scrollIntroRef}
        as="section"
        my="4"
        w="100%"
        direction="column"
        alignItems="center"
      >
        <Heading as="h1" fontSize={{ base: '28px', md: '40px' }}>
          來點 ka-pi
        </Heading>
        <Text my="3" fontSize={{ base: '18px', md: '20px' }} textAlign="center">
          探索鄰近咖啡廳，點擊圖示看更多資訊
        </Text>

        {isLoading ? (
          <Flex w="full" direction="column">
            <Skeleton size="lg" isLoaded={isLoading ? false : true} mb="6" />
            <SimpleGrid
              w="full"
              minChildWidth="270px"
              spacing="20px"
              mb="6"
              justifyItems="center"
            >
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} size="sm" />
              ))}
            </SimpleGrid>
          </Flex>
        ) : (
          <>
            <Map
              userLatitude={userLatitude}
              userLongitude={userLongitude}
              defaultLatitude={defaultLatitude}
              defaultLongitude={defaultLongitude}
              cafes={userNearbyCafes}
            />
            <SimpleGrid
              w="full"
              minChildWidth="270px"
              spacing="20px"
              mb="6"
              justifyItems="center"
              ref={scrollToTopRef}
            >
              {currentCafes.map(cafe => (
                <CafeCard key={cafe.id} cafe={cafe} />
              ))}
            </SimpleGrid>
            <CustomPagination
              total={userNearbyCafes.length}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              cardsPerPage={cafesPerPage}
              scrollToTopRef={scrollToTopRef}
            />
          </>
        )}
      </Flex>

      <AlertModal
        isAlertOpen={isAlertOpen}
        onAlertClose={onAlertClose}
        alertHeader={alertHeader}
        alertBody={alertBody}
      />
    </Flex>
  )
}

export default Home
