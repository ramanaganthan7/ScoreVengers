import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "../styles/exam.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import config from "../config.js";

export default function Exam() {
  const [tests, setTests] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newMode, setNewMode] = useState("Online"); // Default mode
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/exams`)
      .then((res) => res.json())
      .then((data) => setTests(data))
      .catch((error) => console.error("Error fetching exams:", error));
  }, []);
  console.log(tests);
  const handleCreateTest = async () => {
    if (!newTitle || !newDate) {
      toast.warn("Please enter a valid test title and date");
      return;
    }
  
    try {
      const response = await fetch(`${config.API_BASE_URL}/createexam`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam_name: newTitle,
          exam_date: newDate,
          exam_mode: newMode,
          creator: localStorage.getItem("userName"),
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        toast.error(data.message || "Failed to create exam");
        return;
      }
  
      toast.success(data.message);
  
      // Ensure test is created before sending the email
      await fetch(`${config.API_BASE_URL}/send-email1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testName: newTitle,
          date: newDate,
          staffName: localStorage.getItem("userName"),
          examMode: newMode,
        }),
      });
  
      toast.success("Email announcement sent successfully!");
  
      // Reset form fields and close dialog
      setNewTitle("");
      setNewDate("");
      setNewMode("Online");
      setIsDialogOpen(false);
  
      // Refresh tests without reloading the page
      setTests((prevTests) => [
        ...prevTests,
        { exam_name: newTitle, date: newDate, mode: newMode, creator: localStorage.getItem("userName") },
      ]);
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  

  const navigate = useNavigate();
  
  const handle_update = (examName) => {
    navigate("/entry", { state: { examName } });
    console.log(examName);
  };
  const handle_email = async (e_name, e_date) => {
    const toastId = toast.loading("Sending result notifications...");
  
    try {
      const response = await fetch(`${config.API_BASE_URL}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testName: e_name,
          date: e_date,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.update(toastId, {
          render: "Result notifications sent successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        console.log("Result Published:", data.message);
      } else {
        toast.update(toastId, {
          render: data.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        console.error("Error publishing result:", data.message);
      }
    } catch (error) {
      toast.update(toastId, {
        render: "Request failed. Try again later.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error("Request failed:", error);
    }
  };
  return (
    <div>
      <h1 className="flex justify-start text-2xl font-bold mb-9">MOCK TEST ENTRY</h1>
      <div className="container mx-auto p-6 exam-con">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((test) => (
            <Card key={test.id} className="w-full flex flex-col h-full transition-transform duration-200 ease-in-out hover:scale-105">
              <CardHeader>
                <CardTitle>{test.exam_name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">Date: {test.date}</p>
                <p className="text-muted-foreground">Mode: {test.mode}</p>
                <p className="text-muted-foreground">Creator: {test.creator}</p>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 mt-auto">
                <Button variant="outline" className="flex-1 w-full" onClick={() => handle_update(test.exam_name)}>Update Marks</Button>
                <Button className="flex-1 w-full" onClick={() => handle_email(test.exam_name, test.date)}>Publish Result</Button>
              </CardFooter>
            </Card>
          ))}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Card className="w-full h-[300px] flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent>
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Test</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Test Title</Label>
                  <Input id="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Enter test title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Test Date</Label>
                  <Input id="date" type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mode">Mode</Label>
                  <select id="mode" value={newMode} onChange={(e) => setNewMode(e.target.value)} className="border p-2 rounded">
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>
              <Button onClick={handleCreateTest}>Create Test</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}