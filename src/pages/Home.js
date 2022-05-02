import { useState, useEffect } from 'react'
import { Flex, SimpleGrid, Heading, Text, Spinner } from '@chakra-ui/react'
import usePageTracking from '../usePageTracking'
import Map from '../components/map/Map'
import TaiwanMap from '../components/map/TaiwanMap'
import CafeCard from '../components/cafe/CafeCard'
import Pagination from '@choc-ui/paginator'

function Home() {
  usePageTracking()

  const [cityLinkEndpoint, setCityLinkEndpoint] = useState('')
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
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`
    )
      .then(res => res.json())
      .then(data => {
        let currentCity = ''
        if (
          data.results[0].formatted_address.split(', ').slice(-2, -1)[0] ===
          'New Taipei City'
        ) {
          currentCity = 'taipei'
        } else {
          currentCity = data.results[0].formatted_address
            .split(', ')
            .slice(-2, -1)[0]
            .split(' ')[0]
            .toLowerCase()
        }
        console.log('Current city: ', currentCity)
        // console.log(currentCity[0].slice(0, -1).toLowerCase())

        fetch(
          `https://ka-pi-server.herokuapp.com/citycafes?city=${currentCity}`
        )
          .then(res => res.json())
          .then(data => {
            setUserNearbyCafes(data.slice(0, 20))
          })
          .catch(error => {
            alert('無法取得咖啡廳資料庫，請確認網路連線，或聯繫開發人員')
            console.error(error)
          })
          .finally(() => setIsLoading(false))
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
        alert('請開啟允許取得當前位置，以獲得附近咖啡廳地圖 ☕️ ')
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
          <Map
            userLatitude={userLatitude}
            userLongitude={userLongitude}
            cafes={userNearbyCafes}
          />
        )}
      </Flex>

      <SimpleGrid
        w="full"
        columns={[1, 2, 2, 3]}
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
          <TaiwanMap
            cityLinkEndpoint={cityLinkEndpoint}
            setCityLinkEndpoint={setCityLinkEndpoint}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Home
