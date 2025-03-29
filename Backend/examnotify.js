const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const recipients = [
    "rakeshsp.cse2023@citchennai.net",
    "ramanaganthans.cse2023@citchennai.net",
    "ramamuthukumarans.cse2023@citchennai.net",
    "sresandhyak.cse2023@citchennai.net",

];

async function sendMail(testName, date, staffName, examMode) {
    const htmlTemplatePath = path.join(__dirname, "anouncement_template.html");
    let htmlContent = fs.readFileSync(htmlTemplatePath, "utf-8");

    // Replace placeholders in email template with actual values
    htmlContent = htmlContent.replace("{{TEST_NAME}}", testName);
    htmlContent = htmlContent.replace("{{DATE}}", date);
    htmlContent = htmlContent.replace("{{STAFF_NAME}}", staffName);
    htmlContent = htmlContent.replace("{{EXAM_MODE}}", examMode);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ramanaganthan2005@gmail.com",
            pass: "eldd jxdg mexv nukd"
        }
    });

    const mailOptions = {
        from: "ramanaganthan2005@gmail.com",
        to: recipients.join(","),
        subject: "Exam Announcement",
        html: htmlContent
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendMail;