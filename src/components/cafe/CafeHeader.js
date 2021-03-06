import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
// prettier-ignore
import { Flex, Heading, Text, Icon, Link, HStack, useToast, useDisclosure } from '@chakra-ui/react'
import { StarIcon, CheckCircleIcon } from '@chakra-ui/icons'
import { AiOutlineGlobal } from 'react-icons/ai'
import { RiDirectionFill } from 'react-icons/ri'

import { useAuth } from '../../contexts/AuthContext'
import { firebase } from '../../utils/firebase'
import SaveCafeButton from './SaveCafeButton'
import AlertModal from '../shared/AlertModal'

function CafeHeader({ cafe, cafeCoverUrl }) {
  const [toggleSaved, setToggleSaved] = useState(false)

  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const successToast = useToast()

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()
  const {
    isOpen: isSaveCafeAlertOpen,
    onOpen: onSaveCafeAlertOpen,
    onClose: onSaveCafeAlertClose,
  } = useDisclosure()

  useEffect(() => {
    if (currentUser) {
      firebase
        .getUserSavedCafes(currentUser.uid)
        .then(list => {
          const cafeIdList = list.map(item => item.cafeId)
          const found = id => id === cafe.id
          setToggleSaved(cafeIdList.some(found))
        })
        .catch(error => console.error(error.message))
    }
  }, [])

  const handleToggleSaved = () => {
    if (!currentUser) {
      onAlertOpen()
      return
    }

    if (toggleSaved) {
      firebase
        .deleteSavedCafe(currentUser.uid, cafe.id)
        .then(() => {
          setToggleSaved(prev => !prev)
          showToast()
        })
        .catch(error => {
          onSaveCafeAlertOpen()
          console.error(error.message)
        })
      return
    }
    firebase
      .saveCafe(currentUser.uid, cafe.id)
      .then(() => {
        setToggleSaved(prev => !prev)
        showToast()
      })
      .catch(error => {
        onSaveCafeAlertOpen()
        console.error(error.message)
      })
  }

  const showToast = () => {
    successToast({
      position: 'top-right',
      duration: 3000,
      render: () => (
        <HStack
          spacing="4"
          color="primaryDark"
          p={3}
          bg="teal.200"
          borderRadius="md"
        >
          <Icon as={CheckCircleIcon} />
          <Text>???{toggleSaved ? '??????' : '??????'}??????</Text>
        </HStack>
      ),
      isClosable: true,
    })
  }

  const handleAlertAction = () => navigate('/auth')

  return (
    <Flex
      w="100%"
      h="100%"
      py="4"
      px="2"
      mb="4"
      minH="300px"
      bgImage={`linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(${cafeCoverUrl()})`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      borderRadius="xl"
      direction="column"
      align="center"
      justify="center"
      position="relative"
    >
      <HStack spacing="5px">
        <Text color="primaryLight">{cafe.tasty}</Text>
        <StarIcon w="3" h="3" color="primaryLight" />
      </HStack>
      <Heading
        as="h1"
        fontSize={{ base: '28px', md: '40px' }}
        letterSpacing="widest"
        align="center"
        pt="2"
        pb="4"
        color="primaryLight"
      >
        {cafe.name}
      </Heading>

      <HStack spacing="20px">
        <HStack align="center" spacing="10px">
          <Icon as={RiDirectionFill} color="white" />
          <Link
            href={`https://www.google.com/maps/place/${cafe.latitude},${cafe.longitude}/@${cafe.latitude},${cafe.longitude},16z`}
            fontSize="0.875rem"
            color="primaryLight"
            isExternal
          >
            Direction
          </Link>
        </HStack>
        <HStack align="center" spacing="10px">
          <Icon as={AiOutlineGlobal} color="white" />
          <Link
            href={`${cafe.url}`}
            fontSize="0.875rem"
            color="primaryLight"
            isExternal
          >
            Website
          </Link>
        </HStack>
      </HStack>
      <SaveCafeButton
        toggleSaved={toggleSaved}
        handleToggleSaved={() => handleToggleSaved()}
      />

      <AlertModal
        isAlertOpen={isAlertOpen}
        onAlertClose={onAlertClose}
        alertHeader="Oops! ????????????"
        alertBody="???????????????????????????"
        actionText="????????????"
        alertAction={() => handleAlertAction()}
      />
      <AlertModal
        isAlertOpen={isSaveCafeAlertOpen}
        onAlertClose={onSaveCafeAlertClose}
        alertHeader="Oops! ????????????"
        alertBody="???????????????????????????????????????????????????????????????????????? chialin76@gmail.com"
      />
    </Flex>
  )
}

CafeHeader.propTypes = {
  cafe: PropTypes.shape({
    name: PropTypes.string.isRequired,
    tasty: PropTypes.number.isRequired,
    latitude: PropTypes.string.isRequired,
    longitude: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
  cafeCoverUrl: PropTypes.func,
}

export default CafeHeader
