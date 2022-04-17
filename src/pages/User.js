import { useState } from 'react'
// prettier-ignore
import { Flex, Heading, FormControl, FormLabel, FormErrorMessage, Image, Text, Spinner, Icon, IconButton, Button, Tabs, TabList, Tab, TabPanels, TabPanel, useDisclosure, Modal, ModalOverlay, ModalContent, ModalFooter, ModalBody, ModalCloseButton, Input, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'
import { AiOutlineMessage } from 'react-icons/ai'
import { FaFacebookF, FaGoogle } from 'react-icons/fa'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

function User() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()

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

    return (
      <Flex direction="column" align="center">
        <Flex w="100%" direction="column">
          <Formik
            initialValues={{ name: '', email: '', password: '' }}
            validationSchema={SignupSchema}
            onSubmit={({ setSubmitting }) => {
              alert('Form is validated! Submitting the form...')
              setSubmitting(false)
            }}
          >
            {props => (
              <Form>
                <Flex direction="column" align="center">
                  <Field type="text" name="name">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                        mb="2"
                      >
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <Input {...field} type="text" id="name" />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

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

  return (
    <Flex direction="column">
      {!isLoggedIn ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>目前尚未登入</AlertTitle>
          <AlertDescription>請先進行登入或註冊</AlertDescription>
          <Button ml="4" size="sm" onClick={onOpen}>
            登入/註冊
          </Button>
          <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered={true}>
            <ModalOverlay />
            <ModalContent h="80%">
              <ModalCloseButton />
              <ModalBody>
                <SignTabs />
              </ModalBody>
            </ModalContent>
          </Modal>
        </Alert>
      ) : (
        <>
          <Flex w="100%" align="center" justify="space-between">
            <Image
              borderRadius="full"
              boxSize="90px"
              src="https://bit.ly/dan-abramov"
              alt="Dan Abramov"
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
              Ellen Chen
            </Heading>
            <Text>aaa@aa.com</Text>
          </Flex>
          <Text>共蒐藏 X 間咖啡廳</Text>
        </>
      )}
    </Flex>
  )
}

export default User
