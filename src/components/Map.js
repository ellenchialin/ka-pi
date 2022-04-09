import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Box } from '@chakra-ui/react'

function Map({ userLatitude, userLongitude }) {
  console.log(userLatitude, userLongitude)

  return (
    <Box w="100%" h="350px">
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
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  )
}

export default Map
