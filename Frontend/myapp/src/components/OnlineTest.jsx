import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "../styles/online.css";
import { useNavigate } from "react-router-dom";

export default function OnlineTest() {
  const [mockTests, setMockTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch("http://localhost:3001/online"); // Update with your backend URL
        if (!response.ok) {
          throw new Error("Failed to fetch exams");
        }
        const data = await response.json();
        setMockTests(data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    fetchExams();
  }, []);

  const handle_goto = (exam_name) => {
    console.log("exam_name", exam_name);
    navigate("/mocktest", { state: { exam_name } });
  };

  return (
    <div>
      <h1 className="flex justify-start text-2xl font-bold mb-9">Active Mock Tests</h1>
      <div className="container mx-auto p-6 exam-cont">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockTests.length > 0 ? (
            mockTests.map((test) => (
              <Card
                key={test.id}
                className="w-full flex flex-col h-full transition-transform duration-200 ease-in-out hover:scale-105 card_o"
                onClick={() => handle_goto(test.exam_name)} // Wrap in an anonymous function to avoid immediate execution
              >
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{test.exam_name}</CardTitle> {/* Increased size */}
                </CardHeader>
                <CardContent className="mt-auto"> {/* Pushes content to the bottom */}
                  <p className="text-sm text-gray-600">Date: {test.date}</p>
                  <p className="text-sm text-gray-600">Creator: {test.creator}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-600">No active mock tests available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
