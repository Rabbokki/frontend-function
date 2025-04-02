import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPostById } from "../../components/reducers/post/postThunk";
import { initiatePayment } from "../../components/reducers/payment/paymentThunk";

const Payment = () => {
  const { id: postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { postDetail, loading, error } = useSelector((state) => state.posts);
  const { paymentUrl, loading: paymentLoading, error: paymentError } = useSelector((state) => state.payment);

  useEffect(() => {
    if (!postId) {
      console.error("No postId found!");
      return;
    }
    dispatch(fetchPostById(postId));
  }, [postId, dispatch]);

  const handlePayment = async () => {
    if (!postDetail) return;

    try {
      const { title, price } = postDetail;
      const amount = price;
      const quantity = 1;
      const userEmail = localStorage.getItem("userEmail");
      const itemName = title;

      const paymentData = {
        postId,
        amount,
        quantity,
        userEmail,
        itemName,
        totalAmount: amount * quantity,
        vatAmount: Math.round(amount * 0.1),
        approvalUrl: "http://localhost:8081/payment/success",
        cancelUrl: "http://localhost:8081/payment/cancel",
        failUrl: "http://localhost:8081/payment/fail",
      };

      console.log("From payment page, here's paymentData:", paymentData);

      const response = await dispatch(initiatePayment(paymentData)).unwrap();

      if (response?.next_redirect_pc_url) {
        window.location.href = response.next_redirect_pc_url;
      } else {
        console.error("No redirect URL received:", response);
        alert("결제 페이지 이동에 실패했습니다.");
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("결제 요청 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!postDetail) return <p>상품 정보를 불러올 수 없습니다.</p>;

  return (
    <div className="payment-page">
      <h1>결제 페이지</h1>
      <img
        src={postDetail?.imageUrls?.[0] || "/default-image.jpg"}
        alt={postDetail?.title || "상품 이미지"}
        className="product-image"
      />
      <h2>{postDetail.title}</h2>
      <p>{postDetail.price}원</p>
      <button onClick={handlePayment} disabled={!postDetail || paymentLoading}>
        {paymentLoading ? "결제 요청 중..." : "결제하기"}
      </button>
      {paymentError && <p className="error">결제 오류: {paymentError}</p>}
      <button onClick={() => navigate(-1)}>취소</button>
    </div>
  );
};

export default Payment;
