import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-hot-toast"
import { useSelector } from "react-redux"
import { apiConnector } from "../../services/apiConnector"
import { TEST_API } from "../../services/apis"

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
        // Pass token in headers for authenticated request
        const response = await apiConnector(
          "POST",
          "/api/v1/course/getCourseDetails",
          { courseId },
          token
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
