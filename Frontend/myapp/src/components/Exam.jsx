"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "../styles/exam.css";

export default function Exam() {
  const [tests, setTests] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");

  const handleCreateTest = () => {
    if (newTitle && newDate) {
      setTests([...tests, { id: Date.now(), title: newTitle, date: newDate }]);
      setNewTitle("");
      setNewDate("");
    }
  };

  return (
    <div>
    <h1 className=" flex justify-start text-2xl font-bold mb-9">MOCK TEST ENTRY</h1>
    <div className="container mx-auto p-6 exam-con">
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map((test) => (
          <Card key={test.id} className="w-full flex flex-col h-full">
          <CardHeader>
            <CardTitle>{test.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground">Date: {test.date}</p>
          </CardContent>
          <CardFooter className="flex gap-2 mt-auto">
            <Button variant="outline" className="flex-1">
              Update Marks
            </Button>
            <Button className="flex-1">Publish Result</Button>
          </CardFooter>
        </Card>
        ))}

        <Dialog>
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
    </div>
  );
}
