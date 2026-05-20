import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const info = await transporter.sendMail({
  from: `TINCLO Jobs <${process.env.EMAIL_USER}>`,
  to: 'amarendar688@gmail.com',
  subject: 'Test: TINCLO Application Confirmation',
  html: `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#f0f4ff;border-radius:12px;">
      <h2 style="color:#667eea">Application Submitted!</h2>
      <p>This is a test confirmation email from <strong>TINCLO</strong>.</p>
      <p>Your application for <strong>Full Stack Developer at Infosys</strong> has been received.</p>
      <p style="color:#48bb78;font-weight:bold;">Email is working correctly!</p>
    </div>
  `,
});

console.log('✅ Email sent! MessageId:', info.messageId);
