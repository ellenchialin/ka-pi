const nomad = {
  hostname: 'https://cafenomad.tw/api/v1.2/cafes',
  getCafesByCity(city) {
    return fetch(`${this.hostname}/${city}`).then(response => response.json())
  },
}

export default nomad
