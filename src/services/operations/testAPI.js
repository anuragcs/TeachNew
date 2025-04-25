import { apiConnector } from "../apiConnector"
import { testEndpoints } from "../apis"

export const getTestQuestions = async (courseId, token) => {
  return await apiConnector("get", `${testEndpoints.getTestQuestions}/${courseId}`, null, {
    Authorization: `Bearer ${token}`,
  })
}

export const submitTestAnswers = async (payload, token) => {
  return await apiConnector("post", testEndpoints.submitTestAnswers, payload, {
    Authorization: `Bearer ${token}`,
  })
}
