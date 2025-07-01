import { useEffect, useState } from "react";
import { getUserOrders } from "../../api/order";
import { OrderDetailDto } from "../../types/Order.type";
import { formatCurrency } from "../../utils/format.util";
import Header from "../../components/commom/Header/Header";
import { cancelOrder } from "../../api/order";
const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipping: "Shipping",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const ORDER_STATUS_ICONS: Record<string, string> = {
  pending: "⏳",
  confirmed: "🔁",
  shipping: "🚚",
  delivered: "✅",
  cancelled: "❌",
};

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-blue-100 text-blue-700 border-blue-200",
  confirmed: "bg-yellow-100 text-yellow-700 border-yellow-200",
  shipping: "bg-purple-100 text-purple-700 border-purple-200",
  delivered: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

type GroupedOrder = {
  id: number;
  customerName: string;
  orderDate: string;
  orderStatus: string;
  totalAmount: number;
  products: {
    productName: string;
    productVariantId: number;
    quantity: number;
    unitPrice: number;
    thumbnail?: string;
  }[];
};

const UserOrdersPage = () => {
  const [groupedOrders, setGroupedOrders] = useState<GroupedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getUserOrders();
        const rawOrders: OrderDetailDto[] = res.data;

        const grouped = rawOrders.reduce(
          (acc: Record<number, GroupedOrder>, item) => {
            if (!acc[item.id]) {
              acc[item.id] = {
                id: item.id,
                customerName: item.customerName,
                orderDate: item.orderDate,
                orderStatus: item.orderStatus,
                products: [],
                totalAmount: item.totalAmount || 0,
              };
            }

            acc[item.id].products.push({
              productName: item.productName,
              productVariantId: item.productVariantId,
              quantity: item.quantity || 0,
              unitPrice: item.unitPrice || 0,
              thumbnail: (item as any).productThumbnail,
            });

            return acc;
          },
          {}
        );

        setGroupedOrders(Object.values(grouped));
      } catch (err) {
        console.error("Lỗi khi tải đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  const handleAskCancelOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
    setCancelError(null);
  };
  const handleConfirmCancelOrder = async () => {
    if (!selectedOrderId) return;
    setCancelling(true);
    setCancelError(null);
    try {
      await cancelOrder(selectedOrderId);
      setGroupedOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrderId
            ? { ...order, orderStatus: "cancelled" }
            : order
        )
      );
      setShowCancelModal(false);
      setSelectedOrderId(null);
    } catch (error) {
      setCancelError("Không thể hủy đơn hàng. Vui lòng thử lại!");
    }
    setCancelling(false);
  };

  const filteredOrders = groupedOrders.filter((order) => {
    if (filter === "all") return true;
    return order.orderStatus.toLowerCase() === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <Header />
        <div className="flex justify-center items-center h-[80vh]">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">
              Đang tải đơn hàng...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (groupedOrders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <Header />
        <div className="flex justify-center items-center h-[80vh]">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
            <div className="text-6xl mb-6">🛍️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Chưa có đơn hàng
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
              <span className="text-5xl">🛍️</span>
              Lịch sử đơn hàng
            </h1>
            <p className="text-gray-600 text-lg">
              Quản lý và theo dõi các đơn hàng của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tổng đơn hàng</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {groupedOrders.length}
                  </p>
                </div>
                <div className="text-3xl">📊</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Hoàn thành</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {
                      groupedOrders.filter(
                        (o) => o.orderStatus.toLowerCase() === "delivered"
                      ).length
                    }
                  </p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Đang xử lý</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {
                      groupedOrders.filter(
                        (o) =>
                          o.orderStatus.toLowerCase() === "pending" ||
                          o.orderStatus.toLowerCase() === "confirmed" ||
                          o.orderStatus.toLowerCase() === "shipping"
                      ).length
                    }
                  </p>
                </div>
                <div className="text-3xl">⏳</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tổng giá trị</p>
                  <p className="text-xl font-bold text-gray-800">
                    {formatCurrency(
                      groupedOrders.reduce(
                        (sum, order) => sum + order.totalAmount,
                        0
                      )
                    )}
                  </p>
                </div>
                <div className="text-3xl">💰</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <div className="flex flex-wrap gap-2">
              {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    filter === key
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span>{ORDER_STATUS_ICONS[key]}</span>
                  {label}
                </button>
              ))}
              <button
                onClick={() => setFilter("all")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  filter === "all"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>📦</span>
                Tất cả
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-6 text-white">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 rounded-full p-2">
                        <span className="text-2xl">🧾</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">
                          Đơn hàng #{order.id}
                        </h3>
                        <p className="text-orange-100">
                          Ngày đặt:{" "}
                          {new Date(order.orderDate).toLocaleDateString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col lg:items-end gap-2">
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${
                          ORDER_STATUS_COLORS[order.orderStatus]
                        }`}
                      >
                        <span>{ORDER_STATUS_ICONS[order.orderStatus]}</span>
                        <span className="font-semibold">
                          {ORDER_STATUS_LABELS[order.orderStatus]}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-orange-100 text-sm">Tổng tiền</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(order.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-gray-600">
                      <span className="font-semibold">Khách hàng:</span>{" "}
                      {order.customerName}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="text-xl">📦</span>
                      Sản phẩm ({order.products.length} món)
                    </h4>
                    <div className="grid gap-4">
                      {order.products.map((product, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors duration-300"
                        >
                          <div className="flex-shrink-0">
                            {product.thumbnail ? (
                              <img
                                src={`http://localhost:8080${product.thumbnail}`}
                                alt={product.productName}
                                className="w-16 h-16 rounded-xl object-cover shadow-md"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-md">
                                <span className="text-gray-400 text-2xl">
                                  📷
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-grow">
                            <h5 className="font-semibold text-gray-800 mb-1">
                              {product.productName}
                            </h5>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="bg-white px-2 py-1 rounded-lg">
                                Mã SP: #{product.productVariantId}
                              </span>
                              <span className="bg-white px-2 py-1 rounded-lg">
                                Số lượng: {product.quantity}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-orange-600">
                              {formatCurrency(product.unitPrice)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Tổng:{" "}
                              {formatCurrency(
                                product.unitPrice * product.quantity
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {order.orderStatus === "pending" && (
                  <div className="px-6 pb-6">
                    <button
                      onClick={() => handleAskCancelOrder(order.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2"
                    >
                      <span>❌</span> Hủy đơn hàng
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredOrders.length === 0 && filter !== "all" && (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Không tìm thấy đơn hàng
              </h3>
              <p className="text-gray-600 mb-6">
                Không có đơn hàng nào phù hợp với bộ lọc "{filter}"
              </p>
              <button
                onClick={() => setFilter("all")}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Xem tất cả đơn hàng
              </button>
            </div>
          )}
        </div>
      </div>
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full text-center">
            <div className="text-5xl mb-4 text-red-500">❌</div>
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              Xác nhận hủy đơn hàng
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn hủy đơn hàng #{selectedOrderId} không? Hành
              động này không thể hoàn tác.
            </p>
            {cancelError && <p className="text-red-500 mb-4">{cancelError}</p>}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmCancelOrder}
                className={`bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-xl transition-all duration-300 ${
                  cancelling ? "opacity-60 cursor-not-allowed" : ""
                }`}
                disabled={cancelling}
              >
                {cancelling ? "Đang hủy..." : "Đồng ý hủy"}
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-5 py-2 rounded-xl transition-all duration-300"
                disabled={cancelling}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrdersPage;
