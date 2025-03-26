const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

async function sendMail(testName, date, studentEmails) {
    const htmlTemplatePath = path.join(__dirname, "email_template.html");
    let htmlContent = fs.readFileSync(htmlTemplatePath, "utf-8");

    // Replace placeholders in email template with actual values
    htmlContent = htmlContent.replace("{{TEST_NAME}}", testName);
    htmlContent = htmlContent.replace("{{DATE}}", date);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ramanaganthan2005@gmail.com",
            pass: "eldd jxdg mexv nukd"
        }
    });

    const mailOptions = {
        from: "ramanaganthan2005@gmail.com",
        to: studentEmails.join(","),
        subject: "GATE MOCK TEST Result Notification",
        html: htmlContent
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendMail;