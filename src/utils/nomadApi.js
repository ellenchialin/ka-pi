const nomad = {
  getCafesByCity(city) {
    return fetch(`/api/v1.2/cafes/${city}`).then(response => response.json())
  },
}

export default nomad
