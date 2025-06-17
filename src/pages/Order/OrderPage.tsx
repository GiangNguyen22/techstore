import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrder } from "../../api/order";
import { getProductById } from "../../api/products";
import { Product, ProductVariant } from "../../types/Product.type";
import { useNotification } from "../../pages/Detail/NotificationProvider";
import Header from "../../components/commom/Header/Header";
import FooterComponent from "../../components/commom/FooterComponent";

type OrderItem = {
  productId: number;
  productVariantId: number;
  quantity: number;
};

type ProductInfo = {
  product: Product;
  variant: ProductVariant;
  quantity: number;
};

const OrderPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showMessage } = useNotification();

  const state = location.state as OrderItem[] | OrderItem | undefined;
  const orderItems: OrderItem[] = Array.isArray(state)
    ? state
    : state
    ? [state]
    : [];

  const [productInfos, setProductInfos] = useState<ProductInfo[]>([]);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"VNPAY" | "COD">("VNPAY");
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    if (orderItems.length === 0) {
      navigate("/cart");
      return;
    }

    Promise.all(
      orderItems.map(async (item) => {
        const product = await getProductById(item.productId);
        const variant = product.variants.find(
          (v: any) => v.id === item.productVariantId
        );
        if (!variant) throw new Error("Không tìm thấy biến thể sản phẩm");
        return { product, variant, quantity: item.quantity };
      })
    )
      .then(setProductInfos)
      .catch((err) => {
        console.error(err);
        showMessage("Không thể tải thông tin sản phẩm.", "error");
        navigate("/cart");
      });
  }, []);

  const totalAmount = productInfos.reduce(
    (sum, info) => sum + info.product.price * info.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();

    if (!trimmedPhone || !trimmedAddress) {
      showMessage("Vui lòng nhập đầy đủ địa chỉ và số điện thoại.", "error");
      return;
    }

    if (!/^0\d{9}$/.test(trimmedPhone)) {
      showMessage(
        "Số điện thoại không hợp lệ. Phải có đúng 10 số và bắt đầu bằng số 0.",
        "error"
      );
      return;
    }

    if (trimmedAddress.length < 20) {
      showMessage("Địa chỉ phải có ít nhất 20 ký tự.", "error");
      return;
    }

    const orderRequest = {
      address: trimmedAddress,
      phone: trimmedPhone,
      paymentMethod,
      totalAmount,
      orderDetailRequests: productInfos.map((info) => ({
        productId: info.product.id,
        productVariantId: info.variant.id,
        quantity: info.quantity,
      })),
    };

    try {
      setLoading(true);
      const res = await createOrder(orderRequest);
      showMessage("Đặt hàng thành công!", "success");
      window.location.href = res.data.paymentUrl;
    } catch (error) {
      console.error(error);
      showMessage("Đặt hàng thất bại, vui lòng thử lại.", "error");
    } finally {
      setLoading(false);
    }
  };
  const validatePhone = (value: string) => {
    if (!/^0\d{9}$/.test(value)) {
      setPhoneError("Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0.");
    } else {
      setPhoneError("");
    }
  };

  const validateAddress = (value: string) => {
    if (value.trim().length < 20) {
      setAddressError("Địa chỉ phải có ít nhất 20 ký tự.");
    } else {
      setAddressError("");
    }
  };

  if (orderItems.length === 0) return null;

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-orange-600">
          🧾 Xác nhận đơn hàng
        </h1>

        {productInfos.length === 0 ? (
          <p>Đang tải thông tin sản phẩm...</p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {productInfos.map((info, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b pb-4 px-2"
                >
                  <img
                    src={
                      info.product.thumbnail
                        ? `http://localhost:8080${info.product.thumbnail}`
                        : info.product.image
                    }
                    alt={info.product.name}
                    className="w-36 h-24 object-contain  rounded-md border border-orange-300"
                  />

                  <div className="flex-1">
                    <h2 className="text-base md:text-lg font-semibold text-orange-700">
                      {info.product.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Màu:{" "}
                      <span className="font-medium">{info.variant.color}</span>{" "}
                      | Size:{" "}
                      <span className="font-medium">{info.variant.size}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Số lượng: {info.quantity}
                    </p>
                  </div>

                  <div className="text-right text-red-600 font-semibold min-w-[100px]">
                    {(info.product.price * info.quantity).toLocaleString()}₫
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xl font-bold text-right text-red-600 mb-6">
              Tổng thanh toán: {totalAmount.toLocaleString()}₫
            </p>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow p-6 space-y-4 border border-orange-200"
            >
              <label>
                Địa chỉ giao hàng:
                <textarea
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    validateAddress(e.target.value);
                  }}
                  required
                  className="w-full border rounded p-2"
                  rows={3}
                />
                {addressError && (
                  <p className="text-sm text-red-600 mt-1">{addressError}</p>
                )}
              </label>

              <label>
                Số điện thoại:
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    validatePhone(e.target.value);
                  }}
                  required
                  className="w-full border rounded p-2"
                />
                {phoneError && (
                  <p className="text-sm text-red-600 mt-1">{phoneError}</p>
                )}
              </label>

              <label className="block">
                <span className="font-medium text-orange-600">
                  Phương thức thanh toán:
                </span>
                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value as "VNPAY" | "COD")
                  }
                  className="w-full border rounded p-2 mt-1"
                >
                  <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                  <option value="VNPAY">Chuyển khoản ngân hàng (VNPAY)</option>
                </select>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl transition disabled:opacity-50"
              >
                {loading ? "Đang xử lý..." : "🛒 Xác nhận đặt hàng"}
              </button>
            </form>
          </>
        )}
      </div>
      <FooterComponent />
    </>
  );
};

export default OrderPage;
