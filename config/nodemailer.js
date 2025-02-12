import nodemailer from "nodemailer";

import { EMAIL_OWNER_MAIL, EMAIL_PASSWORD } from "./env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_OWNER_MAIL,
    pass: EMAIL_PASSWORD,
  },
});

export default transporter;
