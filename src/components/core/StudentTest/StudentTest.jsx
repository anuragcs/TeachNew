import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import { getTestQuestions, submitTestAnswers } from "../../../services/operations/testAPI"

const StudentTest = () => {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true)
      try {
        const response = await getTestQuestions(courseId, token)
        if (response.data.success) {
          setQuestions(response.data.data)
        } else {
          toast.error("Failed to load test questions")
        }
      } catch (error) {
        toast.error("Error fetching test questions")
      }
      setLoading(false)
    }
    fetchQuestions()
  }, [courseId, token])

  const handleChange = (e, index) => {
    setAnswers({ ...answers, [index]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (Object.keys(answers).length !== questions.length) {
      toast.error("Please answer all questions")
      return
    }
    setLoading(true)
    try {
      const payload = {
        courseId,
        answers: questions.map((q, idx) => ({
          question: q.question,
          answer: answers[idx] || "",
        })),
      }
      const response = await submitTestAnswers(payload, token)
      if (response.data.success) {
        setScore(response.data.data.score)
        toast.success(`Test submitted! Your score: ${response.data.data.score} / ${response.data.data.total}`)
      } else {
        toast.error("Failed to submit test")
      }
    } catch (error) {
      toast.error("Error submitting test")
    }
    setLoading(false)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (score !== null) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Test Completed</h2>
        <p>Your score: {score} / {questions.length}</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Course Test</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, idx) => (
          <div key={idx} className="flex flex-col">
            <label className="mb-2 font-semibold">{`Q${idx + 1}: ${q.question}`}</label>
            <input
              type="text"
              value={answers[idx] || ""}
              onChange={(e) => handleChange(e, idx)}
              className="border border-gray-300 rounded p-2"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Test
        </button>
      </form>
    </div>
  )
}

export default StudentTest
