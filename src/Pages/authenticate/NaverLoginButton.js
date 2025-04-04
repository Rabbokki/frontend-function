import React from "react";
import "./NaverLoginButton.css";

const NaverLoginButton = ({ onClick, disabled }) => {
  return (
    <button className="naver-material-button" onClick={onClick} disabled={disabled}>
        <img src="/image/naverLogo.png" alt="Naver Logo" className="naver-material-button-icon" />
        <span className="naver-material-button-contents">네이버 로그인</span>
    </button>
  );
};

export default NaverLoginButton;