const prefix = 'place-compare:'

export function loadItem(key, fallback) {
  try {
    const value = localStorage.getItem(`${prefix}${key}`)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export function saveItem(key, value) {
  localStorage.setItem(`${prefix}${key}`, JSON.stringify(value))
}

export function removeItem(key) {
  localStorage.removeItem(`${prefix}${key}`)
}
