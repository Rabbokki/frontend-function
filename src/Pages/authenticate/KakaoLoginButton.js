import React from "react";
import "./KakaoLoginButton.css";

const KakaoLoginButton = ({ onClick, disabled }) => {
  return (
    <button className="kakao-material-button" onClick={onClick} disabled={disabled}>
      <img src="/image/kakaoBubble.png" alt="Kakao Logo" className="kakao-material-button-icon" />
      <span className="kakao-material-button-contents">카카오 로그인</span>
    </button>
  );
};

export default KakaoLoginButton;