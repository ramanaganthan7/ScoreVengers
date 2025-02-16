"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import "../styles/Entry.css"
import Navbar from "./Navbar"

export default function Entry() {
  const [isEditing, setIsEditing] = useState(false)

  const [students, setStudents] = useState([
    {
      id: 1,
      regNo: "001",
      name: "John Doe",
      subjects: {
        math: 85, physics: 92, chemistry: 88, biology: 78, history: 90,
        geography: 82, economics: 75, civics: 80, computer: 95, english: 87,
        maxMarks: 1000,
      obtainedMarks: 852
      }
      
    },
    {
      id: 2,
      regNo: "002",
      name: "Jane Smith",
      subjects: {
        math: 90, physics: 88, chemistry: 95, biology: 85, history: 88,
        geography: 79, economics: 81, civics: 76, computer: 92, english: 91,maxMarks: 1000,
        obtainedMarks: 885
      }
      
    },
  ])

  const handleEdit = () => setIsEditing(true)
  const handleUpdate = () => setIsEditing(false)

  const handleMarkChange = (studentId, subject, value) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              subjects: { ...student.subjects, [subject]: Number(value) || 0 },
            }
          : student
      )
    )
  }

  return (
    <div>
      <Navbar></Navbar>
    <div className="e_container ">
      <div className="e_card">
        <div className="e_header">
          <h2 className="e_title">Mid-Term Assessment</h2>
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
          <Table className="e_table">
            <TableHeader>
              <TableRow className="e_tableHeader">
                <TableHead className="e_tableHead">S.No</TableHead>
                <TableHead className="e_tableHead">Reg No</TableHead>
                <TableHead className="e_tableHead">Name</TableHead>
                {Object.keys(students[0].subjects).map((subject, index) => (
                  <TableHead key={index} className="e_tableHead">{subject.charAt(0).toUpperCase() + subject.slice(1)}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={student.id} className="e_tableRow">
                  <TableCell className="e_tableCell">{index + 1}</TableCell>
                  <TableCell className="e_tableCell">{student.regNo}</TableCell>
                  <TableCell className="e_tableCell">{student.name}</TableCell>
                  {Object.keys(student.subjects).map((subject, i) => (
                    <TableCell key={i} className="e_tableCell">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={student.subjects[subject]}
                          onChange={(e) => handleMarkChange(student.id, subject, e.target.value)}
                          className="e_input"
                          min={0}
                          max={100}
                        />
                      ) : (
                        student.subjects[subject]
                      )}
                    </TableCell>
                  ))}
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
    </div>
  )
}
