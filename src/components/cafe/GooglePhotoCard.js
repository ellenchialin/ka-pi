import PropTypes from 'prop-types'
import { Image, AspectRatio } from '@chakra-ui/react'

function GooglePhotoCard({ photoRef }) {
  return (
    <AspectRatio w="100%" maxW="220px" ratio={1}>
      <Image
        src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`}
        objectFit="cover"
        alt="網友分享照"
        borderRadius="lg"
      />
    </AspectRatio>
  )
}

GooglePhotoCard.propTypes = {
  photoRef: PropTypes.string.isRequired,
}

export default GooglePhotoCard
