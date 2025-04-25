const handleSubmit = async (values) => {
    if (view) return

    const formData = new FormData()
    if (add) {
      formData.append("sectionId", modalData)
    } else {
      formData.append("sectionId", modalData.sectionId)
      formData.append("subSectionId", modalData._id)
    }
    formData.append("title", values.lectureTitle)
    formData.append("description", values.lectureDesc)
    formData.append("type", values.subsectionType)
    if (values.subsectionType === "Test") {
      formData.append("testQuestions", JSON.stringify(values.testQuestions))
    }
    if (values.subsectionType === "Lecture" && values.lectureVideo) {
      formData.append("video", values.lectureVideo)
    }

    setLoading(true)
    let result
    if (edit) {
      result = await updateSubSection(formData, token)
    } else {
      result = await createSubSection(formData, token)
    }
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === (add ? modalData : modalData.sectionId) ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
      setModalData(null)
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Subsection
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        {/* Modal Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => (
            <Form className="space-y-8 px-8 py-10">
              {/* Subsection Type Selector */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="subsectionType">
                  Subsection Type <sup className="text-pink-200">*</sup>
                </label>
                <Field
                  as="select"
                  id="subsectionType"
                  name="subsectionType"
                  disabled={view || isSubmitting}
                  className="form-style w-full"
                >
                  <option value="Lecture">Lecture</option>
                  <option value="Test">Test</option>
                </Field>
                {errors.subsectionType && touched.subsectionType && (
                  <span className="ml-2 text-xs tracking-wide text-pink-200">
                    {errors.subsectionType}
                  </span>
                )}
              </div>
              {/* Lecture Video Upload - only show if Lecture */}
              {values.subsectionType === "Lecture" && (
                <>
                  <Upload
                    name="lectureVideo"
                    label="Lecture Video"
                    setFieldValue={setFieldValue}
                    value={values.lectureVideo}
                    disabled={view || isSubmitting}
                  />
                  {/* Lecture Title */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
                      Title <sup className="text-pink-200">*</sup>
                    </label>
                    <Field
                      id="lectureTitle"
                      name="lectureTitle"
                      placeholder="Enter Title"
                      disabled={view || isSubmitting}
                      className="form-style w-full"
                    />
                    {errors.lectureTitle && touched.lectureTitle && (
                      <span className="ml-2 text-xs tracking-wide text-pink-200">
                        {errors.lectureTitle}
                      </span>
                    )}
                  </div>
                  {/* Lecture Description */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
                      Description <sup className="text-pink-200">*</sup>
                    </label>
                    <Field
                      as="textarea"
                      id="lectureDesc"
                      name="lectureDesc"
                      placeholder="Enter Description"
                      disabled={view || isSubmitting}
                      className="form-style resize-x-none min-h-[130px] w-full"
                    />
                    {errors.lectureDesc && touched.lectureDesc && (
                      <span className="ml-2 text-xs tracking-wide text-pink-200">
                        {errors.lectureDesc}
                      </span>
                    )}
                  </div>
                </>
              )}
              {/* Test Questions - only show if Test */}
              {values.subsectionType === "Test" && (
                <FieldArray name="testQuestions">
                  {({ push, remove }) => (
                    <div className="space-y-6">
                      <p className="text-lg font-semibold text-richblack-5">Test Questions</p>
                      {values.testQuestions.map((question, index) => (
                        <div
                          key={index}
                          className="space-y-2 rounded-md border border-richblack-600 p-4 relative"
                        >
                          <label
                            className="text-sm text-richblack-5"
                            htmlFor={`testQuestions.${index}.question`}
                          >
                            Question {index + 1} <sup className="text-pink-200">*</sup>
                          </label>
                          <Field
                            id={`testQuestions.${index}.question`}
                            name={`testQuestions.${index}.question`}
                            placeholder="Enter question"
                            disabled={view || isSubmitting}
                            className="form-style w-full"
                          />
                          {errors.testQuestions &&
                            errors.testQuestions[index] &&
                            errors.testQuestions[index].question &&
                            touched.testQuestions &&
                            touched.testQuestions[index] &&
                            touched.testQuestions[index].question && (
                              <span className="ml-2 text-xs tracking-wide text-pink-200">
                                {errors.testQuestions[index].question}
                              </span>
                            )}
                          <label
                            className="text-sm text-richblack-5"
                            htmlFor={`testQuestions.${index}.answer`}
                          >
                            Correct Answer <sup className="text-pink-200">*</sup>
                          </label>
                          <Field
                            id={`testQuestions.${index}.answer`}
                            name={`testQuestions.${index}.answer`}
                            placeholder="Enter correct answer"
                            disabled={view || isSubmitting}
                            className="form-style w-full"
                          />
                          {errors.testQuestions &&
                            errors.testQuestions[index] &&
                            errors.testQuestions[index].answer &&
                            touched.testQuestions &&
                            touched.testQuestions[index] &&
                            touched.testQuestions[index].answer && (
                              <span className="ml-2 text-xs tracking-wide text-pink-200">
                                {errors.testQuestions[index].answer}
                              </span>
                            )}
                          {values.testQuestions.length > 1 && !view && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                              aria-label={`Remove question ${index + 1}`}
                            >
                              &times;
                            </button>
                          )}
                        </div>
                      ))}
                      {!view && (
                        <button
                          type="button"
                          onClick={() => push({ question: "", answer: "" })}
                          className="flex items-center gap-x-2 text-yellow-50 hover:text-yellow-100"
                        >
                          + Add Question
                        </button>
                      )}
                    </div>
                  )}
                </FieldArray>
              )}
              {!view && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="rounded-md bg-yellow-50 py-2 px-4 font-semibold text-richblack-900 hover:bg-yellow-100"
                  >
                    {loading ? "Loading..." : edit ? "Save Changes" : "Save"}
                  </button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
