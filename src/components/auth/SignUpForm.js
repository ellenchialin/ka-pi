import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// prettier-ignore
import { Flex, FormControl, FormLabel, FormErrorMessage, Input, Button, InputGroup, InputRightElement, IconButton, useDisclosure } from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

import AlertModal from '../shared/AlertModal'
import { useAuth } from '../../contexts/AuthContext'

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [alertBody, setAlertBody] = useState('')
  const { signup } = useAuth()
  const navigate = useNavigate()

  const {
    isOpen: isSignUpAlertOpen,
    onOpen: onSignUpAlertOpen,
    onClose: onSignUpAlertClose,
  } = useDisclosure()

  const SignupSchema = Yup.object().shape({
    name: Yup.string().required('請填入顯示名稱'),
    email: Yup.string()
      .email('格式錯誤，請填寫正確的信箱格式')
      .required('請填入信箱'),
    password: Yup.string().min(6, '密碼需大於六位數').required('請填入密碼'),
  })

  const handleSignUp = (name, email, password) => {
    signup(name, email, password)
      .then(() => navigate(-1))
      .catch(error => {
        setAlertBody(error.message)
        onSignUpAlertOpen()
        console.error(error.message)
      })
  }

  return (
    <Flex direction="column" align="center">
      <Flex w="100%" direction="column">
        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={SignupSchema}
          onSubmit={values => {
            const { name, email, password } = values
            handleSignUp(name, email, password)
          }}
        >
          {({ handleSubmit, errors, touched }) => (
            <Form onSubmit={handleSubmit}>
              <Flex direction="column" align="center">
                <FormControl
                  isInvalid={errors.name && touched.name}
                  mb="2"
                  h="100px"
                >
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Field as={Input} name="name" type="text" />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>

                <FormControl
                  isInvalid={errors.email && touched.email}
                  mb="2"
                  h="100px"
                >
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Field as={Input} name="email" type="email" />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl
                  isInvalid={errors.password && touched.password}
                  mb="2"
                  h="100px"
                >
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <InputGroup>
                    <Field
                      as={Input}
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                    />
                    <InputRightElement>
                      <IconButton
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
                <Button mt={4} type="submit" w="113px" variant="auth-buttons">
                  註冊
                </Button>

                <AlertModal
                  isAlertOpen={isSignUpAlertOpen}
                  onAlertClose={onSignUpAlertClose}
                  alertHeader="Oops! 註冊失敗"
                  alertBody={alertBody}
                />
              </Flex>
            </Form>
          )}
        </Formik>
      </Flex>
    </Flex>
  )
}

export default SignUpForm
