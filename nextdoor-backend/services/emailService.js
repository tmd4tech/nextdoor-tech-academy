const nodemailer = require('nodemailer');
const env = require('../config/environment');

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: false,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
};

const sendVerificationEmail = async (email, token, link) => {
  const html = `
    <h2>Email Verification</h2>
    <p>Click the link below to verify your email:</p>
    <a href="${link}">Verify Email</a>
    <p>Or use this token: ${token}</p>
  `;
  return sendEmail(email, 'Email Verification', html);
};

const sendPasswordResetEmail = async (email, resetLink) => {
  const html = `
    <h2>Password Reset Request</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
  `;
  return sendEmail(email, 'Password Reset', html);
};

const sendOrderConfirmationEmail = async (email, orderDetails) => {
  const html = `
    <h2>Order Confirmation</h2>
    <p>Thank you for your order!</p>
    <p><strong>Order Number:</strong> ${orderDetails.orderNumber}</p>
    <p><strong>Total Amount:</strong> $${orderDetails.totalAmount}</p>
    <p><strong>Status:</strong> ${orderDetails.status}</p>
  `;
  return sendEmail(email, 'Order Confirmation', html);
};

const sendEnrollmentConfirmationEmail = async (email, courseDetails) => {
  const html = `
    <h2>Course Enrollment Confirmation</h2>
    <p>You have successfully enrolled in:</p>
    <p><strong>Course:</strong> ${courseDetails.courseName}</p>
    <p><strong>Amount Paid:</strong> $${courseDetails.amount}</p>
    <p>Access your course dashboard to get started.</p>
  `;
  return sendEmail(email, 'Course Enrollment Confirmation', html);
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendEnrollmentConfirmationEmail,
};
