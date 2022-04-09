import { useState, useEffect } from 'react'
import {
  Flex,
  Heading,
  Box,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react'
import { BiSearchAlt } from 'react-icons/bi'
import Map from '../components/Map'

function Home() {
  const [userLatitude, setUserLatitude] = useState(null)
  const [userLongitude, setUserLongitude] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      alert('目前使用的瀏覽器版本不支援取得當前位置 😰 ')
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        setUserLatitude(position.coords.latitude)
        setUserLongitude(position.coords.longitude)
        console.log(position)
      },
      () => {
        alert('請開啟允許取得當前位置，以獲得附近咖啡廳地圖 ☕️ ')
      }
    )
  }, [])

  return (
    <Flex direction="column" align="center">
      <Heading as="h1" size="xl">
        來點 ka-pi
      </Heading>
      <Text my="3">走幾步路就到，點擊咖啡廳位置看更多資訊</Text>
      {userLatitude && userLongitude && (
        <Map userLatitude={userLatitude} userLongitude={userLongitude} />
      )}

      <InputGroup maxW="400px">
        <InputLeftElement pointerEvents="none">
          <BiSearchAlt />
        </InputLeftElement>
        <Input placeholder="Search..." />
      </InputGroup>
    </Flex>
  )
}

export default Home
