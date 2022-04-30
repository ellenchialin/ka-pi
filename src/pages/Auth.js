import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import SignInForm from '../components/auth/SignInForm'
import SignUpForm from '../components/auth/SignUpForm'
import usePageTracking from '../usePageTracking'

function Auth() {
  usePageTracking()

  const SignTabs = () => {
    return (
      <Tabs w="70%" align="center" colorScheme="teal" maxW="500px">
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

  return <SignTabs />
}

export default Auth
