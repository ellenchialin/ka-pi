import React from 'react'
import PropTypes from 'prop-types'
// prettier-ignore
import { Heading, Text, Icon, HStack, VStack, Stack, SimpleGrid } from '@chakra-ui/react'
import { VscPerson } from 'react-icons/vsc'
import { BiAlarmExclamation, BiPlug } from 'react-icons/bi'

import RatingStats from './RatingStats'

const mapLimitedToString = {
  no: '不限時',
  maybe: '視平假日',
  yes: '有限時',
}

const mapSocketToString = {
  no: '很少',
  maybe: '部分',
  yes: '很多',
}

const mapStandingToString = {
  no: '沒有',
  yes: '部分',
}

function RatingStatsGroup({ cafe }) {
  const primaryFeatures = [
    {
      name: '有無限時',
      icon: BiAlarmExclamation,
      displayInfo: mapLimitedToString[cafe.limited_time] || '無資訊',
    },
    {
      name: '有無插座',
      icon: BiPlug,
      displayInfo: mapSocketToString[cafe.socket] || '無資訊',
    },
    {
      name: '站立座位',
      icon: VscPerson,
      displayInfo: mapStandingToString[cafe.standing_desk] || '無資訊',
    },
  ]

  return (
    <>
      <Stack
        spacing={{ base: '20px', md: '50px', lg: '70px' }}
        direction={['column', 'row']}
        mt="2"
        mb="4"
      >
        <RatingStats
          feature1={{ name: 'WiFi穩定', value: cafe.wifi }}
          feature2={{
            name: '價格親民',
            value: cafe.cheap,
          }}
        />
        <RatingStats
          feature1={{ name: '安靜程度', value: cafe.quiet }}
          feature2={{
            name: '裝潢音樂',
            value: cafe.music,
          }}
        />
      </Stack>

      <SimpleGrid
        w="full"
        columns={[1, 1, 3]}
        gridAutoRows="114px"
        spacing="20px"
        justifyItems="center"
        mb="16"
      >
        {primaryFeatures.map(feature => (
          <HStack
            key={feature.name}
            w="100%"
            maxW={{ base: '100%', md: '200px', lg: '250px', xl: '280px' }}
            spacing={{ base: '40px', md: '20px', lg: '40px' }}
            justify="center"
            bg="primaryDark"
            color="primaryLight"
            rounded="lg"
            shadow="md"
            px="2"
            py="3"
          >
            <VStack
              spacing="2"
              align="flex-start"
              w={{ sm: '65px', md: '100px' }}
            >
              <Text>{feature.name}</Text>
              <Heading as="h4" fontSize="1.5rem">
                {feature.displayInfo}
              </Heading>
            </VStack>
            <Icon
              as={feature.icon}
              boxSize={feature.icon === VscPerson ? '40px' : '34px'}
              color="accent"
            />
          </HStack>
        ))}
      </SimpleGrid>
    </>
  )
}

RatingStatsGroup.propTypes = {
  cafe: PropTypes.shape({
    limited_time: PropTypes.string.isRequired,
    socket: PropTypes.string.isRequired,
    standing_desk: PropTypes.string.isRequired,
    wifi: PropTypes.number.isRequired,
    cheap: PropTypes.number.isRequired,
    quiet: PropTypes.number.isRequired,
    music: PropTypes.number.isRequired,
  }),
}

export default RatingStatsGroup
