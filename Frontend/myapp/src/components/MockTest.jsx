"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import "../styles/mocktest.css";

export default function MockTest() {
  const [subjects, setSubjects] = useState([]);
  const [currentSubject, setCurrentSubject] = useState(0);
  const [answers, setAnswers] = useState({});
  const [subjectScores, setSubjectScores] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const location = useLocation();
  const examName = location.state?.exam_name || "Mock Test";

  useEffect(() => {
    fetch("http://localhost:3001/conduct")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        const groupedSubjects = data.reduce((acc, item, index) => {
          try {
            const parsedQuestion = JSON.parse(item.question);
            const subjectIndex = acc.findIndex((subj) => subj.name === item.subject);

            const questionObj = {
              id: index + 1,
              text: parsedQuestion.question,
              options: [parsedQuestion.choice1, parsedQuestion.choice2, parsedQuestion.choice3, parsedQuestion.choice4],
              correctAnswer: parsedQuestion.answer - 1,
            };

            if (subjectIndex === -1) {
              acc.push({ id: acc.length + 1, name: item.subject, questions: [questionObj] });
            } else {
              acc[subjectIndex].questions.push(questionObj);
            }
          } catch (error) {
            console.error("Error parsing question JSON:", error);
          }
          return acc;
        }, []);

        setSubjects(groupedSubjects);
      })
      .catch((error) => {
        console.error("Error fetching mock test:", error);
        toast.error("Failed to load questions.");
      });
  }, []);

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateSubjectScore = (subject) => {
    return subject.questions.reduce((score, question) =>
      score + (answers[question.id] === question.correctAnswer ? 2 : 0), 0);
  };

  const areAllQuestionsAnswered = () => {
    return subjects.every((subject) =>
      subject.questions.every((question) => answers[question.id] !== undefined)
    );
  };

  const handleSubmit = async () => {
    if (!areAllQuestionsAnswered()) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    const scores = {};
    subjects.forEach((subject) => {
      scores[subject.name] = calculateSubjectScore(subject);
    });

    setSubjectScores(scores);
    setSubmitted(true);
    const name = localStorage.getItem("userName");

    try {
      const response = await fetch("http://localhost:3001/submit-mocktest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name ,examName, scores }),
      });

      if (response.ok) {
        toast.success("Mock test submitted successfully!");
      } else {
        toast.error("Failed to submit test. Please Contact the respective Faculty.");
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      toast.error("An error occurred while submitting.");
    }
  };

  const totalScore = Object.values(subjectScores).reduce((a, b) => a + b, 0);
  const maxPossibleScore = subjects.reduce((total, subject) => total + subject.questions.length * 2, 0);

  return (
    <div className="container mx-auto p-4 max-w-4xl mock_con">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">{examName}</h1>
      <div className="flex flex-wrap gap-2 mb-6 ">
        {subjects.map((subject, index) => (
          <Button key={subject.id} variant={currentSubject === index ? "default" : "outline"} onClick={() => setCurrentSubject(index)}>
            {subject.name} {submitted && <span className="ml-2 text-sm">({subjectScores[subject.name] || 0}/{subject.questions.length * 2})</span>}
          </Button>
        ))}
      </div>
      {submitted && (
        <Alert className="mb-6">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Total Score: {totalScore} out of {maxPossibleScore} ({((totalScore / maxPossibleScore) * 100).toFixed(1)}%)
          </AlertDescription>
        </Alert>
      )}
      <Card className="mb-6 mock_con2">
        <CardHeader>
          <CardTitle>{subjects[currentSubject]?.name} Questions</CardTitle>
        </CardHeader>
        <CardContent>
          {subjects[currentSubject]?.questions.map((question, qIndex) => (
            <div key={question.id} className="mb-8">
              <div className="flex items-start">
                <h3 className="text-lg font-medium mb-4">{qIndex + 1}. {question.text}</h3>
              </div>
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="radio"
                    name={`q${question.id}`}
                    id={`q${question.id}-o${index}`}
                    value={index}
                    checked={answers[question.id] === index}
                    onChange={() => handleAnswerSelect(question.id, index)}
                    disabled={submitted}
                    className="cursor-pointer"
                  />
                  <Label htmlFor={`q${question.id}-o${index}`} className={submitted ? (question.correctAnswer === index ? "text-green-600 font-medium" : answers[question.id] === index ? "text-red-600" : "") : ""}>
                    {option}
                    {submitted && question.correctAnswer === index && " ✓"}
                    {submitted && answers[question.id] === index && question.correctAnswer !== index && " ✗"}
                  </Label>
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={handleSubmit} size="lg" disabled={submitted || !areAllQuestionsAnswered()}>Submit</Button>
      </div>
    </div>
  );
}
