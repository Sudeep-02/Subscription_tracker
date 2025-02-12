import nodemailer from "nodemailer";
import { EMAIL_OWNER_MAIL, EMAIL_PASSWORD } from "../../config/env.js";
export default async function sendExpiredEmail(
  ExpiredEmail,
  expiredSubName,
  ExpiredrenewalDate
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
    to: ExpiredEmail,
    subject: "Subscription Expired Notification", // Updated subject
    html: `
      <p>Hello,</p>
      <p>Your subscription for ${expiredSubName} has expired. The renewal date was <strong>${ExpiredrenewalDate.toLocaleDateString()}</strong>.</p>
      <p>Please take action to renew your subscription to avoid any interruptions.</p>
      <p>Best regards,<br>Your Subscription Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Expired email sent to ${ExpiredEmail}`); // Corrected variable name
  } catch (error) {
    console.error(`Failed to send expired email to ${ExpiredEmail}:`, error); // Corrected variable name
  }
}
