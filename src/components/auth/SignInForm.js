import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// prettier-ignore
import { Flex, FormControl, FormLabel, FormErrorMessage, Input, Button, Text, IconButton, InputGroup, InputRightElement, useDisclosure } from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { FaGoogle } from 'react-icons/fa'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

import AlertModal from '../shared/AlertModal'
import { useAuth } from '../../contexts/AuthContext'

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [alertBody, setAlertBody] = useState('')
  const navigate = useNavigate()
  const { signin, googleSignIn } = useAuth()

  const {
    isOpen: isSignInAlertOpen,
    onOpen: onSignInAlertOpen,
    onClose: onSignInAlertClose,
  } = useDisclosure()

  const SigninSchema = Yup.object().shape({
    email: Yup.string()
      .email('格式錯誤，請填寫正確的信箱格式')
      .required('請填入信箱'),
    password: Yup.string().min(6, '密碼需大於六位數').required('請填入密碼'),
  })

  const handleSignIn = (email, password) => {
    signin(email, password)
      .then(() => navigate(-1))
      .catch(error => {
        setAlertBody(error.message)
        onSignInAlertOpen()
        console.error(error.message)
      })
  }

  const handleGoogleSignIn = () => {
    googleSignIn()
      .then(() => navigate(-1))
      .catch(error => {
        setAlertBody(error.message)
        onSignInAlertOpen()
        console.error(error.message)
      })
  }

  return (
    <Flex direction="column" align="center">
      <Flex w="100%" direction="column">
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={SigninSchema}
          onSubmit={(values, { resetForm }) => {
            const { email, password } = values
            handleSignIn(email, password)
            resetForm()
          }}
        >
          {({ handleSubmit, errors, touched }) => (
            <Form onSubmit={handleSubmit}>
              <Flex direction="column" align="center">
                <FormControl
                  isInvalid={errors.email && touched.email}
                  mb="2"
                  h="100px"
                >
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Field as={Input} type="email" name="email" />
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
                <Button mt={4} variant="auth-buttons" w="113px" type="submit">
                  登入
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
        <Text my="6">或透過以下方式登入</Text>
        <Button
          size="md"
          leftIcon={<FaGoogle fontSize="18px" />}
          variant="auth-thirdParty"
          w="113px"
          alignSelf="center"
          onClick={handleGoogleSignIn}
        >
          Google
        </Button>

        <AlertModal
          isAlertOpen={isSignInAlertOpen}
          onAlertClose={onSignInAlertClose}
          alertHeader="Oops! 登入失敗"
          alertBody={alertBody}
        />
      </Flex>
    </Flex>
  )
}

export default SignInForm
