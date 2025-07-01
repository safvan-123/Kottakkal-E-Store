import nodemailer from "nodemailer";

export const sendOrderConfirmationEmail = async (req, res) => {
  const { to, order, invoice } = req.body;
  console.log(process.env.EMAIL_USER);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Generate HTML for order items
    const itemListHtml = order.items
      .map(
        (item) => `
          <li>
            <strong>${item.product.name}</strong> - Qty: ${item.quantity}, Price: ₹${item.product.price}
          </li>
        `
      )
      .join("");

    const htmlMessage = `
      <h2>🛍️ Order Confirmation - Kottakkal eStore</h2>
      <p>Thank you for your purchase!</p>
      <h3>Order Details:</h3>
      <ul>${itemListHtml}</ul>
      <p><strong>Total:</strong> ₹${order.total}</p>
      <p><span style="margin-top:5px;">We’ll deliver to: ${order.deliveryAddress?.address}, ${order.deliveryAddress?.city} , ${order.deliveryAddress?.pincode}</span></p>
      <br/>
      <p>🤝 Regards,<br/>Kottakkal eStore Team 💚 </p>
      <div style="margin-top: 40px; text-align: center;">
    <p style="font-size: 16px; font-weight: bold;">
      📥 Download your purchased bill from the attachment below
    </p> 
  </div>
    `;

    const mailOptions = {
      from: `"Kottakkal eStore" <${process.env.EMAIL_USER}>`,
      to,
      subject: "🛒✅ Order Confirmation - Thank You for Shopping!",
      html: htmlMessage,
      attachments: [
        {
          filename: `Invoice_${order._id}.pdf`,
          content: invoice,
          encoding: "base64",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email sent", info });
  } catch (error) {
    console.error("❌ Email sending error:", error);
    res
      .status(500)
      .json({ success: false, message: "Email sending failed", error });
  }
};
