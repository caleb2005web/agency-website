import nodemailer from "nodemailer";
import { SITE } from "./config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

export async function sendInquiryEmails(i: { name: string; email: string; subject: string; message: string }) {
  const from = `"${SITE.name}" <${process.env.SMTP_USER}>`;
  try {
    // 1. Notify the agency
    await transporter.sendMail({
      from,
      to: process.env.ADMIN_EMAIL,
      replyTo: i.email,
      subject: `New inquiry: ${i.subject || "No subject"}`,
      html: `<h3>New message from ${esc(i.name)}</h3>
        <p><b>Email:</b> ${esc(i.email)}</p>
        <p><b>Subject:</b> ${esc(i.subject || "-")}</p>
        <p>${esc(i.message).replace(/\n/g, "<br>")}</p>`,
    });
    // 2. Auto-reply to the visitor
    await transporter.sendMail({
      from,
      to: i.email,
      subject: `We got your message - ${SITE.name}`,
      html: `<p>Hi ${esc(i.name)},</p>
        <p>Thanks for contacting us. We received your message and will reply within 1-2 business days.</p>
        <p>- ${SITE.name}</p>`,
    });
  } catch (err) {
    console.error("Email failed:", err);
  }
}
