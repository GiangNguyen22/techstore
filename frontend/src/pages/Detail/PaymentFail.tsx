import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentFail() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4">
      <XCircle className="text-red-600 w-16 h-16 mb-4" />
      <h1 className="text-3xl font-bold text-red-700 mb-2">Thanh toán thất bại!</h1>
      <p className="text-gray-700 mb-6">Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.</p>
      <button
        className="px-6 py-2 bg-red-600 text-white rounded-2xl shadow hover:bg-red-700 transition"
        onClick={() => navigate("/")}
      >
        Về trang chủ
      </button>
    </div>
  );
}
