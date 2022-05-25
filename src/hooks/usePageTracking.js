import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ReactGA from 'react-ga'

function initialiseAnalytics() {
  const TRACKING_ID = process.env.REACT_APP_GA_ID
  ReactGA.initialize(TRACKING_ID)
}

function usePageTracking() {
  const location = useLocation()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!window.location.href.includes('localhost')) {
      initialiseAnalytics()
      setInitialized(true)
    }
  }, [])

  useEffect(() => {
    if (initialized) {
      ReactGA.pageview(location.pathname + location.search)
    }
  }, [initialized, location])
}

export default usePageTracking
