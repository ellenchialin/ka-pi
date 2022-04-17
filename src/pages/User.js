import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// prettier-ignore
import { Flex, Heading, FormControl, FormLabel, FormErrorMessage, Image, Text, Spinner, Icon, IconButton, Button, Tabs, TabList, Tab, TabPanels, TabPanel, useDisclosure, Modal, ModalOverlay, ModalContent, ModalFooter, ModalBody, ModalCloseButton, Input, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'
import { AiOutlineMessage } from 'react-icons/ai'
// import { FaFacebookF, FaGoogle } from 'react-icons/fa'
// import { useFormik, Formik, Form, Field } from 'formik'
// import * as Yup from 'yup'
import { firebase } from '../utils/firebase'

function User({ userId }) {
  const [currentUser, setCurrentUser] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  // const { isOpen, onOpen, onClose } = useDisclosure()

  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(false)
    // firebase.getUser(userId)
  }, [])

  const handleSignout = () => {
    firebase.signout()
    navigate('/auth')
  }

  /*
  const SignTabs = ({ setIsSignedIn }) => {
    return (
      <Tabs align="center">
        <TabList>
          <Tab>Sign in</Tab>
          <Tab>Sign up</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SignInForm setIsSignedIn={setIsSignedIn} setCurrentUser={setCurrentUser} />
          </TabPanel>
          <TabPanel>
            <SignUpForm setIsSignedIn={setIsSignedIn} setCurrentUser={setCurrentUser} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    )
  }

  const SignInForm = ({ setIsSignedIn }) => {
    const SigninSchema = Yup.object().shape({
      email: Yup.string()
        .email('Invalid email address format')
        .required('Email is required'),
      password: Yup.string()
        .min(3, 'Password must be 3 characters at minimum')
        .required('Password is required'),
    })

    return (
      <Flex direction="column" align="center">
        <Flex w="100%" direction="column">
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={SigninSchema}
            onSubmit={({ setSubmitting }) => {
              alert('Form is validated! Submitting the form...')
              setSubmitting(false)
            }}
          >
            {props => (
              <Form>
                <Flex direction="column" align="center">
                  <Field type="email" name="email">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.email && form.touched.email}
                        mb="2"
                      >
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input {...field} type="email" id="email" />
                        <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field type="password" name="password">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.password && form.touched.password
                        }
                      >
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input {...field} type="password" id="password" />
                        <FormErrorMessage>
                          {form.errors.password}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Button
                    mt={4}
                    colorScheme="facebook"
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
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

  const SignUpForm = ({ setIsSignedIn }) => {
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
      firebase
        .nativeSignUp(name, email, password)
        .then((user) => {
          setIsSignedIn(true)
        })
    }

    return (
      <Flex direction="column" align="center">
        <Flex w="100%" direction="column">
          <Formik
            initialValues={{ name: '', email: '', password: '' }}
            validationSchema={SignupSchema}
            onSubmit={values => {
              console.log(values)
              const { name, email, password } = values
              signUp(name, email, password)
            }}
          >
            {({ handleSubmit, errors, touched }) => (
              <Form onSubmit={handleSubmit}>
                <Flex direction="column" align="center">
                  <FormControl isInvalid={errors.name && touched.name} mb="2">
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <Field as={Input} id="name" name="name" type="text" />
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.email && touched.email} mb="2">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Field as={Input} id="email" name="email" type="email" />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isInvalid={errors.password && touched.password}
                    mb="2"
                  >
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type="password"
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>

                  <Field type="password" name="password">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.password && form.touched.password
                        }
                      >
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input
                          {...field}
                          type="password"
                          id="password"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                        />
                        <FormErrorMessage>
                          {form.errors.password}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

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
  */

  return (
    <Flex direction="column">
      {isLoading ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.600"
          siz="xl"
          mt="6"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        />
      ) : (
        <>
          <Flex w="100%" align="center" justify="space-between">
            <Image
              borderRadius="full"
              boxSize="90px"
              src="https://bit.ly/dan-abramov"
              alt="ellen"
            />
            <IconButton
              colorScheme="blackAlpha"
              aria-label="查看訊息"
              fontSize="20px"
              icon={<AiOutlineMessage />}
              isRound
            />
          </Flex>
          <Flex align="center" my="2">
            <Heading as="h4" size="lg" mr="4">
              ellen
            </Heading>
            <Text>ellen@ee.com</Text>
          </Flex>
          <Text>共蒐藏 X 間咖啡廳</Text>
          <Button onClick={handleSignout}>Sign out</Button>
        </>
      )}
    </Flex>
  )
}

export default User
