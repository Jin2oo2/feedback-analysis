import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config();
const apiUrl = process.env.VITE_API_URL;

export const analyseFeedback = async (feedbackText) => {
  try {
    const response = await axios.post(apiUrl, {
      "feedback": feedbackText,
      "language_code": "en"
    })
  
    console.log('Response data:', response.data)
  } catch (error) {
    console.error('Error posting feedback text: ', error)
  }
}


analyseFeedback("It's a crazy website in a good way.")
console.log('Hello!!')