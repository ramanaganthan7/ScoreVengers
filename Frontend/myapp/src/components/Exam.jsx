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
import {useNavigate} from "react-router-dom";

export default function Exam() {
  const [tests, setTests] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage dialog visibility

  useEffect(() => {
    fetch("http://localhost:3001/exams")
      .then((res) => res.json())
      .then((data) => setTests(data))
      .catch((error) => console.error("Error fetching exams:", error));
  }, []);

  const handleCreateTest = async () => {
    if (newTitle && newDate) {
      try {
        const response = await fetch("http://localhost:3001/createexam", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            exam_name: newTitle,
            exam_date: newDate,
            creator: localStorage.getItem("userName"),
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setIsDialogOpen(false); // Close dialog
          toast.success(data.message); // Show success toast
          setNewTitle("");
          setNewDate("");
          setTimeout(() => window.location.reload(), 1500); // Refresh page after 1.5s
        } else {
          toast.error(data.message || "Failed to create exam");
        }
      } catch (error) {
        console.error("Error creating test:", error);
        toast.error("An error occurred. Please try again.");
      }
    } else {
      toast.warn("Please enter a valid test title and date");
    }
  };

  const navigate = useNavigate();
  
  const handle_update = (examName) => {
    navigate("/entry", { state: { examName } });
    console.log(examName);
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
              </CardContent>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">Creator: {test.creator}</p>
              </CardContent>
              <CardFooter className="flex gap-2 mt-auto">
                <Button variant="outline" className="flex-1" onClick={() => handle_update(test.exam_name)}>Update Marks</Button>
                <Button className="flex-1">Publish Result</Button>
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
                  <Input
                    id="title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Enter test title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Test Date</Label>
                  <Input id="date" type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
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
