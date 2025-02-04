export const validateCOCOJSON = async (cocoJSON: object) => {
  try {
    const response = await fetch('http://localhost:5002/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cocoJSON)
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Validation failed:', error)
    return { error: 'Validation request failed' }
  }
}
