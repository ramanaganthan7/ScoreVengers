import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLocation } from "react-router-dom";
import "../styles/progress.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import p1 from "../assets/ai.gif";
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import config from "../config";

export default function Progress() {
  const [selectedTest, setSelectedTest] = useState("all");
  const [examData, setExamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackt, setFeedbackt] = useState();
  const [showPopup, setShowPopup] = useState(false);

  const location = useLocation();
    const studentName = location.state?.studentName || "Unknown";
    const role = location.state?.role || "User"; // Get role
    let name= localStorage.getItem("userName");
    if (role=='admin'){
      name = studentName;
      }
  useEffect(() => {
    // Show loading toast
    toast.loading("Loading data...");
    fetch(`${config.API_BASE_URL}/exam-results/${name}`)
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
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState("")

const handleSubmit = async () => {
    if (!name || !feedbackt) {
        toast.warn("Please enter both teacher name and feedback.");
        return;
    }
    try {
        const response = await fetch(`${config.API_BASE_URL}/send-email3`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                teacherName: localStorage.getItem("userName"),
                feedback: feedbackt,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            toast.success("Feedback sent successfully!");
            setFeedback(""); 
            setIsOpen(false); 
        } else {
            toast.error(`Error: ${data.message || "Failed to send feedback."}`);
        }
    } catch (error) {
        toast.error("Network error. Please try again.");
    }
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
 {role == "admin" && (
<div>
<Button className="fixed bottom-4 right-4 rounded-full p-4" onClick={() => setIsOpen(true)}>
        <MessageCircle className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Teacher Feedback</h2>
            <Textarea
              placeholder="Enter your feedback here..."
              value={feedbackt}
              onChange={(e) => setFeedbackt(e.target.value)}
              className="w-full mb-4"
              rows={5}
            />
            <div className="flex justify-end">
              <Button variant="outline" className="mr-2" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                <Send className="h-4 w-4 mr-2" />
                Send Feedback
              </Button>
            </div>
          </div>
        </div>
      )}
</div>
 )}


    </div>
    </div>
  );
}
