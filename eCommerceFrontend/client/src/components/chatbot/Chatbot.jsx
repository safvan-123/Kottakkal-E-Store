import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Chatbot.css";
import ReactMarkdown from "react-markdown";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
function Chatbot() {
  const { token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const response = await axios.post(
        // `${import.meta.env.VITE_API_URL}/api/chat`,
        "http://localhost:5050/api/chat",
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 Attach token securely
          },
        }
      );

      const botMsg = { sender: "bot", text: response.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("❌ Chat error:", error);
      const errMsg = { sender: "bot", text: "⚠️ Sorry, chatbot is offline." };
      setMessages((prev) => [...prev, errMsg]);
    }
  };

  return (
    <div className="chatbot-container">
      <h2>🛍️ Kottakkal E Store AI Assistant</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <div className="message">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about products or orders..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;
