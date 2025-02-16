const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const API_KEY = "AIzaSyBW5Ax951uAsja11fcbbFj9GiefMf1kyU4"; // Replace with your actual API key
const MODEL_NAME = "gemini-pro";

// Function to generate AI feedback
async function getAIResponse(examData) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

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

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [{ role: "user", parts: [{ text: userInput }] }],
  });

  const result = await chat.sendMessage(userInput);
  let responseText = result.response.text();

  // Remove any unwanted symbols or formatting from AI response
  responseText = responseText.replace(/\*/g, "").trim();

  return responseText;
}

module.exports = getAIResponse;
