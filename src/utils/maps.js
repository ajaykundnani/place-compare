export function directionsUrl(start, end) {
  const origin = `${start.lat},${start.lon}`
  const destination = `${end.lat},${end.lon}`
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`
}

export function placeUrl(place) {
  const query = `${place.name || place.displayName} ${place.lat},${place.lon}`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
