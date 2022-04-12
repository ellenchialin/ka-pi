import { useContext } from 'react'
import CityContext from '../contexts/CityContext'

function City() {
  const { cityLinkEndpoint } = useContext(CityContext)

  return <div>Show {cityLinkEndpoint} cafes</div>
}

export default City
