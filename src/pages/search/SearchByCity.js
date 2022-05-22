import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Flex,
  Heading,
  Text,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react'

import TaiwanMap from '../../components/map/TaiwanMap'
import CityInfoCard from '../../components/map/CityInfoCard'
import City from '../City'
import AlertModal from '../../components/shared/AlertModal'
import { api } from '../../utils/api'

function SearchByCity() {
  const [clickedCity, setClickedCity] = useState(null)
  const [hasCityParam, setHasCityParam] = useState(false)
  const [cityChineseName, setCityChineseName] = useState('')
  const [cityCafes, setCityCafes] = useState([])
  const [taipeiCafes, setTaipeiCafes] = useState([])
  const [newTaipeiCafes, setNewTaipeiCafes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    setHasCityParam(searchParams.has('city'))
  }, [searchParams])

  const getCafes = (cityName, fetchCity, setCityState) => {
    setIsLoading(true)
    api
      .getCityCafes(fetchCity)
      .then(data => {
        setTaipeiCafes([])
        setNewTaipeiCafes([])

        if (cityName === 'new_taipei') {
          setCityState(data.filter(cafe => cafe.address.includes('新北')))
          return
        }
        if (cityName === 'taipei') {
          setCityState(data.filter(cafe => cafe.address.includes('台北')))
          return
        }
        setCityState(data)
      })
      .catch(error => {
        onGetCafesAlertOpen()
        console.error(error)
      })
      .finally(() => setIsLoading(false))
  }

  const {
    isOpen: isGetCafesAlertOpen,
    onOpen: onGetCafesAlertOpen,
    onClose: onGetCafesAlertClose,
  } = useDisclosure()

  const cityInfoCardBgColor = useColorModeValue('primaryDark', 'primaryLight')
  const cityInfoCardTextColor = useColorModeValue('primaryLight', 'primaryDark')

  return (
    <Flex w="full" maxW="1170px" h="100%" direction="column" align="center">
      {!hasCityParam ? (
        <>
          <Heading as="h2" mb="3" fontSize={{ base: '28px', md: '40px' }}>
            遊走城市之間
          </Heading>
          <Flex
            w="100%"
            direction="column"
            alignItems="center"
            position="relative"
          >
            <Flex
              w="100%"
              maxW="180px"
              h="100%"
              minH="115px"
              rounded="lg"
              shadow="lg"
              p="3"
              justify="center"
              align="center"
              bg={cityInfoCardBgColor}
              color={cityInfoCardTextColor}
            >
              {cityChineseName === '' ? (
                <Text>點擊城市看更多</Text>
              ) : (
                <CityInfoCard
                  clickedCity={clickedCity}
                  cityChineseName={cityChineseName}
                  cityCafes={cityCafes}
                  taipeiCafes={taipeiCafes}
                  newTaipeiCafes={newTaipeiCafes}
                  isLoading={isLoading}
                />
              )}
            </Flex>
            <TaiwanMap
              setClickedCity={setClickedCity}
              setCityChineseName={setCityChineseName}
              setCityCafes={setCityCafes}
              setTaipeiCafes={setTaipeiCafes}
              setNewTaipeiCafes={setNewTaipeiCafes}
              getCafes={getCafes}
            />
          </Flex>

          <AlertModal
            isAlertOpen={isGetCafesAlertOpen}
            onAlertClose={onGetCafesAlertClose}
            alertHeader="Oops! 暫無法取得咖啡廳資料"
            alertBody="請確認網路連線並重新操作，或聯繫開發人員 chialin76@gmail.com "
          />
        </>
      ) : (
        <City />
      )}
      {/* showCityCafeList && <City />*/}
    </Flex>
  )
}

export default SearchByCity
