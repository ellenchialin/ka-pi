import { useState, useEffect } from 'react'
import {
  Flex,
  SimpleGrid,
  Heading,
  Text,
  Spinner,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import usePageTracking from '../usePageTracking'
import { api } from '../utils/api'
import { cityData } from '../cityData'
import Map from '../components/map/Map'
import TaiwanMap from '../components/map/TaiwanMap'
import CafeCard from '../components/cafe/CafeCard'
import Pagination from '@choc-ui/paginator'

function Home() {
  usePageTracking()

  const [userLatitude, setUserLatitude] = useState(null)
  const [userLongitude, setUserLongitude] = useState(null)
  const [userNearbyCafes, setUserNearbyCafes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [cafesPerPage] = useState(10)
  const offset = (currentPage - 1) * cafesPerPage
  const currentCafes = userNearbyCafes.slice(offset, offset + cafesPerPage)

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
              alert('無法取得咖啡廳資料庫，請確認網路連線，或聯繫開發人員')
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
              alert('無法取得咖啡廳資料庫，請確認網路連線，或聯繫開發人員')
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
              alert('無法取得咖啡廳資料庫，請確認網路連線，或聯繫開發人員')
              console.error(error)
            })
            .finally(() => setIsLoading(false))
        }
      })
      .catch(error =>
        alert('無法取得當前位置，歡迎透過下方台灣地圖前往各縣市咖啡廳地圖')
      )
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      alert('目前使用的瀏覽器版本不支援取得當前位置 😰 ')
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        setUserLatitude(position.coords.latitude)
        setUserLongitude(position.coords.longitude)
        getNearbyCafes(position.coords.latitude, position.coords.longitude)
      },
      () => {
        alert('請開啟允許取得當前位置，以成功顯示鄰近咖啡廳 ☕️ ')
      }
    )
  }, [])

  return (
    <Flex w="full" direction="column" align="center">
      <Flex as="section" mb="4" w="100%" direction="column" alignItems="center">
        <Heading as="h1" size="xl">
          來點 ka-pi
        </Heading>
        <Text my="3">探索鄰近咖啡廳，點擊地圖圖示看更多資訊</Text>

        {isLoading ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="teal"
            siz="xl"
            mt="6"
          />
        ) : (
          <>
            <Map
              userLatitude={userLatitude}
              userLongitude={userLongitude}
              cafes={userNearbyCafes}
            />
            <Wrap
              spacing={{ base: '10px', sm: '30px', md: '30px' }}
              justify="center"
              mb="6"
            >
              {currentCafes.map(cafe => (
                <WrapItem key={cafe.id}>
                  <CafeCard cafe={cafe} />
                </WrapItem>
              ))}
            </Wrap>

            <Pagination
              defaultCurrent={1}
              total={userNearbyCafes.length}
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
      </Flex>

      <Flex
        as="section"
        mt="12"
        mb="4"
        w="100%"
        direction="column"
        alignItems="center"
      >
        <Heading as="h2" size="lg" mb="3">
          為週末做準備
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
