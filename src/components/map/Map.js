import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import { Box, Link } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import PropTypes from 'prop-types'

const cafeIcon = new Icon({
  iconUrl: '/cafeIcon.png',
  iconSize: [35, 35],
})

function Map({
  userLatitude,
  userLongitude,
  defaultLatitude,
  defaultLongitude,
  cafes,
}) {
  return (
    <Box w="100%" h="350px" mb="8">
      <MapContainer
        center={[
          userLatitude ? userLatitude : defaultLatitude,
          userLongitude ? userLongitude : defaultLongitude,
        ]}
        zoom={13}
        style={{ height: '100%' }}
        tap={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userLatitude && userLongitude && (
          <Marker position={[userLatitude, userLongitude]}>
            <Popup>當前位置</Popup>
          </Marker>
        )}
        {cafes &&
          cafes.map(cafe => (
            <Marker
              key={cafe.id}
              position={[cafe.latitude, cafe.longitude]}
              icon={cafeIcon}
            >
              <Popup position={[cafe.latitude, cafe.longitude]}>
                <div>
                  <h4>{cafe.name}</h4>
                  <p>{cafe.address}</p>

                  <Link href={`/cafe/${cafe.id}`} isExternal>
                    完整資訊 <ExternalLinkIcon mx="2px" />
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </Box>
  )
}

Map.propTypes = {
  userLatitude: PropTypes.number,
  userLongitude: PropTypes.number,
  defaultLatitude: PropTypes.number,
  defaultLongitude: PropTypes.number,
  cafes: PropTypes.array.isRequired,
}

export default Map
