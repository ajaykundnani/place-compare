export async function searchWikipedia(query) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&srprop=extract&origin=*`
  const response = await fetch(url)
  if (!response.ok) return []
  const data = await response.json()
  return data.query?.search?.slice(0, 3) || []
}

export async function fetchWikipediaSummary(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|info&exintro&explaintext&exlimit=1&inprop=url&titles=${encodeURIComponent(title)}&format=json&origin=*`
  const response = await fetch(url)
  if (!response.ok) return null
  const data = await response.json()
  const pages = data.query?.pages
  if (!pages) return null
  const pageId = Object.keys(pages)[0]
  if (pageId === '-1') return null
  const page = pages[pageId]
  if (!page || !page.extract) return null
  return {
    title: page.title,
    extract: page.extract,
    content_urls: { desktop: { page: page.fullurl } },
  }
}
