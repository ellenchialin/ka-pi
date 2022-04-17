import { useNavigate } from 'react-router-dom'
// prettier-ignore
import { Tabs, TabList, Tab, TabPanels, TabPanel, Flex, FormControl, FormLabel, FormErrorMessage, Input, Button, IconButton, Text } from "@chakra-ui/react"
import { FaFacebookF, FaGoogle } from 'react-icons/fa'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

import { firebase } from '../utils/firebase'

function Auth({ setIsSignedIn }) {
  const navigate = useNavigate()

  const SignTabs = () => {
    return (
      <Tabs align="center">
        <TabList>
          <Tab>Sign in</Tab>
          <Tab>Sign up</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SignInForm />
          </TabPanel>
          <TabPanel>
            <SignUpForm />
          </TabPanel>
        </TabPanels>
      </Tabs>
    )
  }

  const SignInForm = () => {
    const SigninSchema = Yup.object().shape({
      email: Yup.string()
        .email('Invalid email address format')
        .required('Email is required'),
      password: Yup.string()
        .min(3, 'Password must be 3 characters at minimum')
        .required('Password is required'),
    })

    const signIn = (email, password) => {
      console.log('From auth page, sign in: ', email, password)

      firebase.nativeSignIn(email, password).then(user => {
        console.log('From auth page, sign in: ', user)
        setIsSignedIn(true)
        navigate('/user')
      })
    }

    return (
      <Flex direction="column" align="center">
        <Flex w="100%" direction="column">
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={SigninSchema}
            onSubmit={(values, { resetForm }) => {
              console.log('Sign in input: ', values)
              const { email, password } = values
              signIn(email, password)
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
                    <Field as={Input} type="password" name="password" />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  <Button mt={4} colorScheme="facebook" type="submit">
                    Sign In
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
          <Text my="6">or sign in with...</Text>
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
          </Flex>
        </Flex>
      </Flex>
    )
  }

  const SignUpForm = () => {
    const SignupSchema = Yup.object().shape({
      name: Yup.string().required('Name is required'),
      email: Yup.string()
        .email('Invalid email address format')
        .required('Email is required'),
      password: Yup.string()
        .min(3, 'Password must be 3 characters at minimum')
        .required('Password is required'),
    })

    const signUp = (name, email, password) => {
      firebase.nativeSignUp(name, email, password)
      setIsSignedIn(true)
      // navigate('/user')
    }

    return (
      <Flex direction="column" align="center">
        <Flex w="100%" direction="column">
          <Formik
            initialValues={{ name: '', email: '', password: '' }}
            validationSchema={SignupSchema}
            onSubmit={values => {
              // console.log(values)
              const { name, email, password } = values
              signUp(name, email, password)
            }}
          >
            {({ handleSubmit, errors, touched }) => (
              <Form onSubmit={handleSubmit}>
                <Flex direction="column" align="center">
                  <FormControl isInvalid={errors.name && touched.name} mb="2">
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <Field as={Input} name="name" type="text" />
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.email && touched.email} mb="2">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Field as={Input} name="email" type="email" />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isInvalid={errors.password && touched.password}
                    mb="2"
                  >
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Field as={Input} name="password" type="password" />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  <Button mt={4} type="submit" colorScheme="facebook">
                    Sign up
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        </Flex>
      </Flex>
    )
  }

  return <SignTabs />
}

export default Auth
