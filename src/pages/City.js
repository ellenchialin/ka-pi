import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Flex, Heading, Text, Spinner, Box } from '@chakra-ui/react'
import FilteredByDist from '../components/FilteredByDist'
import CafeCard from '../components/cafe/CafeCard'
import useUpdateEffect from '../hooks/useUpdateEffect'
import usePageTracking from '../usePageTracking'
import Pagination from '../components/Pagination'
import { cityData } from '../cityData'

function City() {
  usePageTracking()
  const [translatedCityName, setTranslatedCityName] = useState('')
  const [cityCafes, setCityCafes] = useState([])
  // const [taipeiCafes, setTaipeiCafes] = useState([])
  // const [newTaipeiCafes, setNewTaipeiCafes] = useState([])
  const [selectedAreas, setSelectedAreas] = useState([])
  const [updatedCafes, setUpdatedCafes] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [cafesPerPage] = useState(20)
  const [isLoading, setIsLoading] = useState(true)

  const { cityName } = useParams()

  const indexOfLastCafe = currentPage * cafesPerPage
  const indexOfFirstCafe = indexOfLastCafe - cafesPerPage
  const currentCafes =
    updatedCafes.length > 0
      ? updatedCafes.slice(indexOfFirstCafe, indexOfLastCafe)
      : cityCafes.slice(indexOfFirstCafe, indexOfLastCafe)
  const paginate = pageNumber => setCurrentPage(pageNumber)

  const convertCityName = city => {
    setTranslatedCityName(cityData.filter(c => c.tag === city)[0].place)
  }

  const getCafes = (cityName, fetchCity, setCityState) => {
    fetch(`https://ka-pi-server.herokuapp.com/citycafes?city=${fetchCity}`)
      .then(res => res.json())
      .then(data => {
        if (cityName === 'new_taipei') {
          setCityState(data.filter(cafe => cafe.address.includes('新北')))
        } else if (cityName === 'taipei') {
          setCityState(data.filter(cafe => cafe.address.includes('台北')))
        } else {
          setCityState(data)
        }
      })
      .catch(error => {
        alert('暫無法取得該縣市咖啡廳總數，請通知開發人員')
        console.error(error)
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    // 城市頁標題，把城市英文轉中文
    convertCityName(cityName)

    // console.log('City Page, fetch city endpoint: ', cityName)

    if (cityName === 'new_taipei') {
      getCafes('new_taipei', 'taipei', setCityCafes)
      // setTaipeiCafes([])
    } else if (cityName === 'taipei') {
      getCafes('taipei', 'taipei', setCityCafes)
      // setNewTaipeiCafes([])
    } else {
      getCafes(cityName, cityName, setCityCafes)
      // setTaipeiCafes([])
      // setNewTaipeiCafes([])
    }

    /*
    fetch(`https://ka-pi-server.herokuapp.com/citycafes?city=${cityName}`)
      .then(res => res.json())
      .then(data => {
        console.log('From City: ', data)
        setCityCafes(data.slice(0, 20))
      })
      .catch(error => {
        alert('無法取得咖啡廳資料庫，請聯繫開發人員')
        console.error(error)
      })
      .finally(() => setIsLoading(false))
    */
  }, [])

  const getSelectedCafes = () => {
    if (selectedAreas.length > 0) {
      setUpdatedCafes([])

      selectedAreas.forEach(area => {
        const filteredCafes = cityCafes.filter(cafe =>
          cafe.address.includes(area)
        )
        console.log('filtered Cafes: ', filteredCafes)
        setUpdatedCafes(prev => [...prev, ...filteredCafes])
      })
    }
  }

  useUpdateEffect(getSelectedCafes, selectedAreas)

  return (
    <Flex as="section" direction="column" align="center">
      <Heading as="h1" size="xl">
        {translatedCityName}
      </Heading>

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
          <Text my="3">共收錄 {cityCafes.length} 間</Text>
          <FilteredByDist
            translatedCityName={translatedCityName}
            setSelectedAreas={setSelectedAreas}
            setUpdatedCafes={setUpdatedCafes}
          />
          <Flex w="100%" direction="column" as="section">
            <Text>
              {updatedCafes.length > 0
                ? `搜尋結果： ${updatedCafes.length} 間`
                : '所有收錄咖啡廳'}
            </Text>
            <Flex
              wrap="wrap"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              {currentCafes.map(cafe => (
                <CafeCard key={cafe.id} cafe={cafe} />
              ))}
            </Flex>
            <Box alignSelf="center">
              <Pagination
                cafesPerPage={cafesPerPage}
                totalCafes={
                  updatedCafes.length > 0
                    ? updatedCafes.length
                    : cityCafes.length
                }
                paginate={paginate}
              />
            </Box>
          </Flex>
        </>
      )}
    </Flex>
  )
}

export default City
