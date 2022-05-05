import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Flex, Heading, Text, Spinner, Box, SimpleGrid } from '@chakra-ui/react'
import Pagination from '@choc-ui/paginator'
import FilteredByDist from '../components/FilteredByDist'
import CafeCard from '../components/cafe/CafeCard'
import useUpdateEffect from '../hooks/useUpdateEffect'
import usePageTracking from '../usePageTracking'
import { api } from '../utils/api'
import { cityData } from '../cityData'

function City() {
  usePageTracking()
  const [translatedCityName, setTranslatedCityName] = useState('')
  const [cityCafes, setCityCafes] = useState([])
  const [selectedAreas, setSelectedAreas] = useState([])
  const [updatedCafes, setUpdatedCafes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const { cityName } = useParams()

  const [currentPage, setCurrentPage] = useState(1)
  const [cafesPerPage] = useState(10)
  const offset = (currentPage - 1) * cafesPerPage
  const currentCafes =
    updatedCafes.length > 0
      ? updatedCafes.slice(offset, offset + cafesPerPage)
      : cityCafes.slice(offset, offset + cafesPerPage)

  useEffect(() => {
    // 城市頁標題，把城市英文轉中文
    convertCityName(cityName)

    if (cityName === 'new_taipei') {
      getCafes('new_taipei', 'taipei', setCityCafes)
    } else if (cityName === 'taipei') {
      getCafes('taipei', 'taipei', setCityCafes)
    } else {
      getCafes(cityName, cityName, setCityCafes)
    }
  }, [])

  const convertCityName = city => {
    setTranslatedCityName(cityData.filter(c => c.tag === city)[0].place)
  }

  const getCafes = (cityName, fetchCity, setCityState) => {
    api
      .getCityCafes(fetchCity)
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

  const getSelectedCafes = () => {
    if (selectedAreas.length > 0) {
      setUpdatedCafes([])

      selectedAreas.forEach(area => {
        const filteredCafes = cityCafes.filter(cafe =>
          cafe.address.includes(area)
        )
        // console.log('filtered Cafes: ', filteredCafes)
        setUpdatedCafes(prev => [...prev, ...filteredCafes])
      })
    }
  }

  useUpdateEffect(getSelectedCafes, selectedAreas)

  return (
    <Flex w="full" maxW="1170px" as="section" direction="column" align="center">
      <Heading as="h1" size="xl">
        {translatedCityName}
      </Heading>

      {isLoading ? (
        <Spinner
          thickness="5px"
          speed="0.65s"
          emptyColor="gray.200"
          color="teal.600"
          size="lg"
          mt="6"
        />
      ) : (
        <>
          <Text my="3">共收錄 {cityCafes.length} 間</Text>
          <FilteredByDist
            cityCafes={cityCafes}
            translatedCityName={translatedCityName}
            setSelectedAreas={setSelectedAreas}
            setUpdatedCafes={setUpdatedCafes}
          />
          <Flex w="100%" direction="column" as="section">
            <Text alignSelf="center" mb="6">
              {updatedCafes.length > 0
                ? `共篩選 ${updatedCafes.length} 間咖啡廳`
                : '所有收錄咖啡廳'}
            </Text>
            <SimpleGrid
              w="full"
              minChildWidth="270px"
              // columns={[1, 2, 3, 4]}
              spacing="20px"
              justifyItems="center"
              mb="6"
            >
              {currentCafes.map(cafe => (
                <CafeCard key={cafe.id} cafe={cafe} />
              ))}
            </SimpleGrid>
            <Box alignSelf="center">
              <Pagination
                defaultCurrent={1}
                total={
                  updatedCafes.length > 0
                    ? updatedCafes.length
                    : cityCafes.length
                }
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
            </Box>
          </Flex>
        </>
      )}
    </Flex>
  )
}

export default City
