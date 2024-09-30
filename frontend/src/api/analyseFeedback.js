import axios from 'axios'
import dotenv from 'dotenv'


// setting up API url from .env file
dotenv.config();
const apiUrl = process.env.VITE_API_URL;


// POST method for feedback analysis
export const analyseFeedback = async (feedbackText, language_code) => {
  try {
    const response = await axios.post(apiUrl, {
      "feedback": feedbackText,
      "language_code": language_code
    })
  
    console.log('Response data:', response.data)
    return response.data
  } catch (error) {
    console.error('Error posting feedback text: ', error)
  }
}

// GET method for feedback analysis
export const getFeedbackResults = async () => {
  try {
    const response = await axios.get(apiUrl)
    console.log('Response data:', response.data)

    return response.data

  } catch (error) {
    console.error('Error getting feedback analysis results from database: ', error)
  }
}