import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { approvePayment } from "../../components/reducers/payment/paymentThunk";
import { useNavigate } from "react-router-dom";
import "./paymentProcess.css"; // Import CSS for styling

const PaymentProcess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pgToken = new URLSearchParams(window.location.search).get("pg_token");
    if (!pgToken) {
      navigate("/paymentFail");
      return;
    }

    dispatch(approvePayment(pgToken))
      .then(() => navigate("/paymentSuccess"))
      .catch(() => navigate("/paymentFail"))
      .finally(() => setLoading(false));
  }, [dispatch, navigate]);

  return (
    <div className="payment-process-container">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <p>Redirecting...</p>
      )}
    </div>
  );
};

export default PaymentProcess;