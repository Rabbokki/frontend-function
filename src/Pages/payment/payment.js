import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { fetchPostById } from "../../components/reducers/post/postThunk";
import { initiatePayment } from "../../components/reducers/payment/paymentThunk";

const Payment = () => {
  const location = useLocation();
  const { postId } = location.state || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("Received state in Payment:", location.state);

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
      const amount = postDetail.price;
      const response = await dispatch(initiatePayment({ postId, amount })).unwrap();

      if (response.next_redirect_pc_url) {
        window.location.href = response.next_redirect_pc_url;
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
      <img src={postDetail.imageUrls?.[0]} alt={postDetail.title} className="product-image" />
      <h2>{postDetail.title}</h2>
      <p>{postDetail.price}원</p>
      <button onClick={handlePayment} disabled={paymentLoading}>
        {paymentLoading ? "결제 요청 중..." : "결제하기"}
      </button>
      {paymentError && <p className="error">결제 오류: {paymentError}</p>}
      <button onClick={() => navigate(-1)}>취소</button>
    </div>
  );
};

export default Payment;