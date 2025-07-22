import React, { useState } from "react";
import { X } from "lucide-react";
import "./FloatingChatWidget.css";
import Chatbot from "./Chatbot";

const FloatingChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      <div className="chat-launcher" onClick={toggleChat}>
        {isOpen ? (
          <X size={24} color="#fff" />
        ) : (
          <span className="chat-icon">💬</span>
        )}
      </div>

      {isOpen && (
        <div className="chat-popup">
          <Chatbot />
        </div>
      )}
    </>
  );
};

export default FloatingChatWidget;
