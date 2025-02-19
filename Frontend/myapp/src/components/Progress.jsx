import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLocation } from "react-router-dom";
import "../styles/progress.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import p1 from "../assets/ai.gif";

export default function Progress() {
  const [selectedTest, setSelectedTest] = useState("all");
  const [examData, setExamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  const location = useLocation();
    const studentName = location.state?.studentName || "Unknown";
    const role = location.state?.role || "User"; // Get role
    let name= localStorage.getItem("userName");

    if (role=='admin'){
      name = studentName;
      

        toast.info(`Progress of the Student ${studentName}`, {
          autoClose: 2000, // Toast stays for 5 seconds (5000ms)
          position: "top-right", // Optional: Change position if needed
          pauseOnHover: true, // Optional: Pause on hover
        });
      }
        

  useEffect(() => {
    // Show loading toast
    toast.loading("Loading data...");
    
    

    fetch(`http://localhost:3001/exam-results/${name}`)
      .then((res) => res.json())
      .then((apiResponse) => {
        if (apiResponse.success && apiResponse.exams.length > 0) {
          const formattedData = apiResponse.exams.map((exam) => ({
            test: exam.exam_name,
            percentage: (exam.data.maxobtained / exam.data.maxmark) * 100, // Percentage Calculation
            subjects: { ...exam.data }, // Copy subject marks
          }));

          setExamData(formattedData);
          console.log(apiResponse.feedback,'from ai');
          setFeedback(apiResponse.feedback || {});
          //setFeedback(apiResponse.feedback);
        } else {
          setExamData([]);
        }
      })
      .catch(() => {
        setExamData([]);
      })
      .finally(() => {
        toast.dismiss();
        setLoading(false);
      });
  }, []);

  // Function to get subject data for Pie Chart
  /*const getSubjectData = (testId) => {
    const subjects = ["eng_math", "dig_logic", "coa", "pds", "algo", "toc", "comp_des", "os", "dbms", "cn"];

    if (testId === "all") {
      // Calculate average marks for each subject
      return subjects.map((subject, index) => {
        const total = examData.reduce((sum, test) => sum + (test.subjects[subject] || 0), 0);
        const average = total / examData.length;
        return { subject, value: average, fill: `hsl(var(--chart-${index + 1}))` };
      });
    } else {
      // Get subject marks for selected test
      const test = examData.find((t) => t.test === testId);
      if (!test) return [];
      return subjects.map((subject, index) => ({
        subject,
        value: test.subjects[subject] || 0,
        fill: `hsl(var(--chart-${index + 1}))`,
      }));
    }
  };*/
  const getSubjectData = (testId) => {
    const subjects = [
      "eng_math", "dig_logic", "coa", "pds", "algo",
      "toc", "comp_des", "os", "dbms", "cn"
    ];
  
    const colors = [
      "#B22222", // Dark Fire Red (Rusty Metal)  
      "#8B0000", // Deep Crimson (Oxidized Iron)  
      "#4B0082", // Dark Indigo (Burnt Steel)  
      "#2F4F4F", // Dark Slate Gray (Gunmetal)  
      "#696969", // Dim Gray (Lead)  
      "#FFD700", // Metallic Gold  
      "#8B4513", // Saddle Brown (Bronze)  
      "#708090", // Slate Gray (Titanium)  
      "#C0C0C0", // Silver  
      "#DAA520"  // Goldenrod (Aged Brass)  
    ];
    
    
  
    if (testId === "all") {
      return subjects.map((subject, index) => {
        const total = examData.reduce((sum, test) => sum + (test.subjects[subject] || 0), 0);
        const average = total / examData.length;
        return { subject, value: average, fill: colors[index] };
      });
    } else {
      const test = examData.find((t) => t.test === testId);
      if (!test) return [];
      return subjects.map((subject, index) => ({
        subject,
        value: test.subjects[subject] || 0,
        fill: colors[index],
      }));
    }
  };
  

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="p_container">
    <ToastContainer position="top-center" autoClose={3000} />

      {/* Dropdown Selection */}
      <div className="w-full max-w-[200px] relative">
        <Select value={selectedTest} onValueChange={setSelectedTest} defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Select test" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ALL</SelectItem>
            {examData.map((test) => (
              <SelectItem key={test.test} value={test.test}>
                {test.test}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-lg font-semibold mt-10">Loading data...</div>
      ) : examData.length === 0 ? (
        <div className="text-center text-lg font-semibold mt-10">No data available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full w-full p_con2 mt-10">
          {/* Line Chart - Performance Trend */}
          <Card className="w-full md:w-[50vw] max-w-[580px] h-fit aspect-square">
            <CardHeader>
              <CardTitle>Performance Trend</CardTitle>
              <CardDescription>Marks percentage across mock tests</CardDescription>
            </CardHeader>
            <CardContent className="h-fit flex justify-center items-center p-2">
              <ResponsiveContainer width="100%" minHeight={250} height={400}>
                <LineChart data={examData}>
                  <XAxis dataKey="test" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="percentage" stroke="hsl(var(--primary))" strokeWidth={2} />
                  {/* Highlight Selected Test (Dot Only) */}
                  {selectedTest !== "all" && (
                    <Line
                      type="monotone"
                      dataKey="percentage"
                      stroke="transparent"
                      dot={({ cx, cy, payload }) =>
                        payload.test === selectedTest ? (
                          <circle cx={cx} cy={cy} r={6} stroke="red" strokeWidth={2} fill="white" />
                        ) : null
                      }
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart - Subject Distribution */}
          <Card className="w-full md:w-[50vw] max-w-[580px] h-fit aspect-square">
            <CardHeader>
              <CardTitle>Subject Distribution</CardTitle>
              <CardDescription>
                {selectedTest === "all"
                  ? "Average marks by subject across all tests"
                  : `Subject marks for ${selectedTest}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-fit flex justify-center items-center p-2">
              <ResponsiveContainer width="100%" minHeight={250} height={400}>
                <PieChart>
                  <Pie
                    data={getSubjectData(selectedTest)}
                    dataKey="value"
                    nameKey="subject"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ subject, value }) => `${subject}: ${value.toFixed(1)}`}
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

    <div>
    {role !== "admin" && (
        <button className="feedback-button" onClick={togglePopup}>
          <img src={p1} alt="Feedback" className="feedback-gif" />
        </button>
      )}


      {/* Pop-up Window */}
     
      {showPopup && (
  <div className="popup">
    <button className="close-btn" onClick={togglePopup}>×</button>
    {/*<h3>Feedback</h3>*/}
    {feedback && Object.keys(feedback).length > 0 ? (
      <div className="feedback-content">
        {Object.entries(feedback).map(([key, value]) => (
          <div key={key} className="feedback-item">
            <h2  className="chatsub">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </h2>
            <p>{value}</p>
          </div>
        ))}
      </div>
    ) : (
      <p>Loading feedback...</p>
    )}
  </div>

)}

    </div>
    </div>
  );
}
