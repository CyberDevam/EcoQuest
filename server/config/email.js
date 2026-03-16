const nodemailer = require('nodemailer');

const transporter = (process.env.EMAIL_USER && process.env.EMAIL_PASS) 
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
  : null;

const sendOTP = async (email, otp) => {
  if (!transporter) {
    throw new Error('Email credentials missing. Please set EMAIL_USER and EMAIL_PASS in .env');
  }

  const mailOptions = {
    from: `"EcoQuest" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'EcoQuest - Email Verification OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #2e7d32; text-align: center;">Welcome to EcoQuest!</h2>
        <p>Thank you for joining our mission to create a greener future. To complete your registration, please use the following One-Time Password (OTP):</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2e7d32; background: #e8f5e9; padding: 10px 20px; border-radius: 5px; border: 1px dashed #2e7d32;">
            ${otp}
          </span>
        </div>
        <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #757575; text-align: center;">
          EcoQuest - Gamified Environmental Education
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTP };
