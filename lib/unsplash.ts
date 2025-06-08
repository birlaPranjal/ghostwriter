const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY
const UNSPLASH_API_URL = 'https://api.unsplash.com'

export async function getImageUrl(query: string): Promise<string> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('UNSPLASH_ACCESS_KEY is not set. Using placeholder image.')
    return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643'
  }

  try {
    // Clean and format the query
    const searchQuery = query
      .toLowerCase()
      .split(' ')
      .slice(0, 3) // Take first 3 words for better results
      .join(' ')

    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch image from Unsplash')
    }

    const data = await response.json()
    const image = data.results[0]

    if (!image) {
      throw new Error('No images found')
    }

    // Return the regular size URL
    return image.urls.regular
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error)
    // Return a default image URL if there's an error
    return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643'
  }
}

// Function to get multiple images for a blog post
export async function getMultipleImages(query: string, count: number = 3): Promise<string[]> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('UNSPLASH_ACCESS_KEY is not set. Using placeholder images.')
    return Array(count).fill('https://images.unsplash.com/photo-1499750310107-5fef28a66643')
  }

  try {
    const searchQuery = query
      .toLowerCase()
      .split(' ')
      .slice(0, 3)
      .join(' ')

    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=${count}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch images from Unsplash')
    }

    const data = await response.json()
    return data.results.map((image: any) => image.urls.regular)
  } catch (error) {
    console.error('Error fetching images from Unsplash:', error)
    return Array(count).fill('https://images.unsplash.com/photo-1499750310107-5fef28a66643')
  }
} 