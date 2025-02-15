import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from "@/components/ui/button";
import Login from './components/Login'
import Exam from './components/Exam'
import Dashboard from './components/Dashboard';
import Progress from './components/Progress';
import Students from './components/Students';
import Navbar from './components/Navbar';
import Entry from './components/Entry';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar></Navbar>
    
      <Students></Students>
      

   






   { /*
   <Login></Login>
      <Dashboard> </Dashboard>
       
<Exam></Exam>
      <Entry></Entry>
    <Progress></Progress>




    */}
      </>

       
  )
}

export default App
