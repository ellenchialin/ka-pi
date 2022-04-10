import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Box } from '@chakra-ui/react'

function TaiwanMap() {
  return (
    <Box w="100%" h="350px" mb="8">
      <MapContainer
        center={[23.773, 120.959]}
        zoom={8}
        style={{ height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </Box>
  )
}

export default TaiwanMap
