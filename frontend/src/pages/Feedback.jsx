import { Link } from "react-router-dom"
import { Brain, Send } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"


export default function Feedback() {
  return (
    <>
      {/* <div className="playfair-display text-5xl font-bold">This is Feedback Page</div> */}
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
          <div className="flex justify-center">
            <Textarea className="h-60 rounded-lg" placeholder="Type your feedback here." />
          </div>
          <div className="flex justify-end">
            <Button className="mt-3 bg-indigo-600 hover:bg-cyan-600">
              Send
              <Send className="w-4 h-4 mx-2" />
            </Button>
          </div>
            <div className="text-cyan-500 underline">
              {/* Link to /results */}
              <p><Link to="/results">Go to results</Link></p>
          </div>
        </div>

      </div>
    </>
  )
}
