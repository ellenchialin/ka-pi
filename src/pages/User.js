import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// prettier-ignore
import { Flex, Heading, Image, Text, Spinner, IconButton, Button } from '@chakra-ui/react'
import { AiOutlineMessage } from 'react-icons/ai'
import { firebase } from '../utils/firebase'
import CafeCard from '../components/cafe/CafeCard'

function User({ userId, setUserId, setIsSignedIn }) {
  console.log('In User Page, current user id: ', userId)

  const [currentUser, setCurrentUser] = useState({})
  const [savedCafes, setSavedCafes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()

  const getFavCafes = cafesId => {
    fetch('https://ka-pi-server.herokuapp.com/allcafes')
      .then(res => res.json())
      .then(data => {
        const cafeList = data.filter(cafe => {
          return cafesId.some(id => {
            return id === cafe.id
          })
        })
        setSavedCafes(cafeList)
        console.log('User cafes list: ', cafeList)
      })
      .catch(error =>
        alert('無法取得咖啡廳資料庫，請確認網路連線，或聯繫開發人員')
      )
  }

  useEffect(() => {
    firebase
      .getUser(userId)
      .then(data => {
        console.log('Get user data: ', data)
        setCurrentUser(data)
        getFavCafes(data.favCafes)
      })
      .catch(error => alert('無法取得個人資訊，請確認網路連線，或聯繫開發人員'))
      .finally(() => setIsLoading(false))
  }, [])

  const handleSignout = () => {
    firebase.signout().then(() => {
      setUserId('')
      setIsSignedIn(false)
      navigate('/')
    })
  }

  return (
    <Flex direction="column">
      {isLoading ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.600"
          siz="xl"
          mt="6"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        />
      ) : (
        <>
          <Flex w="100%" align="center" justify="space-between">
            <Image
              borderRadius="full"
              boxSize="90px"
              objectFit="cover"
              src={currentUser.photo}
              alt={currentUser.name}
            />
            <IconButton
              colorScheme="blackAlpha"
              aria-label="查看訊息"
              fontSize="20px"
              icon={<AiOutlineMessage />}
              isRound
            />
          </Flex>
          <Flex align="center" my="2">
            <Heading as="h4" size="lg" mr="4">
              {currentUser.name}
            </Heading>
            <Text>{currentUser.email}</Text>
          </Flex>
          <Text>
            共蒐藏{' '}
            {currentUser.favCafes.length > 0 ? currentUser.favCafes.length : 0}{' '}
            間咖啡廳
          </Text>
          <Flex
            w="100%"
            wrap="wrap"
            justifyContent="space-between"
            alignItems="flex-start"
            as="section"
          >
            {savedCafes.map(cafe => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
          </Flex>
          <Button onClick={handleSignout}>Sign out</Button>
        </>
      )}
    </Flex>
  )
}

export default User
