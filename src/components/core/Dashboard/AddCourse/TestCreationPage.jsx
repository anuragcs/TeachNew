import React, { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"
import { createTestQuestions } from "../../services/operations/testAPI"

export default function TestCreationPage() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [questions, setQuestions] = useState(
    Array(10).fill({ question: "", answer: "" })
  )
  const [loading, setLoading] = useState(false)

  const handleChange = (index, field, value) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    setQuestions(newQuestions)
  }
const handleSubmit = async (e) => {
    e.preventDefault()
    // Validate all questions and answers are filled
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim() || !questions[i].answer.trim()) {
        toast.error(`Please fill question and answer for item ${i + 1}`)
        return
      }
    }
    setLoading(true)
    try {
      const payload = {
        courseId,
        testQuestions: questions,
      }
      const response = await createTestQuestions(payload, token)
      if (response) {
        toast.success("Test questions saved successfully")
        navigate(`/dashboard/instructor/courses/${courseId}`) // Navigate back to course page or wherever appropriate
      }
    } catch (error) {
      toast.error("Failed to save test questions")
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-richblack-800 rounded-md text-richblack-5">
      <h2 className="text-2xl font-semibold mb-6">Add Test Questions</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, idx) => (
          <div key={idx} className="space-y-2 border border-richblack-600 p-4 rounded-md">
            <label className="block text-sm font-medium" htmlFor={`question-${idx}`}>
              Question {idx + 1}
            </label>
            <input
              id={`question-${idx}`}
              type="text"
              value={q.question}
              onChange={(e) => handleChange(idx, "question", e.target.value)}
              className="w-full p-2 rounded bg-richblack-700 text-richblack-5"
              placeholder="Enter question"
              required
            />
            <label className="block text-sm font-medium" htmlFor={`answer-${idx}`}>
              Correct Answer
            </label>
            <input
              id={`answer-${idx}`}
              type="text"
              value={q.answer}
              onChange={(e) => handleChange(idx, "answer", e.target.value)}
              className="w-full p-2 rounded bg-richblack-700 text-richblack-5"
              placeholder="Enter correct answer"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-50 text-richblack-900 font-semibold py-2 px-4 rounded hover:bg-yellow-100"
        >
          {loading ? "Saving..." : "Save Test Questions"}
        </button>
      </form>
    </div>
  )
}
export default TestCreationPage
