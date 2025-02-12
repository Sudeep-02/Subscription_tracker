import { generateEmailTemplate } from "./email-template.js";
import dayjs from "dayjs";
import transporter from "../../config/nodemailer.js";
import { EMAIL_OWNER_MAIL } from "../../config/env.js";
import calculator from "./daycalculator.js";

const sendReminderEmail = async ({ subscription, daysleft }) => {
  // Check if user or email is missing
  if (!subscription.user || !subscription.user.email) {
    throw new Error("Missing required parameters");
  }

  const { days, hours, minutes } = calculator(daysleft);

  const mailInfo = {
    userName: subscription.user.name,
    subscriptionName: subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format("MMM D, YYYY"),
    planName: subscription.name,
    price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
    paymentMethod: subscription.paymentMethod,
    days,
    hours,
    minutes,
  };

  const message = generateEmailTemplate(mailInfo);

  const mailOptions = {
    from: EMAIL_OWNER_MAIL,
    to: subscription.user.email,
    subject: "Subscription Renewal Reminder",
    html: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log(error, "Error sending email");

    console.log("Email sent: " + subscription.user.email);
  });
};

export default sendReminderEmail;
