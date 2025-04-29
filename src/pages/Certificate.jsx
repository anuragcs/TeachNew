import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from "@react-pdf/renderer";
import { useSelector } from "react-redux";
import { courseEndpoints } from "../services/apis";
import { apiConnector } from "../services/apiConnector";

// Using direct image URLs
const LOGO_URL = "https://i.ibb.co/0yVDDSVX/1.jpg";
const SEAL_URL = "https://i.ibb.co/fVLvQr84/1.png";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f8f8f8",
    padding: 0,
    fontFamily: "Helvetica",
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  container: {
    padding: 20,
    position: 'relative',
    zIndex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    textAlign: 'center',
    marginBottom: 10,
    flex: 1,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 5,
    alignSelf: 'center',
  },
  certificateBorder: {
    border: '10px solid #f0e6d2',
    borderRadius: 5,
    padding: 20,
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    height: '90%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
    textAlign: 'center',
    fontFamily: 'Times-Roman',
  },
  subtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 1,
  },
  content: {
    marginVertical: 15,
    textAlign: 'center',
    flex: 2,
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
    color: '#34495e',
    lineHeight: 1.4,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#2c3e50',
    textDecoration: 'underline',
    textDecorationColor: '#f1c40f',
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#3498db',
  },
  date: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
  },
  instructor: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 3,
  },
  footer: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  signatureContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 150,
  },
  signatureLine: {
    width: 120,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 3,
  },
  signatureName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 3,
  },
  signatureTitle: {
    fontSize: 10,
    color: "#7f8c8d",
  },
  seal: {
    width: 70,
    height: 70,
    opacity: 0.8,
    alignSelf: 'flex-end',
  },
  decorativeBorder: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    border: '1px solid #f1c40f',
    borderRadius: 3,
    pointerEvents: 'none',
  },
  certificateId: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    fontSize: 8,
    color: '#bdc3c7',
  }
});

const CertificateDocument = ({ userName, courseName, completionDate, instructorName }) => {
  const certificateId = `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  return (
    <Document>
      <Page 
        size="A4" 
        style={styles.page} 
        orientation="landscape"
        wrap={false}
      >
        <View style={styles.container}>
          <View style={styles.certificateBorder}>
            <View style={styles.decorativeBorder}></View>
            
            <View style={styles.header}>
              <Image 
                src={LOGO_URL} 
                style={styles.logo} 
                cache={false} // Bypass cache to ensure image loads
              />
              <Text style={styles.subtitle}>THIS CERTIFICATE IS PROUDLY PRESENTED TO</Text>
            </View>
            
            <View style={styles.content}>
              <Text style={styles.title}>Certificate of Achievement</Text>
              <Text style={styles.text}>This is to certify that</Text>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.text}>has successfully completed the course</Text>
              <Text style={styles.courseName}>{courseName}</Text>
              <Text style={styles.text}>with dedication and commitment, demonstrating proficiency in the subject matter.</Text>
              <Text style={styles.date}>Completed on: {completionDate}</Text>
              <Text style={styles.instructor}>Instructor: {instructorName || "Our Team"}</Text>
            </View>
            
            <View style={styles.footer}>
              <View style={styles.signatureContainer}>
                <View style={styles.signatureLine}></View>
                <Text style={styles.signatureName}>{instructorName || "Instructor"}</Text>
                <Text style={styles.signatureTitle}>Course Instructor</Text>
              </View>
              
              <Image 
                src={SEAL_URL} 
                style={styles.seal} 
                cache={false} // Bypass cache to ensure image loads
              />
            </View>
            
            <Text style={styles.certificateId}>Certificate ID: {certificateId}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// The rest of the component remains the same...
const Certificate = () => {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const [userName, setUserName] = useState("")
  const [courseName, setCourseName] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [instructorName, setInstructorName] = useState("")

  const user = useSelector((state) => state.profile.user)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Redux user object:", user)
        const studentName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Student"
        setUserName(studentName || "Student")

        // Fetch course details
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
        
        console.log("Course details full response:", courseRes.data)
        
        // Extract course name
        const courseData = courseRes.data.data.courseDetails || {}
        setCourseName(courseData.courseName || "Course")
        
        // Extract instructor name with better debugging
        let extractedInstructorName = ""
        const instructorData = courseData.instructor || {}
        console.log("Instructor data structure:", JSON.stringify(instructorData, null, 2))
        
        if (typeof instructorData === 'object') {
          // Based on the actual API response structure, construct name from firstName and lastName
          if (instructorData.firstName && instructorData.lastName) {
            extractedInstructorName = `${instructorData.firstName} ${instructorData.lastName}`;
          } else if (instructorData.firstName) {
            extractedInstructorName = instructorData.firstName;
          } else if (instructorData.lastName) {
            extractedInstructorName = instructorData.lastName;
          } else if (instructorData.name) {
            extractedInstructorName = instructorData.name;
          } else if (instructorData.additionalDetails && instructorData.additionalDetails.name) {
            extractedInstructorName = instructorData.additionalDetails.name;
          } else if (typeof instructorData.author === 'string') {
            extractedInstructorName = instructorData.author;
          } else if (instructorData.author && instructorData.author.name) {
            extractedInstructorName = instructorData.author.name;
          } else {
            extractedInstructorName = "Instructor";
          }
        } else if (typeof instructorData === 'string') {
          extractedInstructorName = instructorData;
        }
        
        console.log("Final extracted instructor name:", extractedInstructorName)
        setInstructorName(extractedInstructorName)

        setLoading(false)
      } catch (err) {
        console.error("Error fetching certificate data:", err)
        setError("Failed to load certificate data.")
        setLoading(false)
      }
    }
    fetchData()
  }, [courseId, token, user])

  const completionDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  if (loading) return <div>Loading certificate...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Certificate Preview</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl">
          <p className="text-lg mb-2"><span className="font-semibold">Student:</span> {userName}</p>
          <p className="text-lg mb-2"><span className="font-semibold">Course:</span> {courseName}</p>
          <p className="text-lg mb-4"><span className="font-semibold">Instructor:</span> {instructorName || "Not available"}</p>
          <p className="text-sm text-gray-500">Click the button below to download your official certificate</p>
        </div>
      </div>
      
      <PDFDownloadLink
        document={
          <CertificateDocument
            userName={userName}
            courseName={courseName}
            completionDate={completionDate}
            instructorName={instructorName}
          />
        }
        fileName={`${courseName.replace(/\s+/g, '_')}_Certificate_${userName.replace(/\s+/g, '_')}.pdf`}
        className="rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 px-8 py-3 font-bold text-white hover:from-yellow-600 hover:to-yellow-700 shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        {({ loading }) => (loading ? "Generating certificate..." : "Download Your Certificate")}
      </PDFDownloadLink>
    </div>
  )
}

export default Certificate