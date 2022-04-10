import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import { Box } from '@chakra-ui/react'
import nomad from '../../utils/nomadApi'

import { samples } from '../cafeSamples'

const cafeIcon = new Icon({
  iconUrl: '/cafeIcon.png',
  iconSize: [35, 35],
})

function Map({ userLatitude, userLongitude }) {
  // console.log(userLatitude, userLongitude)

  /*
  useEffect(() => {
    nomad
      .getCafesByCity('taipei')
      .then(json => console.log(json))
      .catch(error => alert('無法取得資料庫'))
  }, [])
  */

  return (
    <Box w="100%" h="350px" mb="8">
      <MapContainer
        center={[userLatitude, userLongitude]}
        zoom={13}
        style={{ height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[userLatitude, userLongitude]}>
          <Popup>當前位置</Popup>
        </Marker>
        {samples.map(cafe => (
          <Marker
            key={cafe.id}
            position={[cafe.latitude, cafe.longitude]}
            icon={cafeIcon}
          >
            <Popup position={[cafe.latitude, cafe.longitude]}>
              <div>
                <h4>{cafe.name}</h4>
                <p>{cafe.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  )
}

export default Map
