import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
        w="100%"
        maxW="280px"
        h="100%"
        minH={{ sm: '300px', md: '360px' }}
        bg="white"
        borderWidth={useColorModeValue('1px', '0px')}
        rounded="lg"
        shadow="lg"
        color="primaryDark"
        position="relative"
      >
        <AspectRatio maxW="100%" ratio={{ base: 16 / 9, sm: 4 / 3, md: 1 }}>
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
        <VStack spacing="2" p="4" align="flex-start">
          <Flex alignItems="center" justifyContent="space-between">
            <Heading w="full" as="h5" size="sm" isTruncated>
              {title}
            </Heading>
          </Flex>
          <Text w="full" fontSize="0.875em" noOfLines={2} isTruncated>
            {editorState}
          </Text>
        </VStack>
        <Flex alignItems="center" justify="space-between" p="4">
          <Text fontSize="0.75em">{date}</Text>
          <Button
            onClick={handleReadmore}
            size="sm"
            bg="secondaryLight"
            color="primaryDark"
            fontSize="0.75rem"
            _hover={{ bg: 'gray.400', color: 'primaryLight' }}
          >
            Read More
          </Button>
        </Flex>
      </Box>
    </>
  )
}

export default BlogCard
