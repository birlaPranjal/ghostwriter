export async function generateImage(prompt: string): Promise<string> {
  try {
    // Encode the prompt for URL
    const encodedPrompt = encodeURIComponent(prompt)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`
    
    // Verify the image exists
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error('Failed to generate image')
    }
    
    return imageUrl
  } catch (error) {
    console.error('Error generating image:', error)
    // Return a default image if generation fails
    return '/images/default-blog.jpg'
  }
} 