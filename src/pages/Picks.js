import { useState, useEffect } from 'react'
import { Flex, Heading, Text, Spinner, SimpleGrid } from '@chakra-ui/react'
import Pagination from '@choc-ui/paginator'
import { api } from '../utils/api'
import { cityData } from '../cityData'
import CafeCard from '../components/cafe/CafeCard'
import Map from '../components/map/Map'
import usePageTracking from '../usePageTracking'

function Picks() {
  usePageTracking()

  const [userLatitude, setUserLatitude] = useState(null)
  const [userLongitude, setUserLongitude] = useState(null)
  const [pickedCafes, setPickedCafes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [cafesPerPage] = useState(18)
  const offset = (currentPage - 1) * cafesPerPage
  const currentCafes = pickedCafes.slice(offset, offset + cafesPerPage)

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
              alert('無法取得咖啡廳資料庫，請確認網路連線，或聯繫開發人員')
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
              alert('無法取得咖啡廳資料庫，請確認網路連線，或聯繫開發人員')
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
              alert('無法取得咖啡廳資料庫，請確認網路連線，或聯繫開發人員')
              console.error(error)
            })
            .finally(() => setIsLoading(false))
        }
      })
      .catch(error => alert('無法取得當前行政區位置，請確認網路連線'))
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
        Guided by Stars
      </Heading>
      <Text my="3" align="center" fontSize={{ base: '16px', md: '18px' }}>
        Here's our picks based on your current location, rating over 4 stars.
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
    </Flex>
  )
}

export default Picks
