import { Image, AspectRatio } from '@chakra-ui/react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

function ImageSlider({ slides }) {
  return (
    <Carousel
      infiniteLoop
      autoPlay
      stopOnHover
      showStatus={false}
      showThumbs={false}
    >
      {slides.map((slide, i) => (
        <AspectRatio key={i} ratio={16 / 9}>
          <Image
            key={i}
            src={slide}
            alt="食記照片"
            rounded="lg"
            fit="cover"
            height="auto"
            w="800px"
          />
        </AspectRatio>
      ))}
    </Carousel>
  )
}

export default ImageSlider
