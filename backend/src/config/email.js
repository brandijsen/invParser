import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const buildTransporter = () => {
  // Production: use Brevo HTTP API (HTTPS port 443, works on Railway)
  if (process.env.BREVO_API_KEY) {
    return {
      sendMail: async ({ from, to, subject, html, text }) => {
        // Parse "Name <email>" format or plain email
        const fromMatch = String(from).match(/^"?([^"<]+)"?\s*<([^>]+)>$/);
        const senderName = fromMatch ? fromMatch[1].trim() : "InvParser";
        const senderEmail = fromMatch ? fromMatch[2].trim() : String(from);

        const res = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "api-key": process.env.BREVO_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender: { name: senderName, email: senderEmail },
            to: (Array.isArray(to) ? to : [to]).map((e) => ({ email: e })),
            subject,
            htmlContent: html,
            textContent: text,
          }),
        });
        if (!res.ok) {
          const body = await res.text();
          throw new Error(`Brevo error ${res.status}: ${body}`);
        }
        return res.json();
      },
    };
  }

  // Local development: use nodemailer SMTP
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const transporter = buildTransporter();
