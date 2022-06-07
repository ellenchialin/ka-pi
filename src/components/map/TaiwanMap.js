import PropTypes from 'prop-types'
import { Box } from '@chakra-ui/react'

import { cityData, taiwanMapPath } from '../../utils/cityData'
import './TaiwanMap.css'

function TaiwanMap({
  setClickedCity,
  setCityChineseName,
  setCityCafes,
  setTaipeiCafes,
  setNewTaipeiCafes,
  getCafes,
}) {
  const convertCityNameToChinese = (name, callback) => {
    const cityChName = cityData.find(city => city.tag === name).place
    callback(cityChName)
  }

  const showCityInfo = selectedCity => {
    convertCityNameToChinese(selectedCity, setCityChineseName)
    setClickedCity(selectedCity)

    if (selectedCity === 'new_taipei') {
      getCafes('new_taipei', 'taipei', setNewTaipeiCafes)
      return
    }
    if (selectedCity === 'taipei') {
      getCafes('taipei', 'taipei', setTaipeiCafes)
      return
    }
    getCafes(selectedCity, selectedCity, setCityCafes)
  }

  return (
    <Box w="100%" maxW="450px">
      <svg
        id="cf503461-00bd-459a-aeb5-062ebc913211"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 595.28 841.89"
        className="taiwanMap"
      >
        <title>台灣地圖</title>
        {taiwanMapPath.map(p => (
          <path
            key={p.id}
            id={p.id}
            data-name={p['data-name']}
            d={p.d}
            onClick={e => showCityInfo(e.target.getAttribute('data-name'))}
          />
        ))}
      </svg>
    </Box>
  )
}

TaiwanMap.propTypes = {
  setClickedCity: PropTypes.func.isRequired,
  setCityChineseName: PropTypes.func.isRequired,
  setCityCafes: PropTypes.func.isRequired,
  setTaipeiCafes: PropTypes.func.isRequired,
  setNewTaipeiCafes: PropTypes.func.isRequired,
  getCafes: PropTypes.func.isRequired,
}

export default TaiwanMap
