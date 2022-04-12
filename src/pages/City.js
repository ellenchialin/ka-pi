import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Flex, Heading, Text, Spinner } from '@chakra-ui/react'
import FilterBoard from '../components/FilterBoard'
import CafeCard from '../components/cafe/CafeCard'
import nomad from '../utils/nomadApi'
import { cityData } from '../helpers'

function City() {
  const [translatedCityName, setTranslatedCityName] = useState('')
  const [cityCafes, setCityCafes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { cityName } = useParams()

  const convertCityName = city => {
    console.log('From city page: ', city)

    if (city === 'taipei' || city === 'new_taipei') {
      setTranslatedCityName('臺北市 / 新北市')
      return
    } else {
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
          <FilterBoard translatedCityName={translatedCityName} />
          <Flex
            w="100%"
            wrap="wrap"
            justifyContent="space-between"
            alignItems="flex-start"
            as="section"
          >
            {cityCafes.map(cafe => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
          </Flex>
        </>
      )}
    </Flex>
  )
}

export default City
