import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
 

export default function Dashboard() {
  const navigate = useNavigate();


  const handle_student =() =>{
    console.log("student");
    navigate("/students");

  };

  const handle_exam =() =>{
    console.log("exam");
    navigate("/exam");
  };

  return (
    <div>
    <div className=" h-fit bg-background p-6">
      <div className="grid h-[calc(85vh-4rem)] grid-cols-1 gap-10 md:grid-cols-2">
        <Card className="group relative flex h-600 w-full aspect-square items-center justify-center overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-accent/10">
          <CardHeader className="flex flex-col items-center justify-center space-y-6 text-center" onClick={handle_student}>
            <div className="rounded-full bg-primary/10 p-6 transition-colors group-hover:bg-primary/20">
              <GraduationCap className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Student Details</CardTitle>
          </CardHeader>
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </Card>

        <Card className="group relative flex h-600 w-full aspect-square items-center justify-center overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-accent/10" onClick={handle_exam}>
          <CardHeader className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="rounded-full bg-primary/10 p-6 transition-colors group-hover:bg-primary/20">
              <FileText className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">New Mock Test</CardTitle>
          </CardHeader>
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </Card>
      </div>
    </div>
    </div>
  );
}
