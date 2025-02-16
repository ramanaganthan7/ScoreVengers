"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import "../styles/students.css";


export default function Students() {
  // Sample student data array
  const students = [
    { id: 1, regNo: "2023001", name: "Alice Johnson" },
    { id: 2, regNo: "2023002", name: "Bob Smith" },
    { id: 3, regNo: "2023003", name: "Charlie Brown" },
    { id: 4, regNo: "2023004", name: "Diana Miller" },
    { id: 5, regNo: "2023005", name: "Edward Wilson" },
  ];

  return (
    <div>
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
            {students.map((student) => (
              <TableRow key={student.id} className="s_row">
                <TableCell className="s_cell">{student.id}</TableCell>
                <TableCell className="s_cell">{student.regNo}</TableCell>
                <TableCell className="s_cell">{student.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
     </div>
    </div>
    </div>
  );
}
