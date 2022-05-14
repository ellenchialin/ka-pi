import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
// prettier-ignore
import { Flex, Box, AspectRatio, Image, Heading, Text, IconButton, Button, useColorModeValue, VStack } from '@chakra-ui/react'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { EditorState, convertFromRaw } from 'draft-js'

function BlogCard({
  cafeId,
  blogId,
  content,
  title,
  image,
  date,
  canDeleteBlog,
  handleBlogDelete,
}) {
  const [editorState] = useState(
    EditorState.createWithContent(convertFromRaw(content))
      .getCurrentContent()
      .getPlainText()
  )

  const navigate = useNavigate()

  const handleReadmore = () => {
    navigate(`/cafe/${cafeId}/blog/${blogId}`)
  }

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
              {date}
            </Text>
          </VStack>
          {/*<Flex alignItems="center" justify="space-between" p="4">
            <Button
              onClick={handleReadmore}
              size="sm"
              bg="thirdDark"
              color="primaryLight"
              fontSize="0.75rem"
              _hover={{ bg: 'primaryDark' }}
            >
              看更多
            </Button>
          </Flex>*/}
        </Link>
      </Box>
    </>
  )
}

BlogCard.propTypes = {
  cafeId: PropTypes.string,
  blogId: PropTypes.string,
  content: PropTypes.object,
  title: PropTypes.string,
  image: PropTypes.string,
  date: PropTypes.string,
  canDeleteBlog: PropTypes.bool,
  handleBlogDelete: PropTypes.func,
}

export default BlogCard
