import React, { useState } from "react"
import { Formik, Form, Field, FieldArray } from "formik"
import * as Yup from "yup"
import { toast } from "react-hot-toast"
import { RxCross2 } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"

import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import IconBtn from "../../../../Common/IconBtn"
import Upload from "../Upload"

const validationSchema = Yup.object().shape({
  subsectionType: Yup.string().required("Subsection Type is required"),
  lectureTitle: Yup.string().when("subsectionType", {
    is: "Lecture",
    then: Yup.string().required("Title is required"),
    otherwise: Yup.string(),
  }),
  lectureDesc: Yup.string().when("subsectionType", {
    is: "Lecture",
    then: Yup.string().required("Description is required"),
    otherwise: Yup.string(),
  }),
  testQuestions: Yup.array().of(
    Yup.object().shape({
      question: Yup.string().required("Question is required"),
      answer: Yup.string().required("Correct answer is required"),
    })
  ).when("subsectionType", {
    is: "Test",
    then: Yup.array().min(1, "At least one question is required"),
  }),
})

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)

  const initialValues = {
    subsectionType: modalData?.type || "Lecture",
    lectureTitle: modalData?.title || "",
    lectureDesc: modalData?.description || "",
    lectureVideo: modalData?.videoUrl || null,
    testQuestions: modalData?.testQuestions?.length
      ? modalData.testQuestions
      : Array(10).fill({ question: "", answer: "" }),
  }
