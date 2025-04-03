import React from "react";
import { useNavigate } from "react-router-dom";
import "./paymentSuccess.css";

const PaymentSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="payment-success-container">
            <h2>🎉 결제가 완료되었습니다! 🎉</h2>
            <p>구매해 주셔서 감사합니다. 주문이 정상적으로 처리되었습니다.</p>
            <button onClick={() => navigate("/")}>홈으로 이동</button>
        </div>
    );
};

export default PaymentSuccess;
