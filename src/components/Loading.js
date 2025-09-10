import React, { useState, useEffect } from "react";
import "../styles/loading.css";

const Loading = () => {
  const [typedText, setTypedText] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
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

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 400);

    return () => {
      clearInterval(typeInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="loading-screen d-flex flex-column justify-content-center align-items-center vh-100 bg-primary text-white animate__animated animate__fadeIn">
      <div className="text-center">
        <div className="logo mb-3 animate__animated animate__pulse animate__infinite">
          <i
            className="bi bi-mortarboard-fill"
            style={{ fontSize: "4rem" }}
          ></i>
        </div>
        <h1 className="display-4 fw-bold mb-2">
          {typedText}
          <span className="typing-cursor">|</span>
        </h1>
        <p className="lead animate__animated animate__fadeIn animate__delay-1s">The future of education is here</p>
        
        <div className="progress mt-4 loading-progress">
          <div 
            className="progress-bar progress-bar-striped progress-bar-animated" 
            role="progressbar" 
            style={{ width: `${loadingProgress}%` }} 
            aria-valuenow={loadingProgress} 
            aria-valuemin="0" 
            aria-valuemax="100">
            {Math.round(loadingProgress)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
