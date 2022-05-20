export const api = {
  hostname: 'https://ka-pi-server.herokuapp.com',
  getAllCafes() {
    return fetch(`${this.hostname}/allcafes`).then(response => response.json())
  },
  getCityCafes(city) {
    return fetch(`${this.hostname}/citycafes?city=${city}`).then(response =>
      response.json()
    )
  },
  getGooglePhotoRefs(cafeName) {
    return fetch(`${this.hostname}/photorefs/${cafeName}`).then(response =>
      response.json()
    )
  },
  getGoogleGeocode(lat, lng) {
    return fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}&language=zh-TW`
    ).then(response => response.json())
  },
}
