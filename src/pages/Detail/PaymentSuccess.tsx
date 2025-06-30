import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
      <CheckCircle className="text-green-600 w-16 h-16 mb-4" />
      <h1 className="text-3xl font-bold text-green-700 mb-2">Thanh toán thành công!</h1>
      <p className="text-gray-700 mb-6">Cảm ơn bạn đã mua hàng tại TechStore.</p>
      <button
        className="px-6 py-2 bg-green-600 text-white rounded-2xl shadow hover:bg-green-700 transition"
        onClick={() => navigate("/")}
      >
        Về trang chủ
      </button>
    </div>
  );
}
