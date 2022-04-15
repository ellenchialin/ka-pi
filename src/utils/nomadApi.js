const nomad = {
  getAllCafes() {
    return fetch('https://cafenomad.tw/api/v1.2/cafes').then(response =>
      response.json()
    )
  },
  getCafesByCity(city) {
    return fetch(`https://cafenomad.tw/api/v1.2/cafes/${city}`).then(response =>
      response.json()
    )
  },
}

export default nomad
