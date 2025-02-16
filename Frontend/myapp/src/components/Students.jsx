"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import "../styles/students.css";

export default function Students() {
  const [students, setStudents] = useState([]);

  // Fetch student data from the backend
  useEffect(() => {
    fetch("http://localhost:3001/students") // Update the URL if needed
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error("Error fetching students:", error));
  }, []);

  return (
    <div className="s_container">
      <div className="s_card">
        <h1 className="s_header">STUDENT PROGRESS</h1>
        <div className="s_table-container">
          <Table className="s_table">
            <TableHeader className="s_table-header">
              <TableRow>
                <TableHead className="s_head s_sno">S.NO</TableHead>
                <TableHead className="s_head">REG NO</TableHead>
                <TableHead className="s_head">NAME</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length > 0 ? (
                students.map((student, index) => (
                  <TableRow key={student.regno} className="s_row">
                    <TableCell className="s_cell">{index + 1}</TableCell>
                    <TableCell className="s_cell">{student.regno}</TableCell>
                    <TableCell className="s_cell">{student.name}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="3" className="s_cell">No students found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
