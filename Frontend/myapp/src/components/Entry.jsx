"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import "../styles/Entry.css";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";



export default function Entry() {
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const examName = location.state?.examName || "";

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!examName) return;

    setLoading(true);
    setError("");
    fetch(`http://localhost:3001/particular/${examName}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setStudents(data);
        } else {
          setStudents([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  }, [examName]);

  const handleEdit = () => setIsEditing(true);

  const handleMarkChange = (regNo, subject, value) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.regno === regNo
          ? { ...student, [subject]: Number(value) || 0 }
          : student
      )
    );
  };
  const handleUpdate = async () => {
    setIsEditing(false);
    toast.info("Updating...");
  
    try {
      const response = await fetch("http://localhost:3001/update-marks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ examName, students }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        toast.success("Updated successfully");
        setIsEditing(false);
      } else {
        throw new Error(result.message || "Failed to update");
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };
  return (
    <div className="e_container">
      <ToastContainer />

      <div className="e_card">
        <div className="e_header">
          <h2 className="e_title">{examName || "No Exam Selected"}</h2>
          <p className="e_date">Date: {new Date().toLocaleDateString()}</p>
          <div className="e_buttonGroup">
            <Button variant={isEditing ? "secondary" : "default"} onClick={handleEdit} disabled={isEditing}>
              Edit
            </Button>
            <Button onClick={handleUpdate} disabled={!isEditing}>
              Update
            </Button>
          </div>
        </div>

        <div className="e_tableContainer">
          {loading ? (
            <p>Loading data...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : students.length === 0 ? (
            <p>No Data Available</p>
          ) : (
            <Table className="e_table">
              <TableHeader>
                <TableRow className="e_tableHeader">
                  <TableHead className="e_tableHead">S.No</TableHead>
                  <TableHead className="e_tableHead">Reg No</TableHead>
                  <TableHead className="e_tableHead">Name</TableHead>
                  {Object.keys(students[0]).filter((key) => key !== "regno" && key !== "name").map((subject, index) => (
                    <TableHead key={index} className="e_tableHead">
                      {subject.replace(/_/g, " ")}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={student.regno} className="e_tableRow">
                    <TableCell className="e_tableCell">{index + 1}</TableCell>
                    <TableCell className="e_tableCell">{student.regno}</TableCell>
                    <TableCell className="e_tableCell">{student.name}</TableCell>
                    {Object.keys(student).filter((key) => key !== "regno" && key !== "name").map((subject, i) => (
                      <TableCell key={i} className="e_tableCell">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={student[subject]}
                            onChange={(e) => handleMarkChange(student.regno, subject, e.target.value)}
                            className="e_input"
                            min={0}
                            max={100}
                          />
                        ) : (
                          student[subject]
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
