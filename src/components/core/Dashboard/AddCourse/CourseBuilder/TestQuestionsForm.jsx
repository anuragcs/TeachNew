import React from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai"

export default function TestQuestionsForm() {
  const { register, control, formState: { errors } } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "testQuestions",
  })

  return (
    <div className="space-y-6">
      <p className="text-lg font-semibold text-richblack-5">Test Questions</p>
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-2 rounded-md border border-richblack-600 p-4 relative">
          <label className="text-sm text-richblack-5" htmlFor={`testQuestions.${index}.question`}>
            Question {index + 1} <sup className="text-pink-200">*</sup>
          </label>
          <input
            id={`testQuestions.${index}.question`}
            placeholder="Enter question"
            {...register(`testQuestions.${index}.question`, { required: "Question is required" })}
            className="form-style w-full"
          />
          {errors.testQuestions && errors.testQuestions[index]?.question && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              {errors.testQuestions[index].question.message}
            </span>
          )}
          <label className="text-sm text-richblack-5" htmlFor={`testQuestions.${index}.answer`}>
            Correct Answer <sup className="text-pink-200">*</sup>
          </label>
          <input
            id={`testQuestions.${index}.answer`}
            placeholder="Enter correct answer"
            {...register(`testQuestions.${index}.answer`, { required: "Correct answer is required" })}
            className="form-style w-full"
          />
          {errors.testQuestions && errors.testQuestions[index]?.answer && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              {errors.testQuestions[index].answer.message}
            </span>
          )}
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              aria-label={`Remove question ${index + 1}`}
            >
              <AiOutlineMinusCircle size={20} />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ question: "", answer: "" })}
        className="flex items-center gap-x-2 text-yellow-50 hover:text-yellow-100"
      >
        <AiOutlinePlusCircle size={20} />
        Add Question
      </button>
    </div>
  )
}
