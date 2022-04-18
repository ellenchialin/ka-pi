import { useState, useEffect } from 'react'
import { Flex, Heading, Text, Spinner } from '@chakra-ui/react'
import CafeCard from '../components/cafe/CafeCard'
import Map from '../components/map/Map'
import Pagination from '../components/Pagination'

function Picks() {
  const [userLatitude, setUserLatitude] = useState(null)
  const [userLongitude, setUserLongitude] = useState(null)
  const [pickedCafes, setPickedCafes] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [cafesPerPage] = useState(10)
  const [isLoading, setIsLoading] = useState(true)

  const indexOfLastCafe = currentPage * cafesPerPage
  const indexOfFirstCafe = indexOfLastCafe - cafesPerPage
  const currentCafes = pickedCafes.slice(indexOfFirstCafe, indexOfLastCafe)

  const paginate = pageNumber => setCurrentPage(pageNumber)

  const getNearbyCafes = (lat, lng) => {
    console.log(lat, lng)

    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAiPvJAVuCQQekLZSIWdeedxpuw5VcO564`
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

        fetch(
          `https://ka-pi-server.herokuapp.com/citycafes?city=${currentCity}`
        )
          .then(res => res.json())
          .then(data => {
            setPickedCafes(data.filter(cafe => cafe.tasty >= 4).slice(0, 100))
          })
          .catch(error => {
            alert('無法取得咖啡廳資料庫，請確認網路連線，或聯繫開發人員')
            console.error(error)
          })
          .finally(() => setIsLoading(false))
      })
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
        getNearbyCafes(position.coords.latitude, position.coords.longitude)
      },
      () => {
        alert('請開啟允許取得當前位置，以獲得附近咖啡廳地圖 ☕️ ')
      }
    )
  }, [])

  return (
    <Flex as="section" direction="column" align="center">
      <Heading as="h1" size="xl">
        不用思考，無腦跟喝
      </Heading>
      <Text my="3">根據所在地區，隨機挑選 100 間，評價 4 分以上咖啡廳</Text>

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
        <>
          <Map
            userLatitude={userLatitude}
            userLongitude={userLongitude}
            cafes={pickedCafes}
          />
          <Flex
            w="100%"
            wrap="wrap"
            justifyContent="space-between"
            alignItems="flex-start"
            as="section"
          >
            {currentCafes.map(cafe => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
          </Flex>
          <Pagination
            cafesPerPage={cafesPerPage}
            totalCafes={pickedCafes.length}
            paginate={paginate}
          />
        </>
      )}
    </Flex>
  )
}

export default Picks
