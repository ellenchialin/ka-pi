import { useState, useEffect, useRef } from 'react'
// prettier-ignore
import { Flex, Heading, Text, SimpleGrid, useDisclosure } from '@chakra-ui/react'

import { api } from '../utils/api'
import { cityData } from '../utils/cityData'
import CafeCard from '../components/cafe/CafeCard'
import Map from '../components/map/Map'
import CustomSpinner from '../components/shared/CustomSpinner'
import AlertModal from '../components/shared/AlertModal'
import CustomPagination from '../components/shared/CustomPagination'
import usePageTracking from '../hooks/usePageTracking'

function Picks() {
  usePageTracking()

  const [userLatitude, setUserLatitude] = useState(null)
  const [userLongitude, setUserLongitude] = useState(null)
  const [defaultLatitude, setDefaultLatitude] = useState(null)
  const [defaultLongitude, setDefaultLongitude] = useState(null)
  const [pickedCafes, setPickedCafes] = useState([])
  const [alertHeader, setAlertHeader] = useState('')
  const [alertBody, setAlertBody] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const scrollToTopRef = useRef(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [cafesPerPage] = useState(18)
  const offset = (currentPage - 1) * cafesPerPage
  const currentCafes = pickedCafes.slice(offset, offset + cafesPerPage)

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  useEffect(() => {
    if (!navigator.geolocation) {
      setFallbackLocation()
      return
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        setUserLatitude(position.coords.latitude)
        setUserLongitude(position.coords.longitude)
        getNearbyCafes(position.coords.latitude, position.coords.longitude)
      },
      () => setFallbackLocation()
    )
  }, [])

  const setFallbackLocation = () => {
    showLocationAlert()
    setDefaultLatitude(25.0384851)
    setDefaultLongitude(121.530177)
    getDefaultCafes()
  }

  const getDefaultCafes = () => {
    api
      .getCityCafes('taipei')
      .then(cafes =>
        setPickedCafes(
          cafes.filter(cafe => cafe.address.includes('??????')).slice(0, 100)
        )
      )
      .catch(error => {
        showGetCafesAlert()
        console.error(error)
      })
      .finally(() => setIsLoading(false))
  }

  const getNearbyCafes = (lat, lng) => {
    api
      .getGoogleGeocode(lat, lng)
      .then(data => {
        let currentCity = data.plus_code.compound_code
          .split(' ')
          .slice(1)[0]
          .slice(2, 4)

        if (currentCity === '??????') {
          getDefaultCafes()
          return
        }
        if (currentCity === '??????') {
          api
            .getCityCafes('taipei')
            .then(cafes =>
              setPickedCafes(
                cafes
                  .filter(
                    cafe => cafe.address.includes('??????') && cafe.tasty >= 4
                  )
                  .slice(0, 100)
              )
            )
            .catch(error => {
              showGetCafesAlert()
              console.error(error)
            })
            .finally(() => setIsLoading(false))
          return
        }

        const city = cityData.find(city => city.place === currentCity).tag
        api
          .getCityCafes(city)
          .then(cafes =>
            setPickedCafes(cafes.filter(cafe => cafe.tasty >= 4).slice(0, 100))
          )
          .catch(error => {
            showGetCafesAlert()
            console.error(error)
          })
          .finally(() => setIsLoading(false))
      })
      .catch(error => {
        showLocationAlert()
        console.error(error)
      })
  }

  const showLocationAlert = () => {
    setAlertHeader('Oops! ????????????????????????')
    setAlertBody(
      '????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????'
    )
    onAlertOpen()
  }

  const showGetCafesAlert = () => {
    setAlertHeader('Oops! ??????????????????????????????')
    setAlertBody(
      '?????????????????????????????????????????????????????????????????????????????? chialin76@gmail.com'
    )
    onAlertOpen()
  }

  return (
    <Flex
      as="section"
      w="full"
      maxW="1170px"
      h="100%"
      direction="column"
      align="center"
    >
      <Heading as="h1" align="center" fontSize={{ base: '28px', md: '40px' }}>
        ???????????????????????????
      </Heading>
      <Text my="3" align="center" fontSize={{ base: '16px', md: '18px' }}>
        ????????????????????????????????? 4 ??????????????????
      </Text>

      {isLoading ? (
        <CustomSpinner />
      ) : (
        <>
          <Map
            userLatitude={userLatitude}
            userLongitude={userLongitude}
            defaultLatitude={defaultLatitude}
            defaultLongitude={defaultLongitude}
            cafes={pickedCafes}
          />
          <SimpleGrid
            w="full"
            minChildWidth="270px"
            spacing="20px"
            justifyItems="center"
            mb="4"
            ref={scrollToTopRef}
          >
            {currentCafes.map(cafe => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
          </SimpleGrid>
          <CustomPagination
            total={pickedCafes.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            cardsPerPage={cafesPerPage}
            scrollToTopRef={scrollToTopRef}
          />
        </>
      )}
      <AlertModal
        isAlertOpen={isAlertOpen}
        onAlertClose={onAlertClose}
        alertHeader={alertHeader}
        alertBody={alertBody}
      />
    </Flex>
  )
}

export default Picks
