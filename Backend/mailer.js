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
            user: "rakeshsp330@gmail.com",
            pass: "tlug hlob hbka fojg"
        }
    });

    const mailOptions = {
        from: "rakeshsp330@gmail.com",
        to: studentEmails.join(","),
        subject: "HTML Email Test",
        html: htmlContent
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendMail;