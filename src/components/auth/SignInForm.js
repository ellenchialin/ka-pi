import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// prettier-ignore
import { Flex, FormControl, FormLabel, FormErrorMessage, Input, Button, Text, IconButton, InputGroup, InputRightElement } from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { FaGoogle } from 'react-icons/fa'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../../contexts/AuthContext'

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { signin, googleSignIn } = useAuth()

  const SigninSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be 6 characters at minimum')
      .required('Password is required'),
  })

  const handleSignIn = (email, password) => {
    signin(email, password).then(user => {
      navigate(-1)
    })
  }

  const handleGoogleSignIn = () => {
    console.log('click google sign in')
    googleSignIn().then(user => console.log('Signed in from google', user))
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
                <FormControl isInvalid={errors.email && touched.email} mb="2">
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Field as={Input} type="email" name="email" />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl
                  isInvalid={errors.password && touched.password}
                  mb="2"
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
                  Sign In
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
        <Text my="6">or sign in with...</Text>
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
      </Flex>
    </Flex>
  )
}

export default SignInForm
