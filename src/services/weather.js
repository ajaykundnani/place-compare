export async function fetchWeather(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,apparent_temperature&timezone=auto`
    const response = await fetch(url)
    if (!response.ok) return null
    const data = await response.json()
    if (!data.current) return null
    return {
      temperature: Math.round(data.current.temperature_2m),
      feelsLike: Math.round(data.current.apparent_temperature),
      weatherCode: data.current.weather_code,
    }
  } catch {
    return null
  }
}

export function getWeatherInfo(code) {
  if (code == null) return { label: '', icon: '' }
  if (code === 0) return { label: 'Clear sky', icon: '☀️' }
  if (code <= 3) return { label: 'Partly cloudy', icon: '⛅' }
  if (code <= 48) return { label: 'Foggy', icon: '🌫️' }
  if (code <= 57) return { label: 'Drizzle', icon: '🌦️' }
  if (code <= 67) return { label: 'Rainy', icon: '🌧️' }
  if (code <= 77) return { label: 'Snowy', icon: '🌨️' }
  if (code <= 82) return { label: 'Rain showers', icon: '🌦️' }
  if (code <= 86) return { label: 'Snow showers', icon: '🌨️' }
  return { label: 'Thunderstorm', icon: '⛈️' }
}
