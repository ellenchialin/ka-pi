import { useState, useEffect } from 'react'
import {
  Flex,
  Heading,
  Text,
  Spinner,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/react'
import Pagination from '@choc-ui/paginator'
import { api } from '../utils/api'
import { cityData } from '../cityData'
import CafeCard from '../components/cafe/CafeCard'
import AlertModal from '../components/AlertModal'
import Map from '../components/map/Map'
import usePageTracking from '../usePageTracking'

function Picks() {
  usePageTracking()

  const [userLatitude, setUserLatitude] = useState(null)
  const [userLongitude, setUserLongitude] = useState(null)
  const [defaultLatitude, setDefaultLatitude] = useState(null)
  const [defaultLongitude, setDefaultLongitude] = useState(null)
  const [pickedCafes, setPickedCafes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [cafesPerPage] = useState(18)
  const offset = (currentPage - 1) * cafesPerPage
  const currentCafes = pickedCafes.slice(offset, offset + cafesPerPage)

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
        setPickedCafes(
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
        let currentCity = data.plus_code.compound_code
          .split(' ')
          .slice(1)[0]
          .slice(2, 4)

        if (currentCity === '新北') {
          api
            .getCityCafes('taipei')
            .then(cafes =>
              setPickedCafes(
                cafes
                  .filter(
                    cafe => cafe.address.includes('新北') && cafe.tasty >= 4
                  )
                  .slice(0, 100)
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
              setPickedCafes(
                cafes
                  .filter(
                    cafe => cafe.address.includes('台北') && cafe.tasty >= 4
                  )
                  .slice(0, 100)
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
            .then(cafes =>
              setPickedCafes(
                cafes.filter(cafe => cafe.tasty >= 4).slice(0, 100)
              )
            )
            .catch(error => {
              onGetCafesAlertOpen()
              console.error(error)
            })
            .finally(() => setIsLoading(false))
        }
      })
      .catch(error => onLocationAlertOpen())
  }

  return (
    <Flex
      as="section"
      w="full"
      maxW="1170px"
      h="100%"
      direction="column"
      align="center"
    >
      <Heading as="h1" align="center" fontSize={{ base: '28px', md: '40px' }}>
        不用思考，無腦跟喝
      </Heading>
      <Text my="3" align="center" fontSize={{ base: '16px', md: '18px' }}>
        根據所在地區，精選評價 4 分以上咖啡廳
      </Text>

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
          <Map
            userLatitude={userLatitude}
            userLongitude={userLongitude}
            defaultLatitude={defaultLatitude}
            defaultLongitude={defaultLongitude}
            cafes={pickedCafes}
          />
          <SimpleGrid
            w="full"
            minChildWidth="270px"
            spacing="20px"
            justifyItems="center"
            mb="4"
          >
            {currentCafes.map(cafe => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
          </SimpleGrid>
          <Pagination
            defaultCurrent={1}
            total={pickedCafes.length}
            current={currentPage}
            onChange={page => setCurrentPage(page)}
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
    </Flex>
  )
}

export default Picks
