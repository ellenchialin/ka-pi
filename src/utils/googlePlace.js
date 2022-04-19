export const googlePlace = {
  getPhoto(textquery) {
    return fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=%E9%BB%91%E9%9C%B2%E5%92%96%E5%95%A1&key=AIzaSyAiPvJAVuCQQekLZSIWdeedxpuw5VcO564`
    ).then(res => res.json())
  },
}
