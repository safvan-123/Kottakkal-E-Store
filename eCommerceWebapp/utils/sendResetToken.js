import nodemailer from "nodemailer";

export const sendResetToken = async ({ user, token }) => {
  const resetLink = `https://kottakkal-e-store.vercel.app/reset-password/${token}`;
  console.log("🔗 Reset Link:", resetLink);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Kottakkal e-Store" <kottakalestore@gmail.com>`,
    to: user.email,
    subject: "🔒 Reset Your Kottakkal e-Store Password",
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
      <h2>Hello ${user.name || "User"},</h2>
      <p>You requested to reset your password for your <strong>Kottakkal e-Store</strong> account.</p>
      <p>Click the button below to reset it:</p>
      <p style="text-align: center; margin: 20px 0;">
        <a href="${resetLink}" style="padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </p>
      <p>Or copy and paste this link into your browser:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p><strong>Note:</strong> This link will expire in 30 minutes for security reasons.</p>
      <br/>
      <p>If you did not request this, you can safely ignore this email.</p>
      <hr style="margin-top: 30px;"/>
      <p style="font-size: 0.9em; color: #999;">&copy; ${new Date().getFullYear()} Kottakkal e-Store. All rights reserved.</p>
    </div>
  `,
  };

  await transporter.sendMail(mailOptions);
};
