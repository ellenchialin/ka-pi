import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Flex, Heading, Text, Spinner } from '@chakra-ui/react'
import FilterBoard from '../components/FilterBoard'
import CafeCard from '../components/cafe/CafeCard'
import useFilterEffect from '../hooks/useFilterEffect'
import nomad from '../utils/nomadApi'
import { cityData } from '../helpers'

function City() {
  const [translatedCityName, setTranslatedCityName] = useState('')
  const [cityCafes, setCityCafes] = useState([])
  const [selectedAreas, setSelectedAreas] = useState([])
  const [updatedCafes, setUpdatedCafes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { cityName } = useParams()

  const convertCityName = city => {
    console.log('From city page: ', city)

    if (city === 'taipei' || city === 'new_taipei') {
      setTranslatedCityName('台北市 / 新北市')
      return
    } else {
      console.log(cityData.filter(c => c.tag === city))
      setTranslatedCityName(cityData.filter(c => c.tag === city)[0].place)
    }
  }

  useEffect(() => {
    convertCityName(cityName)
    nomad
      .getCafesByCity(cityName)
      .then(data => {
        console.log(data)
        setCityCafes(data)
      })
      .catch(error => {
        console.error(error)
        alert('暫無法取得咖啡廳資料，請通知開發人員')
      })
      .finally(() => setIsLoading(false))
  }, [])

  // 判斷選到行政區的咖啡廳
  const getSelectedCafes = () => {
    console.log(selectedAreas)

    if (selectedAreas.length > 0) {
      setUpdatedCafes([])

      selectedAreas.forEach(area => {
        const filteredCafes = cityCafes.filter(cafe =>
          cafe.address.includes(area)
        )
        setUpdatedCafes(prev => [...prev, ...filteredCafes])
      })
      // console.log('Updated Cafes: ', updatedCafes)
    }
  }

  useFilterEffect(getSelectedCafes, selectedAreas)

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
          <FilterBoard
            translatedCityName={translatedCityName}
            setSelectedAreas={setSelectedAreas}
          />
          <Flex w="100%" direction="column" as="section">
            <Text>
              共
              {updatedCafes.length > 0 ? updatedCafes.length : cityCafes.length}{' '}
              間
            </Text>
            <Flex
              wrap="wrap"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              {updatedCafes.length > 0
                ? updatedCafes.map(cafe => (
                    <CafeCard key={cafe.id} cafe={cafe} />
                  ))
                : cityCafes.map(cafe => <CafeCard key={cafe.id} cafe={cafe} />)}
            </Flex>
          </Flex>
        </>
      )}
    </Flex>
  )
}

export default City
