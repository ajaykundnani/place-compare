export function directionsUrl(start, end) {
  // Use exact saved coordinates for both points so Google Maps follows the same route
  const originCoords = `${Number(start.lat).toFixed(6)},${Number(start.lon).toFixed(6)}`;
  const destinationCoords = `${Number(end.lat).toFixed(6)},${Number(end.lon).toFixed(6)}`;

  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originCoords)}&destination=${encodeURIComponent(destinationCoords)}&travelmode=driving`;
}

export function placeUrl(place) {
  // Use coordinates with name for accurate location in Google Maps
  const query = `${place.name || place.displayName} ${place.lat},${place.lon}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
