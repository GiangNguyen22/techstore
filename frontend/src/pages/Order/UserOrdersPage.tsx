import { useEffect, useState } from "react";
import { getUserOrders } from "../../api/order";
import { OrderDetailDto } from "../../types/Order.type";
import { formatCurrency } from "../../utils/format.util";
import Header from "../../components/commom/Header/Header";

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

  if (loading)
    return (
      <>
        <Header />
        <p className="text-center text-orange-400 mt-12 text-lg">
          Đang tải đơn hàng...
        </p>
      </>
    );
  if (groupedOrders.length === 0)
    return (
      <>
        <Header />
        <p className="text-center text-gray-500 mt-12 text-lg">
          Bạn chưa có đơn hàng nào.
        </p>
      </>
    );

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-orange-500 border-b border-orange-300 pb-3">
          Đơn hàng của bạn
        </h1>
        <div className="space-y-6">
          {groupedOrders.map((order) => (
            <div
              key={order.id}
              className="border border-orange-300 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow bg-white"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <p className="font-semibold text-orange-600">
                  Mã đơn hàng: <span className="font-normal">{order.id}</span>
                </p>
                <p className="text-gray-600">
                  Ngày đặt:{" "}
                  <span className="font-medium">
                    {new Date(order.orderDate).toLocaleString()}
                  </span>
                </p>
              </div>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <p className="text-gray-700">
                  Khách hàng:{" "}
                  <span className="font-medium">{order.customerName}</span>
                </p>
                <p
                  className={`font-semibold px-3 py-1 rounded-full w-max
                    ${
                      order.orderStatus.toLowerCase().includes("đã huỷ") ||
                      order.orderStatus.toLowerCase().includes("cancelled")
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                    }
                  `}
                >
                  {order.orderStatus}
                </p>
              </div>

              <p className="font-bold text-orange-600 mb-4 text-lg">
                Tổng tiền: {formatCurrency(order.totalAmount)}
              </p>

              <div>
                <p className="font-semibold mb-2 text-orange-500">Sản phẩm:</p>
                <ul className="space-y-3">
                  {order.products.map((p, idx) => (
                    <li
                      key={idx}
                      className="flex items-center space-x-4 border rounded-md p-2 hover:bg-orange-50 transition"
                    >
                      {p.thumbnail ? (
                        <img
                          src={
                            p.thumbnail
                              ? "http://localhost:8080" + p.thumbnail
                              : "No image"
                          }
                          alt={p.productName}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}

                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">
                          {p.productName}
                        </span>
                        <span className="text-sm text-gray-600">
                          Biến thể #{p.productVariantId} &times; {p.quantity}
                        </span>
                      </div>
                      <div className="ml-auto font-semibold text-orange-600">
                        {formatCurrency(p.unitPrice)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserOrdersPage;
