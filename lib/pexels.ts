const PEXELS_API_KEY = process.env.PEXELS_API_KEY
const PEXELS_API_URL = 'https://api.pexels.com/v1'

const imageStyles = [
  "digital art",
  "photorealistic",
  "watercolor",
  "oil painting",
  "sketch",
  "minimalist",
  "abstract",
  "cyberpunk",
  "fantasy",
  "vintage"
]

const imageAspects = [
  "wide angle",
  "close up",
  "aerial view",
  "macro",
  "panoramic",
  "portrait",
  "landscape"
]

export async function getImageUrl(prompt: string): Promise<string> {
  try {
    // Add random style and aspect to make images more unique
    const randomStyle = imageStyles[Math.floor(Math.random() * imageStyles.length)]
    const randomAspect = imageAspects[Math.floor(Math.random() * imageAspects.length)]
    
    // Create a more detailed prompt
    const enhancedPrompt = `${prompt}, ${randomStyle}, ${randomAspect}, high quality, detailed`
    
    // Encode the prompt for URL
    const encodedPrompt = encodeURIComponent(enhancedPrompt)
    
    // Generate image URL using Pollinations AI with size parameters
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=800`
    return imageUrl
  } catch (error) {
    console.error('Error generating image:', error)
    // Return a default image if generation fails
    return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643'
  }
}

// Function to get multiple images for a blog post
export async function getMultipleImages(prompt: string, count: number): Promise<string[]> {
  try {
    // Generate multiple variations of the same prompt with different styles
    const images = await Promise.all(
      Array(count).fill(null).map(async (_, index) => {
        // Add a variation to the prompt to get different images
        const variationPrompt = `${prompt} ${index + 1}`
        return getImageUrl(variationPrompt)
      })
    )
    return images
  } catch (error) {
    console.error('Error generating multiple images:', error)
    // Return an array of default images if generation fails
    return Array(count).fill('https://images.unsplash.com/photo-1499750310107-5fef28a66643')
  }
} 