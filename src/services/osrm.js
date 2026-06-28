export async function routeDistanceKm(start, end, profile = 'driving') {
  const coords = `${start.lon},${start.lat};${end.lon},${end.lat}`
  const url = `https://router.project-osrm.org/route/v1/${profile}/${coords}?overview=false`
  const response = await fetch(url)

  if (!response.ok) return null

  const data = await response.json()
  const route = data.routes?.[0]
  if (!route) return null

  return {
    distanceKm: route.distance / 1000,
    durationSeconds: route.duration,
  }
}
