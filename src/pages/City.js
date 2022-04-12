// import { useContext } from 'react'
// import CityContext from '../contexts/CityContext'

function City({ cityLinkEndpoint }) {
  // const { cityLinkEndpoint } = useContext(CityContext)
  console.log('From city page: ', cityLinkEndpoint)

  return <div>Show {cityLinkEndpoint} cafes</div>
}

export default City
