import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-hot-toast"
import { useSelector } from "react-redux"
import { apiConnector } from "/Users/anuraggupra/Downloads/TeachNewDraft/src/services/apiConnector.js"

export default function TakeTest() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const [testQuestions, setTestQuestions] = useState([])
  const [answers, setAnswers] = useState(Array(10).fill(""))
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCourseTest = async () => {
      try {
        setLoading(true)
        const response = await apiConnector(
          "POST",
          "/api/v1/course/getCourseDetails",
          { courseId },
          { Authorization: `Bearer ${token}` }
        )
        if (response?.data?.data?.test) {
          setTestQuestions(response.data.data.test)
        } else {
          toast.error("Test questions not found for this course")
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
        toast.error("Failed to fetch test questions")
      }
    }
    fetchCourseTest()
  }, [courseId, token])

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (answers.some((ans) => ans.trim() === "")) {
      toast.error("Please answer all questions")
      return
    }
    try {
      setLoading(true)
      const payload = {
        courseId,
        answers,
      }
      const response = await apiConnector(
        "POST",
        "/api/v1/test/submit",
        payload,
        { Authorization: `Bearer ${token}` }
      )
      if (response?.data?.success) {
        setScore(response.data.score)
        toast.success(response.data.message)
      } else {
        toast.error("Failed to submit test answers")
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error("Failed to submit test answers")
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (score !== null) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-richblack-800 rounded-md text-richblack-5">
        <h2 className="text-2xl font-semibold mb-6">Test Result</h2>
        <p className="text-lg">You scored {score} out of 10</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-richblack-800 rounded-md text-richblack-5">
      <h2 className="text-2xl font-semibold mb-6">Take Test</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {testQuestions.map((q, idx) => (
          <div key={idx} className="space-y-2 border border-richblack-600 p-4 rounded-md">
            <p className="font-semibold">Question {idx + 1}: {q.question}</p>
            <input
              type="text"
              value={answers[idx]}
              onChange={(e) => handleAnswerChange(idx, e.target.value)}
              className="w-full p-2 rounded bg-richblack-700 text-richblack-5"
              placeholder="Enter your answer"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-yellow-50 text-richblack-900 font-semibold py-2 px-4 rounded hover:bg-yellow-100"
        >
          Submit Test
        </button>
      </form>
    </div>
  )
}
