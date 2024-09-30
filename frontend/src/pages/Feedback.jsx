import { Link } from "react-router-dom"
import { Brain, Send } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { analyseFeedback } from "../api/analyseFeedback"


export default function Feedback() {
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(null)
  const [result, setResult] = useState(null)
  const [isDisabled, setIsDisabled] = useState(true)

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`feedback: ${feedback}`);
    setIsDisabled(true)
    
    // Call API here
    try {
      const response = await analyseFeedback(feedback, "en")
      setResult(response)
      setFeedbackSent(feedback)
    } catch (error) {
      console.error("Error occured:", error)
    } finally {
      setFeedback("");
    }
  }

  const handleKeyDown = (e) => {
    // Check if the Enter key is pressed without Shift (to prevent new lines)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // If the button is not disabled, submit the form
      if (!isDisabled) {
        handleSubmit(e);
      }
    }
  };

  useEffect(() => {
    setIsDisabled(feedback.trim() === "");
  }, [feedback])

  return (
    <>
      <div className="bg-slate-700 h-screen text-white p-10">

        <div className="flex justify-center mb-10">
          {/* headline */}
          <div className="flex items-center">
            <Brain className="w-12 h-12 mx-3" />
            <h1 className="playfair-display text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500">AI Analysies Your Feedback</h1>
          </div>          
        </div>    

        <div className="my-3 text-black w-1/3 mx-auto">
          {/* textarea */}
          <form method="post" onSubmit={handleSubmit}>
            <div className="flex justify-center">
              <Textarea 
                className="h-60 rounded-lg"
                placeholder="Type your feedback here."
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="flex justify-end">
              <Button type="sumbit" disabled={isDisabled} className="mt-3 bg-indigo-600 hover:bg-cyan-600">
                Send
                <Send className="w-4 h-4 mx-2" />
              </Button>
            </div>
          </form>

            <div className="text-cyan-500 underline">
              {/* Link to /results */}
              <p><Link to="/results">Go to results</Link></p>
            </div>

            <div>
              {result && (
                <div className="mt-5 p-4 bg-gray-800 rounded-lg">
                  <h3 className="text-lg font-bold text-cyan-500">Feedback Analysis Result:</h3>
                  <p className="text-white"><strong>Feedback Text:</strong> {feedbackSent}</p>
                  <p className="text-white"><strong>Sentiment Lable:</strong> {result.sentiment_lable}</p>
                  <p className="text-white"><strong>Sentiment Score:</strong> {result.sentiment_score}</p>
                </div>
              )}
            </div>
        </div>
      </div>
    </>
  )
}
