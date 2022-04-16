import { Image, AspectRatio } from '@chakra-ui/react'

function IGCard() {
  return (
    <AspectRatio w="100%" maxW="250px" ratio={1}>
      <Image
        src="https://bit.ly/dan-abramov"
        objectFit="cover"
        alt="網友分享照"
      />
    </AspectRatio>
  )
}

export default IGCard
