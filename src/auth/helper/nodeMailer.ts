import { config } from '../../config/config';
// import { getVerificationEmailTemplate } from
import nodemailer from 'nodemailer';
import { getVerificationEmailTemplate } from './nodeMailerTemplate';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.mailAddressKey,
    pass: config.mailSecretKey,
  },
});

// Send an email using async/await
export async function sendEmail(email: string, otp: string, name: string) {
  const htmlTemplate = await getVerificationEmailTemplate(email, name, otp);

  const info = await transporter.sendMail({
    from: `"Entry Ecommerce App" <${config.mailAddressKey}>`,
    to: `${email}`,
    subject: 'Gmail Verification Code',
    text: '',
    html: htmlTemplate,
  });

  return info;
}
