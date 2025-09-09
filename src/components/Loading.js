import React, { useState, useEffect } from "react";

const Loading = () => {
  const [typedText, setTypedText] = useState("");
  const fullText = "Campus Portal";

  useEffect(() => {
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 150); // Typing speed

    return () => clearInterval(typeInterval);
  }, []);

  return (
    <div className="loading-screen d-flex flex-column justify-content-center align-items-center vh-100 bg-white text-primary animate__animated animate__fadeIn">
      <div className="text-center">
        <div className="logo mb-3">
          <i
            className="bi bi-mortarboard-fill text-primary"
            style={{ fontSize: "4rem" }}
          ></i>
        </div>
        <h1 className="display-4 fw-bold mb-2">
          {typedText}
          <span className="typing-cursor">|</span>
        </h1>
        <p className="lead">The future of education is here</p>
      </div>
    </div>
  );
};

export default Loading;
