import React from 'react'
import {
  InputGroup,
  InputLeftElement,
  Input,
  IconButton,
} from '@chakra-ui/react'
import { RiAddFill } from 'react-icons/ri'

function FileUpload({ name, acceptedFileTypes, children, handleClick }) {
  return (
    <InputGroup>
      {/*<InputLeftElement children={<RiAddFill color="gray.300" />} />*/}
      <IconButton
        colorScheme="blackAlpha"
        aria-label="上傳頭貼"
        fontSize="20px"
        icon={<RiAddFill />}
        isRound
        onClick={handleClick}
      />
      <Input type="file" accept={acceptedFileTypes} name={name} hidden />
      <>{children}</>
    </InputGroup>
  )
}

export default FileUpload
