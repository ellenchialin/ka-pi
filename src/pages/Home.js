import { useState, useEffect, useRef } from 'react'
// prettier-ignore
import { Flex, Heading, Text, SimpleGrid, Skeleton, HStack, VStack, Icon, useDisclosure } from '@chakra-ui/react'
import usePageTracking from '../usePageTracking'
import { api } from '../utils/api'
import { cityData } from '../cityData'
import Intro from '../components/Intro.js'
import Map from '../components/map/Map'
import TaiwanMap from '../components/map/TaiwanMap'
import CafeCard from '../components/cafe/CafeCard'
import AlertModal from '../components/AlertModal'
import Pagination from '@choc-ui/paginator'

function Home() {
  usePageTracking()

  const [userLatitude, setUserLatitude] = useState(null)
  const [userLongitude, setUserLongitude] = useState(null)
  const [defaultLatitude, setDefaultLatitude] = useState(null)
  const [defaultLongitude, setDefaultLongitude] = useState(null)
  const [userNearbyCafes, setUserNearbyCafes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const scrollIntroRef = useRef(null)
  const scrollCardRef = useRef(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [cafesPerPage] = useState(24)
  const offset = (currentPage - 1) * cafesPerPage
  const currentCafes = userNearbyCafes.slice(offset, offset + cafesPerPage)

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

  useEffect(() => {
    if (!navigator.geolocation) {
      onLocationAlertOpen()
      setDefaultLatitude(25.0384851)
      setDefaultLongitude(121.530177)
      getDefaultCafes()
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        setUserLatitude(position.coords.latitude)
        setUserLongitude(position.coords.longitude)
        getNearbyCafes(position.coords.latitude, position.coords.longitude)
      },
      () => {
        onLocationAlertOpen()
        setDefaultLatitude(25.0384851)
        setDefaultLongitude(121.530177)
        getDefaultCafes()
      }
    )
  }, [])

  const getDefaultCafes = () => {
    api
      .getCityCafes('taipei')
      .then(cafes =>
        setUserNearbyCafes(
          cafes.filter(cafe => cafe.address.includes('台北')).slice(0, 50)
        )
      )
      .catch(error => {
        onGetCafesAlertOpen()
        console.error(error)
      })
      .finally(() => setIsLoading(false))
  }

  const getNearbyCafes = (lat, lng) => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}&language=zh-TW`
    )
      .then(res => res.json())
      .then(data => {
        const currentCity = data.plus_code.compound_code
          .split(' ')
          .slice(1)[0]
          .slice(2, 4)

        if (currentCity === '新北') {
          api
            .getCityCafes('taipei')
            .then(cafes =>
              setUserNearbyCafes(
                cafes.filter(cafe => cafe.address.includes('新北')).slice(0, 50)
              )
            )
            .catch(error => {
              onGetCafesAlertOpen()
              console.error(error)
            })
            .finally(() => setIsLoading(false))
        } else if (currentCity === '台北') {
          api
            .getCityCafes('taipei')
            .then(cafes =>
              setUserNearbyCafes(
                cafes.filter(cafe => cafe.address.includes('台北')).slice(0, 50)
              )
            )
            .catch(error => {
              onGetCafesAlertOpen()
              console.error(error)
            })
            .finally(() => setIsLoading(false))
        } else {
          const city = cityData.filter(city => city.place === currentCity)[0]
            .tag

          api
            .getCityCafes(city)
            .then(cafes => setUserNearbyCafes(cafes.slice(0, 50)))
            .catch(error => {
              onGetCafesAlertOpen()
              console.error(error)
            })
            .finally(() => setIsLoading(false))
        }
      })
      .catch(error => onLocationAlertOpen())
  }

  const handleScroll = () =>
    scrollIntroRef.current.scrollIntoView({ behavior: 'smooth' })

  const handlePageChange = page => {
    setCurrentPage(page)
    scrollCardRef.current.scrollIntoView({ behavior: 'smooth' })
  }

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

        <AlertModal
          isAlertOpen={isLocationAlertOpen}
          onAlertClose={onLocationAlertClose}
          alertHeader="Oops! 無法取得當前位置"
          alertBody="目前瀏覽器不支援定位，或您尚未開啟定位，將預先顯示台北市部分咖啡廳。建議開啟定位，取得鄰近咖啡廳推薦：）"
        />

        <AlertModal
          isAlertOpen={isGetCafesAlertOpen}
          onAlertClose={onGetCafesAlertClose}
          alertHeader="Oops! 暫無法取得咖啡廳資料"
          alertBody="請確認網路連線並重新操作，或聯繫開發人員 chialin76@gmail.com "
        />

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
              {[...Array(8)].map((item, i) => (
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
              ref={scrollCardRef}
            >
              {currentCafes.map(cafe => (
                <CafeCard key={cafe.id} cafe={cafe} />
              ))}
            </SimpleGrid>

            <Pagination
              defaultCurrent={1}
              total={userNearbyCafes.length}
              current={currentPage}
              onChange={page => handlePageChange(page)}
              pageSize={cafesPerPage}
              paginationProps={{ display: 'flex', justifyContent: 'center' }}
              pageNeighbours={2}
              rounded="full"
              baseStyles={{ bg: 'transparent' }}
              activeStyles={{ bg: 'gray.400' }}
              hoverStyles={{ bg: 'gray.400' }}
              responsive={{ activePage: true }}
            />
          </>
        )}
      </Flex>

      <Flex
        as="section"
        mt="12"
        mb="4"
        w="100%"
        direction="column"
        alignItems="center"
      >
        <Heading as="h2" mb="3" fontSize={{ base: '28px', md: '40px' }}>
          探索城市咖啡廳
        </Heading>

        <Flex
          w="100%"
          direction="column"
          alignItems="center"
          position="relative"
        >
          <TaiwanMap />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Home
