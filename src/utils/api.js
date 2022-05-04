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
}
