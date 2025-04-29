import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer"
import { useSelector } from "react-redux"
// Removed getUserDetails import as it is an action, not API call
import { courseEndpoints } from "../services/apis"
import { apiConnector } from "../services/apiConnector"

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f8f8f8",
    padding: 30,
    fontFamily: "Helvetica",
  },
  section: {
    margin: 20,
    padding: 20,
    border: "2px solid #000",
    borderRadius: 10,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  signature: {
    marginTop: 40,
    fontSize: 14,
    fontStyle: "italic",
  },
})

const CertificateDocument = ({ userName, courseName, completionDate }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Certificate of Completion</Text>
        <Text style={styles.text}>This is to certify that</Text>
        <Text style={[styles.text, { fontWeight: "bold", fontSize: 20 }]}>{userName}</Text>
        <Text style={styles.text}>has successfully completed the course</Text>
        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>{courseName}</Text>
        <Text style={styles.text}>on {completionDate}</Text>
        <Text style={styles.signature}>Instructor Signature</Text>
      </View>
    </Page>
  </Document>
)

const Certificate = () => {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const [userName, setUserName] = useState("")
  const [courseName, setCourseName] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const user = useSelector((state) => state.profile.user)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setUserName(user?.name || "Student")

        const courseRes = await apiConnector(
          "post",
          courseEndpoints.COURSE_DETAILS_API,
          { courseId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        console.log("Course details response:", courseRes)
        setCourseName(courseRes.data.data.courseName || "Course")

        setLoading(false)
      } catch (err) {
        console.error("Error fetching certificate data:", err)
        setError("Failed to load certificate data.")
        setLoading(false)
      }
    }
    fetchData()
  }, [courseId, token, user])

  const completionDate = new Date().toLocaleDateString()

  if (loading) return <div>Loading certificate...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <PDFDownloadLink
        document={<CertificateDocument userName={userName} courseName={courseName} completionDate={completionDate} />}
        fileName={`${courseName}_Certificate.pdf`}
        className="rounded bg-yellow-600 px-6 py-3 font-semibold text-richblack-900 hover:bg-yellow-700"
      >
        {({ loading }) => (loading ? "Preparing document..." : "Download Certificate")}
      </PDFDownloadLink>
    </div>
  )
}

export default Certificate
