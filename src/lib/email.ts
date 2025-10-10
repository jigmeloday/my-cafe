import nodemailer from 'nodemailer';

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

const email = process.env.SMTP_USER;
const password = process.env.SMTP_PASS;
export const transport = nodemailer.createTransport({
  auth: {
    user: email,
    pass: password,
  },
});
