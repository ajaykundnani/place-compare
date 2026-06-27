export async function routeDistanceKm(start, end) {
  const coords = `${start.lon},${start.lat};${end.lon},${end.lat}`
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=false`
  const response = await fetch(url)

  if (!response.ok) return null

  const data = await response.json()
  const meters = data.routes?.[0]?.distance
  return typeof meters === 'number' ? meters / 1000 : null
}
