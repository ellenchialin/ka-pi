import { useNavigate } from 'react-router-dom'
// prettier-ignore
import { Flex, Box, AspectRatio, Image, Heading, Text, IconButton, Button } from '@chakra-ui/react'
import { RiDeleteBin5Line } from 'react-icons/ri'

function BlogCard({
  cafe,
  blogId,
  content,
  title,
  images,
  date,
  canDeleteBlog,
  handleBlogDelete,
}) {
  const navigate = useNavigate()
  const coverImage = images[0]

  const handleReadmore = () => {
    // const cafeId = cafe.id
    navigate(`blog/${blogId}`)
  }

  return (
    <>
      <Box
        w="100%"
        maxW={{ sm: '300px', md: '230px' }}
        h="100%"
        minH={{ sm: '430px', md: '360px' }}
        bg="white"
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        mb="6"
        position="relative"
      >
        <AspectRatio maxW="100%" ratio={1}>
          <Image
            src={coverImage}
            alt={`${cafe.name} 食記照片`}
            roundedTop="lg"
            objectFit="cover"
          />
        </AspectRatio>
        {canDeleteBlog && (
          <IconButton
            icon={<RiDeleteBin5Line />}
            aria-label="刪除此食記"
            fontSize="20px"
            position="absolute"
            top="10px"
            right="10px"
            variant="solid"
            colorScheme="blackAlpha"
            size="sm"
            onClick={handleBlogDelete}
          />
        )}
        <Flex direction="column" p="4" h="100%" justify="space-between">
          <Flex alignItems="center" justifyContent="space-between">
            <Heading as="h5" size="sm" isTruncated>
              {title}
            </Heading>
          </Flex>
          <Text fontSize="0.75em" mb="auto" noOfLines={3}>
            {content}
          </Text>
        </Flex>
        <Flex alignItems="center" justify="space-between" px="4">
          <Text fontSize="0.75em">{date}</Text>
          <Button onClick={handleReadmore} variant="link" fontSize="0.75rem">
            Read More
          </Button>
        </Flex>
      </Box>
    </>
  )
}

export default BlogCard
