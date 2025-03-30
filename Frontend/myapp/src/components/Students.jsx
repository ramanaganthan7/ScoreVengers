import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import "../styles/students.css";
import config from "../config";

export default function Students() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();
  // Fetch student data from the backend
  useEffect(() => {
    fetch(`${config.API_BASE_URL}/students`) // Update the URL if needed
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error("Error fetching students: ", error));
  }, []);

  // Handle row click
  const handleRowClick = (name) => {
    navigate("/progress", { state: { studentName: name, role: "admin" } }); // Pass student name and "admin"
  };

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
                  <TableRow key={student.regno} className="s_row" onClick={ () => handleRowClick(student.name) } style={{ cursor: "pointer" }}>
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
