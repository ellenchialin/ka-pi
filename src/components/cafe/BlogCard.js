import { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
// prettier-ignore
import { Box, AspectRatio, Image, Heading, Text, IconButton, useColorModeValue, VStack } from '@chakra-ui/react'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { EditorState, convertFromRaw } from 'draft-js'

function BlogCard({ blog, canDeleteBlog, handleBlogDelete }) {
  const { cafeId, blogId, content, title, createdAt, image } = blog
  const [editorState] = useState(
    EditorState.createWithContent(convertFromRaw(content))
      .getCurrentContent()
      .getPlainText()
  )

  return (
    <>
      <Box
        w="270px"
        h="-webkit-fit-content"
        bg="white"
        borderWidth={useColorModeValue('1px', '0px')}
        rounded="lg"
        shadow="lg"
        color="primaryDark"
        position="relative"
        _hover={{ transform: 'scale(1.03)' }}
        transition="transform 350ms ease"
      >
        <AspectRatio maxW="100%" ratio={{ base: 16 / 9, sm: 4 / 3 }}>
          <Image src={image} alt="食記照片" roundedTop="lg" objectFit="cover" />
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
        <Link to={`/cafe/${cafeId}/blog/${blogId}`} target="_blank">
          <VStack w="100%" spacing="2" p="4" align="flex-start">
            <Heading w="full" as="h5" size="sm" isTruncated>
              {title}
            </Heading>
            <Text
              w="100%"
              h="100%"
              minH="45px"
              fontSize="0.875em"
              noOfLines={2}
            >
              {editorState}
            </Text>
            <Text fontSize="0.75em" alignSelf="flex-end">
              {createdAt}
            </Text>
          </VStack>
        </Link>
      </Box>
    </>
  )
}

BlogCard.propTypes = {
  cafe: PropTypes.shape({
    cafeId: PropTypes.string.isRequired,
    blogId: PropTypes.string.isRequired,
    content: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }),
  canDeleteBlog: PropTypes.bool,
  handleBlogDelete: PropTypes.func,
}

export default BlogCard
