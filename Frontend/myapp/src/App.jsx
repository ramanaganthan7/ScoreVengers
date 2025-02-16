import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Progress from "./components/Progress";
import Exam from "./components/Exam";
import Students from "./components/Students";
import Entry from "./components/Entry";
import Navbar from "./components/Navbar";
import "./App.css";

function AppContent({ name, setName }) {
  const location = useLocation(); 

  useEffect(() => {
    localStorage.setItem("userName", name);
  }, [name]);

  return (
    <>
      {location.pathname !== "/" && <Navbar name={name} />}
      <Routes>
        <Route path="/" element={<Login setName={setName} />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/student" element={<Progress />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/entry" element={<Entry />} />
        <Route path="/students" element={<Students />} />
      </Routes>
    </>
  );
}

function App() {
  const [name, setName] = useState(localStorage.getItem("userName") || "");

  return (
    <Router>
      <AppContent name={name} setName={setName} />
    </Router>
  );
}

export default App;
