import React from 'react'
import { InputGroup, InputLeftElement, Input } from '@chakra-ui/react'
import { RiAddFill } from 'react-icons/ri'

function FileUpload({ name, placeholder, acceptedFileTypes, children }) {
  return (
    <InputGroup>
      <InputLeftElement children={<RiAddFill color="gray.300" />} />
      <input type="file" accept={acceptedFileTypes} name={name} />
      <Input border="none" placeholder={placeholder} />
    </InputGroup>
  )
}

export default FileUpload
