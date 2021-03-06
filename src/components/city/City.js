import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
// prettier-ignore
import { Flex, Text, SimpleGrid, Box, useDisclosure } from '@chakra-ui/react'

import CityHeader from './CityHeader'
import DistrictFilterBoard from './DistrictFilterBoard'
import CafeCard from '../cafe/CafeCard'
import AlertModal from '../shared/AlertModal'
import CustomBreadcrumb from '../shared/CustomBreadcrumb'
import CustomSpinner from '../shared/CustomSpinner'
import CustomPagination from '../shared/CustomPagination'
import useUpdateEffect from '../../hooks/useUpdateEffect'
import { api } from '../../utils/api'
import { cityData } from '../../utils/cityData'

function City() {
  const [translatedCityName, setTranslatedCityName] = useState('')
  const [cityCafes, setCityCafes] = useState([])
  const [selectedAreas, setSelectedAreas] = useState([])
  const [updatedCafes, setUpdatedCafes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const scrollToTopRef = useRef(null)
  const [searchParams] = useSearchParams()
  const cityName = searchParams.get('city')

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  const [currentPage, setCurrentPage] = useState(1)
  const [cafesPerPage] = useState(10)
  const offset = (currentPage - 1) * cafesPerPage
  const currentCafes =
    updatedCafes.length > 0
      ? updatedCafes.slice(offset, offset + cafesPerPage)
      : cityCafes.slice(offset, offset + cafesPerPage)

  useEffect(() => {
    convertCityName(cityName, setTranslatedCityName)

    if (cityName === 'new_taipei') {
      getCafes('new_taipei', 'taipei', setCityCafes)
      return
    }
    if (cityName === 'taipei') {
      getCafes('taipei', 'taipei', setCityCafes)
      return
    }

    getCafes(cityName, cityName, setCityCafes)
  }, [])

  const convertCityName = (city, callback) => {
    callback(cityData.find(c => c.tag === city).place)
  }

  const getCafes = (cityName, fetchCity, callback) => {
    api
      .getCityCafes(fetchCity)
      .then(data => {
        if (cityName === 'new_taipei') {
          callback(data.filter(cafe => cafe.address.includes('新北')))
          return
        }
        if (cityName === 'taipei') {
          callback(data.filter(cafe => cafe.address.includes('台北')))
          return
        }
        callback(data)
      })
      .catch(error => {
        onAlertOpen()
        console.error(error)
      })
      .finally(() => setIsLoading(false))
  }

  const getSelectedCafes = () => {
    if (selectedAreas.length > 0) {
      setUpdatedCafes([])
      setCurrentPage(1)

      selectedAreas.forEach(area => {
        const filteredCafes = cityCafes.filter(cafe =>
          cafe.address.includes(area)
        )
        setUpdatedCafes(prev => [...prev, ...filteredCafes])
      })
    }
  }

  useUpdateEffect(getSelectedCafes, selectedAreas)

  return (
    <Flex w="full" maxW="1170px" as="section" direction="column" align="center">
      {isLoading ? (
        <CustomSpinner />
      ) : (
        <>
          <Box alignSelf="flex-start">
            <CustomBreadcrumb
              secondDestination={{
                secondUrl: `/search/taiwan`,
                secondText: '全部城市',
              }}
              currentDestinationText={translatedCityName}
            />
          </Box>
          <CityHeader city={translatedCityName} />
          <Text my="3">共收錄 {cityCafes.length} 間</Text>
          <DistrictFilterBoard
            cityCafes={cityCafes}
            translatedCityName={translatedCityName}
            setSelectedAreas={setSelectedAreas}
            setUpdatedCafes={setUpdatedCafes}
          />
          <Flex w="100%" direction="column" as="section" ref={scrollToTopRef}>
            <Text alignSelf="center" mb="6">
              {updatedCafes.length > 0
                ? `${updatedCafes.length} 間符合`
                : '所有收錄咖啡廳'}
            </Text>
            <SimpleGrid
              w="full"
              minChildWidth="270px"
              spacing="20px"
              justifyItems="center"
              mb="6"
            >
              {currentCafes.map(cafe => (
                <CafeCard key={cafe.id} cafe={cafe} />
              ))}
            </SimpleGrid>
            <CustomPagination
              total={
                updatedCafes.length > 0 ? updatedCafes.length : cityCafes.length
              }
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              cardsPerPage={cafesPerPage}
              scrollToTopRef={scrollToTopRef}
            />
          </Flex>
        </>
      )}
      <AlertModal
        isAlertOpen={isAlertOpen}
        onAlertClose={onAlertClose}
        alertHeader="Oops! 暫無法取得咖啡廳資料"
        alertBody="請確認網路連線並重新操作，或聯繫開發人員 chialin76@gmail.com "
      />
    </Flex>
  )
}

export default City
