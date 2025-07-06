import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const sendWhatsappMessage = async (recipientPhone, messageText) => {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to: recipientPhone,
    type: "text",
    text: {
      body: messageText,
    },
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ WhatsApp message sent:", response.data);
  } catch (error) {
    console.error(
      "❌ WhatsApp message error:",
      error.response?.data || error.message
    );
  }
};
