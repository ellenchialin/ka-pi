import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import { Box } from '@chakra-ui/react'

import taiwanMapData from '../../taiwanMapData'

function TaiwanMap() {
  return (
    <Box w="100%" h="450px" mb="8">
      <MapContainer
        center={[23.773, 120.959]}
        zoom={7}
        style={{ height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={taiwanMapData} />
      </MapContainer>
    </Box>
  )
}

export default TaiwanMap
