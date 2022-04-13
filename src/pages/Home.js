import { useState, useEffect } from 'react'
import { Flex, Heading, Text, Spinner } from '@chakra-ui/react'
import Map from '../components/map/Map'
import TaiwanMap from '../components/map/TaiwanMap'
import CafeCard from '../components/cafe/CafeCard'
import nomad from '../utils/nomadApi'

function Home(props) {
  const { cityLinkEndpoint, setCityLinkEndpoint } = props

  const [userLatitude, setUserLatitude] = useState(null)
  const [userLongitude, setUserLongitude] = useState(null)
  const [userNearbyCafes, setUserNearbyCafes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getNearbyCafes = (lat, lng) => {
    // console.log(lat, lng)

    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAiPvJAVuCQQekLZSIWdeedxpuw5VcO564`
    )
      .then(res => res.json())
      .then(data => {
        const currentCity = data.results[0].formatted_address
          .split(', ')
          .slice(-2, -1)[0]
          .split(' ')[0]
          .toLowerCase()
        // console.log(currentCity[0].slice(0, -1).toLowerCase())
        nomad
          .getCafesByCity(currentCity)
          .then(data => setUserNearbyCafes(data.slice(0, 10)))
          .catch(error => alert('無法取得資料庫'))
      })
      .catch(error =>
        alert(
          '無法取得當前行政區位置，將預設顯示雙北咖啡廳，歡迎透過下方台灣地圖前往各縣市咖啡廳地圖'
        )
      )
      .finally(() => setIsLoading(false))
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
    <Flex direction="column" align="center">
      <Flex as="section" my="4" w="100%" direction="column" alignItems="center">
        <Heading as="h1" size="xl">
          來點 ka-pi
        </Heading>
        <Text my="3">探索鄰近咖啡廳，點擊地圖圖示看更多資訊</Text>
        {isLoading ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.600"
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

      <Flex
        w="100%"
        wrap="wrap"
        justifyContent="space-between"
        alignItems="flex-start"
        as="section"
      >
        {userNearbyCafes.map(cafe => (
          <CafeCard key={cafe.id} cafe={cafe} />
        ))}
      </Flex>

      <Flex as="section" my="4" w="100%" direction="column" alignItems="center">
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
