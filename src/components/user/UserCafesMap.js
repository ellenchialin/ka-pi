import { useState, useRef } from 'react'
import PropTypes from 'prop-types'
// prettier-ignore
import { Flex, Text, SimpleGrid, Icon, HStack, useToast } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'

import Map from '../map/Map'
import CafeCard from '../cafe/CafeCard'
import CustomPagination from '../CustomPagination'
import { useAuth } from '../../contexts/AuthContext'
import { firebase } from '../../utils/firebase'

function UserCafesMap({
  savedCafes,
  hasLocation,
  userLocation,
  defaultLocation,
  getSavedCafes,
}) {
  const [canDeleteCafe] = useState(true)
  const { userLatitude, userLongitude } = userLocation
  const { defaultLatitude, defaultLongitude } = defaultLocation

  const scrollToTopRef = useRef(null)
  const { currentUser } = useAuth()
  const successToast = useToast()

  const [currentPage, setCurrentPage] = useState(1)
  const [cardsPerPage] = useState(10)
  const offset = (currentPage - 1) * cardsPerPage
  const currentCafes = savedCafes.slice(offset, offset + cardsPerPage)

  const deleteSavedCafe = deletedCafeId => {
    firebase
      .deleteSavedCafe(currentUser.uid, deletedCafeId)
      .then(() => {
        getSavedCafes()

        successToast({
          position: 'top-right',
          duration: 5000,
          render: () => (
            <HStack
              spacing="4"
              color="primaryDark"
              p={3}
              bg="teal.200"
              borderRadius="md"
            >
              <Icon as={CheckCircleIcon} />
              <Text>成功移除收藏</Text>
            </HStack>
          ),
          isClosable: true,
        })
      })
      .catch(error => console.error(error.message))
  }

  return (
    <>
      <Text mb="3">
        {savedCafes.length > 0
          ? `${savedCafes.length} Cafes`
          : '尚未收藏任何咖啡廳'}
      </Text>
      <Flex
        w="100%"
        wrap="wrap"
        justifyContent="space-between"
        alignItems="flex-start"
        as="section"
        mb="6"
      >
        {hasLocation && (
          <Map
            userLatitude={userLatitude}
            userLongitude={userLongitude}
            defaultLatitude={defaultLatitude}
            defaultLongitude={defaultLongitude}
            cafes={savedCafes}
          />
        )}
        <Flex w="full" direction="column" ref={scrollToTopRef}>
          <SimpleGrid
            w="full"
            minChildWidth="270px"
            spacing="20px"
            justifyItems="center"
            mb="4"
          >
            {currentCafes.length > 0 &&
              currentCafes.map(cafe => (
                <CafeCard
                  key={cafe.id}
                  cafe={cafe}
                  canDeleteCafe={canDeleteCafe}
                  handleDeleteCafe={() => deleteSavedCafe(cafe.id)}
                />
              ))}
          </SimpleGrid>
          {savedCafes.length > cardsPerPage && (
            <CustomPagination
              total={savedCafes.length}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              cardsPerPage={cardsPerPage}
              scrollToTopRef={scrollToTopRef}
            />
          )}
        </Flex>
      </Flex>
    </>
  )
}

UserCafesMap.propTypes = {
  savedCafes: PropTypes.array.isRequired,
  hasLocation: PropTypes.bool.isRequired,
  userLocation: PropTypes.shape({
    userLatitude: PropTypes.number,
    userLongitude: PropTypes.number,
  }),
  defaultLocation: PropTypes.shape({
    defaultLatitude: PropTypes.number,
    defaultLongitude: PropTypes.number,
  }),
  getSavedCafes: PropTypes.func.isRequired,
}

export default UserCafesMap
