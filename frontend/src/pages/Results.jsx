import { Link } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { getFeedbackResults } from "../api/analyseFeedback"


export default function Results() {
  const [records, setRecords] = useState([])
  const [counts, setCounts] = useState(0)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getResults = async () => {
      const cachedResults = localStorage.getItem('feedbackResults')

      if (cachedResults) {
        console.log('Using cashed records')
        const cachedResultsParsed = JSON.parse(cachedResults)
        console.log('cachedResultsParsed:', cachedResultsParsed)
        setRecords(cachedResultsParsed.items)
        setCounts(cachedResultsParsed.counts)
        setLoading(false)
      }

      else {
        try {
          console.log('Fetching results')
          const results = await getFeedbackResults()
          console.log('results:', results)
          setRecords(...records, results.items)
          setCounts(results.counts)
          localStorage.setItem('feedbackResults', JSON.stringify(results))
        } catch (error) {
          console.error('Error occured:', error)
        } finally {
          setLoading(false)
        }
      }    
    }

    getResults()
  }, [])

  return (
    <>
      <div className="bg-slate-700 h-screen text-white p-10">

        <div className="flex justify-between items-center">
          {/* Results page message */}
          <div>
            <h1 className="playfair-display text-3xl font-bold">
              Feedback Analysus Results
            </h1>
          </div>
          <div className="text-cyan-500 underline">
            <p><Link to="/feedback">Send feedback</Link></p>
          </div>
        </div>

        <div className="mt-5">
          {loading ? (
            <h2>Fetching results from server...</h2>
          ) : (
            <>
              <div>
                <h2>Number of records: {counts}</h2>
              </div>
              <div className="mt-5 w-2/3 h-[500px] overflow-y-auto">
                {/* Table showing records from database*/}
                <Table className="table-fixed w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[350px]">Feedback Text</TableHead>
                      <TableHead>Sentiment Lable</TableHead>
                      <TableHead>Sentiment Score</TableHead>
                      <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((item) => (
                      <TableRow key={item.FeedbackID}>
                        <TableCell className="w-[350px] max-w-[350px] overflow-hidden text-ellipsis whitespace-nowrap hover:whitespace-normal hover:max-w-none hover:overflow-visible">
                          {item.UserFeedback}
                        </TableCell>
                        <TableCell>{item.SentimentLabel}</TableCell>
                        <TableCell>{item.SentimentScore}</TableCell>
                        <TableCell className="text-right">{item.Timestamp}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
            
          )}
          
        </div>
        
      
      </div>
    </>
  )
}
