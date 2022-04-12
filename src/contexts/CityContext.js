import { createContext } from 'react'

const CityContext = createContext({
  cityLinkEndpoint: 'taipei',
  setCityLinkEndpoint: () => {},
})

export default CityContext
