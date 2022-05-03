import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// prettier-ignore
import { Flex, FormControl, FormLabel, FormErrorMessage, Input, Button, Text, IconButton, InputGroup, InputRightElement } from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { FaFacebookF, FaGoogle } from 'react-icons/fa'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../../contexts/AuthContext'

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { signin } = useAuth()

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
                <Button mt={4} variant="auth-buttons" type="submit">
                  Sign In
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
        {/*<Text my="6">or sign in with...</Text>
        <Flex justify="center">
          <IconButton
            colorScheme="facebook"
            aria-label="Facebook 登入"
            size="lg"
            icon={<FaFacebookF />}
            isRound
            mr="2"
          />
          <IconButton
            colorScheme="facebook"
            aria-label="Google 登入"
            size="lg"
            icon={<FaGoogle />}
            isRound
          />
        </Flex>*/}
      </Flex>
    </Flex>
  )
}

export default SignInForm
