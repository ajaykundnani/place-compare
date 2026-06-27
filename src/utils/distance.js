const earthRadiusKm = 6371

function toRad(value) {
  return (Number(value) * Math.PI) / 180
}

export function haversineKm(start, end) {
  if (!start || !end) return null

  const dLat = toRad(end.lat - start.lat)
  const dLon = toRad(end.lon - start.lon)
  const lat1 = toRad(start.lat)
  const lat2 = toRad(end.lat)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function formatKm(value) {
  if (value === null || Number.isNaN(value)) return 'Distance unavailable'
  if (value < 1) return `${Math.round(value * 1000)} m`
  return `${value.toFixed(value < 10 ? 1 : 0)} km`
}
