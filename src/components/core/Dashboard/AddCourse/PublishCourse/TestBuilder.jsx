import React, { useEffect, useState } from "react";
import { SurveyCreator } from "survey-creator-react";
// Correct CSS import path for survey-creator-react package
import "survey-creator-react/survey-creator.css";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { apiConnector } from "../../../../../services/apiConnector";
import { endpoints } from "../../../../../services/apis";

const TestBuilder = ({ courseId }) => {
  const [creator, setCreator] = useState(null);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const c = new SurveyCreator();
    setCreator(c);
  }, []);

  useEffect(() => {
    if (!creator) return;
    // Load existing test data if any
    const fetchTest = async () => {
      try {
        const response = await apiConnector(
          "get",
          `${endpoints.GET_TEST_BY_COURSEID_API}/${courseId}`,
          null,
          { Authorization: `Bearer ${token}` }
        );
        if (response?.data?.testData) {
          creator.text = JSON.stringify(response.data.testData);
        }
      } catch (error) {
        console.error("Failed to load test data", error);
      }
    };
    fetchTest();
  }, [courseId, creator, token]);

  const saveTest = async () => {
    if (!creator) {
      toast.error("Survey Creator is not initialized.");
      return;
    }
    try {
      const surveyJSON = creator.text ? JSON.parse(creator.text) : {};
      if (
        !surveyJSON.pages ||
        surveyJSON.pages.length === 0 ||
        surveyJSON.pages[0].elements.length === 0
      ) {
        toast.error("Please add at least one question to the test.");
        return;
      }
      if (surveyJSON.pages[0].elements.length > 10) {
        toast.error("Maximum 10 questions are allowed.");
        return;
      }
      const payload = {
        courseId,
        testData: surveyJSON,
      };
      const response = await apiConnector(
        "post",
        endpoints.CREATE_OR_UPDATE_TEST_API,
        payload,
        { Authorization: `Bearer ${token}` }
      );
      if (response?.data) {
        toast.success("Test saved successfully.");
      }
    } catch (error) {
      console.error("Failed to save test", error);
      toast.error("Failed to save test.");
    }
  };

  if (!creator) return <div>Loading Survey Creator...</div>;

  return (
    <div className="my-6">
      <h2 className="text-xl font-semibold text-richblack-5 mb-4">Create Test</h2>
      <SurveyCreator creator={creator} />
      <button
        onClick={saveTest}
        className="mt-4 rounded bg-yellow-600 px-4 py-2 font-semibold text-richblack-900 hover:bg-yellow-700"
      >
        Save Test
      </button>
    </div>
  );
};

export default TestBuilder;
