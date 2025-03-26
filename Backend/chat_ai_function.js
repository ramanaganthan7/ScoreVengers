const { GoogleGenAI } = require("@google/genai");

const API_KEY = "AIzaSyCgwIsUqCRA2Jm4-cJWL1I2yIcfgfoy4Kk"; // Replace with your actual API key

// Function to generate AI feedback
async function getAIResponse(examData) {
  // Extract student details
  const studentName = examData.exams[0].data.name;
  const regNo = examData.exams[0].data.regno;

  // Format exam data into a structured prompt
  let userInput = `The student named ${studentName} (Reg No: ${regNo}) has completed multiple mock tests. Below are the scores for each subject in different mock tests:\n\n`;

  examData.exams.forEach((exam) => {
    userInput += `${exam.exam_name} Scores:\n`;
    Object.entries(exam.data).forEach(([key, value]) => {
      if (!["regno", "name", "maxobtained", "maxmark"].includes(key)) {
        userInput += `- ${key.replace(/_/g, " ")}: ${value}\n`;
      }
    });
    userInput += `Maximum Marks Obtained: ${exam.data.maxobtained}/${exam.data.maxmark}\n\n`;
  });

  userInput += `Based on this data, provide feedback for ${studentName} with the following sections:\n`;
  userInput += `Feedback: A brief summary of overall performance.\n`;
  userInput += `Areas of Improvement: Mention subjects that need more focus.\n`;
  userInput += `Motivation: Provide short encouragement to boost confidence and study strategies.\n`;

  // Initialize GoogleGenAI API
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Generate AI response
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ role: "user", parts: [{ text: userInput }] }],
  });
  
  let responseText = response?.text?.trim() || "Response not generated";
  responseText = responseText.replace(/\*/g, "").trim();

  // Extract structured response using regex
  const structuredResponse = {
    feedback: responseText.match(/Feedback:\s*(.*?)(?=Areas of Improvement:|$)/s)?.[1]?.trim() || "Not provided",
    areasOfImprovement: responseText.match(/Areas of Improvement:\s*(.*?)(?=Motivation:|$)/s)?.[1]?.trim() || "Not provided",
    motivation: responseText.match(/Motivation:\s*(.*)/s)?.[1]?.trim() || "Not provided",
  };

  return structuredResponse;
}

module.exports = getAIResponse;
