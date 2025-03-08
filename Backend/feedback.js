const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const emailSender = "rakeshsp330@gmail.com";
const emailPassword = "tlug hlob hbka fojg";

const emailRecipients = [
    "rakeshsp.cse2023@citchennai.net",
    "ramanaganthans.cse2023@citchennai.net",
    "ramamuthukumarans.cse2023@citchennai.net",
    "rahuljahannathank.cse2023@citchennai.net"
];

async function sendFeedbackEmail(teacherName, feedback) {
    const templatePath = path.join(__dirname, "faculty-feedback-email.html");
    let emailContent = fs.readFileSync(templatePath, "utf-8");

    // Replace placeholders with actual values
    emailContent = emailContent.replace("{{TEACHER_NAME}}", teacherName);
    emailContent = emailContent.replace("{{FEEDBACK}}", feedback);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: emailSender,
            pass: emailPassword
        }
    });

    const mailOptions = {
        from: emailSender,
        to: emailRecipients.join(","),
        subject: `Feedback from ${teacherName}`,
        html: emailContent
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendFeedbackEmail;
