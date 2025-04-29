import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import { apiConnector } from "../services/apiConnector"
import { endpoints } from "../services/apis"

export default function TakeTest() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)

  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(null)

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await apiConnector("get", `${endpoints.courseEndpoints.GET_TEST_API}/${courseId}`, null, {
          Authorization: `Bearer ${token}`,
        })
        if (res?.data) {
          setQuestions(res.data)
        }
      } catch (error) {
        console.error(error)
        toast.error("Failed to load test")
      }
    }
    fetchTest()
  }, [courseId, token])

  const handleOptionChange = (questionIndex, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }))
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
        answers: questions.map((q, idx) => ({
          questionText: q.questionText,
          selectedOption: answers[idx],
        })),
      }
      const res = await apiConnector(
        "post",
        `${endpoints.courseEndpoints.SUBMIT_TEST_API}/${courseId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      if (res?.success) {
        setScore(res.score)
        setSubmitted(true)
        toast.success("Test submitted successfully")
      } else {
        toast.error("Failed to submit test")
      }
    } catch (error) {
      console.error(error)
      toast.error("Error submitting test")
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-richblack-800 rounded-md text-richblack-5">
        <h1 className="text-3xl font-semibold mb-6">Test Result</h1>
        <p className="text-xl">
          You scored {score} out of {questions.length}
        </p>
        <button
          onClick={() => navigate("/dashboard/my-courses")}
          className="mt-6 bg-yellow-600 hover:bg-yellow-700 text-richblack-900 font-semibold py-3 px-6 rounded-md"
        >
          Back to Courses
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-richblack-800 rounded-md text-richblack-5">
      <h1 className="text-3xl font-semibold mb-6">Take Test</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((q, idx) => (
          <div key={idx} className="border border-richblack-600 p-4 rounded-md">
            <p className="font-semibold mb-4">
              Question {idx + 1}: {q.questionText}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {q.options.map((opt, optIdx) => (
                <label key={optIdx} className="block cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${idx}`}
                    value={opt}
                    checked={answers[idx] === opt}
                    onChange={() => handleOptionChange(idx, opt)}
                    className="mr-2"
                    required
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-600 hover:bg-yellow-700 text-richblack-900 font-semibold py-3 px-6 rounded-md"
        >
          {loading ? "Submitting..." : "Submit Test"}
        </button>
      </form>
    </div>
  )
}
