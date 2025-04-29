import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import { apiConnector } from "../services/apiConnector"
import { endpoints, courseEndpoints } from "../services/apis"

const initialQuestion = { questionText: "", options: ["", "", "", ""], correctAnswer: "" }

export default function AddTest() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)

  const [questions, setQuestions] = useState([{ ...initialQuestion }])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch existing test if any
    const fetchTest = async () => {
      try {
        const res = await apiConnector("get", `${endpoints.getTest}/${courseId}`, null, {
          Authorization: `Bearer ${token}`,
        })
        if (res?.data) {
          // Map fetched questions to include empty correctAnswer for editing
          const fetchedQuestions = res.data.map((q) => ({
            questionText: q.questionText,
            options: q.options,
            correctAnswer: "",
          }))
          setQuestions(fetchedQuestions)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchTest()
  }, [courseId, token])

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions]
    if (field === "questionText") {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        questionText: value,
      }
    } else if (field.startsWith("option")) {
      const optionIndex = parseInt(field.slice(-1))
      const updatedOptions = [...updatedQuestions[index].options]
      updatedOptions[optionIndex] = value
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        options: updatedOptions,
      }
    } else if (field === "correctAnswer") {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        correctAnswer: value,
      }
    }
    setQuestions(updatedQuestions)
  }

  const validateForm = () => {
    for (const q of questions) {
      if (!q.questionText.trim()) {
        toast.error("All questions must have text")
        return false
      }
      for (const opt of q.options) {
        if (!opt.trim()) {
          toast.error("All options must be filled")
          return false
        }
      }
      if (!q.correctAnswer.trim()) {
        toast.error("Each question must have a correct answer")
        return false
      }
      if (!q.options.includes(q.correctAnswer)) {
        toast.error("Correct answer must be one of the options")
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      // Save test data by updating the course
      const payload = {
        test: JSON.stringify(questions),
      }
      const res = await apiConnector(
        "post",
        courseEndpoints.SAVE_TEST_API,
        { test: questions },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      if (res?.success) {
        toast.success("Test saved successfully")
        navigate("/dashboard/instructor")
      } else {
        toast.error("Failed to save test")
      }
    } catch (error) {
      console.error(error)
      toast.error("Error saving test")
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-richblack-800 rounded-md text-richblack-5">
      <h1 className="text-3xl font-semibold mb-6">Add Test for Course</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((q, idx) => (
          <div key={idx} className="border border-richblack-600 p-4 rounded-md">
            <label className="block mb-2 font-semibold">
              Question {idx + 1}
              <input
                type="text"
                value={q.questionText}
                onChange={(e) => handleQuestionChange(idx, "questionText", e.target.value)}
                className="w-full p-2 rounded bg-richblack-700 text-richblack-5 mt-1"
                required
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              {q.options.map((opt, optIdx) => (
                <label key={optIdx} className="block">
                  Option {optIdx + 1}
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleQuestionChange(idx, `option${optIdx}`, e.target.value)}
                    className="w-full p-2 rounded bg-richblack-700 text-richblack-5 mt-1"
                    required
                  />
                </label>
              ))}
            </div>
            <label className="block mt-4 font-semibold">
              Correct Answer
              <input
                type="text"
                value={q.correctAnswer}
                onChange={(e) => handleQuestionChange(idx, "correctAnswer", e.target.value)}
                className="w-full p-2 rounded bg-richblack-700 text-richblack-5 mt-1"
                placeholder="Must match one of the options exactly"
                required
              />
            </label>
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-600 hover:bg-yellow-700 text-richblack-900 font-semibold py-3 px-6 rounded-md"
        >
          {loading ? "Saving..." : "Save Test"}
        </button>
      </form>
    </div>
  )
}
