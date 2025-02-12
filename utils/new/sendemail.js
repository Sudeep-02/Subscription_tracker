import nodemailer from "nodemailer";
import { EMAIL_OWNER_MAIL, EMAIL_PASSWORD } from "../../config/env.js";
export default async function sendRenewalEmail(
  userEmail,
  subscriptionName,
  renewalDate
) {
  // Set up your email transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_OWNER_MAIL,
      pass: EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: EMAIL_OWNER_MAIL,
    to: userEmail,
    subject: "Subscription Renewal Reminder",
    html: `
      <p>Hello,</p>
      <p>Your subscription for ${subscriptionName} is due for renewal on <strong>${renewalDate.toLocaleDateString()}</strong>.</p>
      <p>Please take action to renew your subscription to avoid any interruptions.</p>
      <p>Best regards,<br>Your Subscription Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Renewal email sent to ${userEmail}`);
  } catch (error) {
    console.error(`Failed to send email to ${userEmail}:`, error);
  }
}
