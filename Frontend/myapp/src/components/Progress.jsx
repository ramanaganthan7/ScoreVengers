import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import "../styles/progress.css";

const performanceData = [
  {
    test: "Mock Test 1",
    percentage: 75,
    subjects: {
      Math: 80,
      Science: 70,
      English: 75,
      History: 72,
      Geography: 78,
    },
  },
  {
    test: "Mock Test 2",
    percentage: 82,
    subjects: {
      Math: 85,
      Science: 80,
      English: 82,
      History: 79,
      Geography: 84,
    },
  },
  {
    test: "Mock Test 3",
    percentage: 78,
    subjects: {
      Math: 75,
      Science: 82,
      English: 77,
      History: 80,
      Geography: 76,
    },
  },
  {
    test: "Mock Test 5",
    percentage: 85,
    subjects: {
      Math: 88,
      Science: 85,
      English: 83,
      History: 84,
      Geography: 85,
    },
  },
  {
    test: "Mock Test 6",
    percentage: 90,
    subjects: {
      Math: 88,
      Science: 85,
      English: 83,
      History: 84,
      Geography: 85,
    },
  },
  

];

export default function Progress() {
  const [selectedTest, setSelectedTest] = useState("all");

  const getSubjectData = (testId) => {
    if (testId === "all") {
      const subjects = Object.keys(performanceData[0].subjects);
      return subjects.map((subject, index) => {
        const total = performanceData.reduce((sum, test) => sum + test.subjects[subject], 0);
        const average = total / performanceData.length;
        return {
          subject,
          value: average,
          fill: `hsl(var(--chart-${index + 1}))`,
        };
      });
    } else {
      const test = performanceData.find((t) => t.test === testId);
      if (!test) return [];
      return Object.entries(test.subjects).map(([subject, value], index) => ({
        subject,
        value,
        fill: `hsl(var(--chart-${index + 1}))`,
      }));
    }
  };

  return (
    <div>
    <div className="p_container">
      <div className="w-full max-w-[200px] relative">
        <Select value={selectedTest} onValueChange={setSelectedTest} defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Select test" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ALL</SelectItem>
            {performanceData.map((test) => (
              <SelectItem key={test.test} value={test.test}>
                {test.test}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full w-full p_con2 mt-10">
        <Card className="w-full md:w-[50vw] max-w-[580px] h-fit aspect-square">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>Marks percentage across mock tests</CardDescription>
          </CardHeader>
          <CardContent className="h-fit flex justify-center items-center p-2">

            <ResponsiveContainer width="100%" minHeight={250} height={400}>
              <LineChart data={performanceData}>
                <XAxis dataKey="test" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="w-full md:w-[50vw] max-w-[580px] h-fit aspect-square">
          <CardHeader>
            <CardTitle>Subject Distribution</CardTitle>
            <CardDescription>
              {selectedTest === "all"
                ? "Average marks by subject across all tests"
                : `Subject marks for ${selectedTest}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-fit flex justify-center items-center p-2">
          <ResponsiveContainer width="100%" minHeight={250} height={400}>
              <PieChart>
                <Pie
                  data={getSubjectData(selectedTest)}
                  dataKey="value"
                  nameKey="subject"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ subject, value }) => `${subject}: ${value.toFixed(1)}%`}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
}
