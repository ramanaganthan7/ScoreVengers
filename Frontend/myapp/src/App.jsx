import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Progress from "./components/Progress";
import Exam from "./components/Exam";
import Students from "./components/Students";
import Entry from "./components/Entry";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [name, setName] = useState(""); // State to store user name

  return (
    <Router>
      <MainContent name={name} setName={setName} />
    </Router>
  );
}

function MainContent({ name, setName }) {
  const location = useLocation();
  const hideNavbar = location.pathname === "/";
  console.log(name,'app.jsx');

  return (
    
    <>
      {!hideNavbar && <Navbar name={name} />} {/* Show Navbar only if not on login */}

      <Routes>
        <Route path="/" element={<Login setName={setName} />} /> {/* Pass setName */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/student" element={<Progress />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/entry" element={<Entry />} />
        <Route path="/students" element={<Students />} />
      </Routes>
    </>
  );
}

export default App;
