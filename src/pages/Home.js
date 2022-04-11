import { useState, useEffect } from 'react'
import {
  Flex,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react'
import { BiSearchAlt } from 'react-icons/bi'
import Map from '../components/map/Map'
import TaiwanMap from '../components/map/TaiwanMap'
import CafeCard from '../components/cafe/CafeCard'
import nomad from '../utils/nomadApi'

import { samples } from '../components/cafeSamples'

function Home() {
  const [userLatitude, setUserLatitude] = useState(null)
  const [userLongitude, setUserLongitude] = useState(null)
  const [userNearbyCafes, setUserNearbyCafes] = useState([])

  const reverseGeocode = (lat, lng) => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAiPvJAVuCQQekLZSIWdeedxpuw5VcO564&language=zh-TW`
    )
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(error =>
        alert(
          '無法取得當前行政區位置，將預設顯示雙北咖啡廳，歡迎透過下方台灣地圖前往各縣市咖啡廳地圖'
        )
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
        console.log(position)

        reverseGeocode(position.coords.latitude, position.coords.longitude)
      },
      () => {
        alert('請開啟允許取得當前位置，以獲得附近咖啡廳地圖 ☕️ ')
      }
    )
  }, [])

  useEffect(() => {
    nomad
      .getCafesByCity('taipei')
      .then(data => console.log(data))
      .catch(error => alert('無法取得資料庫'))
  }, [])

  return (
    <Flex direction="column" align="center">
      <Flex as="section" my="4" w="100%" direction="column" alignItems="center">
        <Heading as="h1" size="xl">
          來點 ka-pi
        </Heading>
        <Text my="3">探索鄰近咖啡廳，點擊地圖圖示看更多資訊</Text>
        {userLatitude && userLongitude && (
          <Map userLatitude={userLatitude} userLongitude={userLongitude} />
        )}
      </Flex>

      <Flex
        w="100%"
        wrap="wrap"
        justifyContent="space-between"
        alignItems="flex-start"
        as="section"
      >
        {samples.map(cafe => (
          <CafeCard key={cafe.id} cafe={cafe} />
        ))}
      </Flex>

      <Flex as="section" my="4" direction="column" alignItems="center">
        <Heading as="h2" size="lg" mb="3">
          透過關鍵字搜尋咖啡廳
        </Heading>
        <InputGroup maxW="400px">
          <InputLeftElement pointerEvents="none">
            <BiSearchAlt />
          </InputLeftElement>
          <Input placeholder="Search..." />
        </InputGroup>
      </Flex>

      <Flex as="section" my="4" w="100%" direction="column" alignItems="center">
        <Heading as="h2" size="lg" mb="3">
          為週末做準備
        </Heading>
        <Text mb="3">點擊地圖查看縣市咖啡廳地圖</Text>
        <TaiwanMap />
      </Flex>
    </Flex>
  )
}

export default Home
