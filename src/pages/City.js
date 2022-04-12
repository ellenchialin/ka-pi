// import { useContext } from 'react'
// import CityContext from '../contexts/CityContext'
import { useParams } from 'react-router-dom'

function City({ cityLinkEndpoint }) {
  // const { cityLinkEndpoint } = useContext(CityContext)
  const { cityName } = useParams()
  console.log('From city page: ', cityName)

  return <div>Show {cityName} cafes</div>
}

export default City
