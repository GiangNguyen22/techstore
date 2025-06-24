import React, { useEffect, useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { getOrders, getOrdersbyId } from '../../../api/orders'; // Cập nhật đúng đường dẫn nếu cần

interface Order {
  id: number;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  productName: string;
  productVariantId: number;
  quantity: number;
  unitPrice: number;
  orderStatus: string;
}

const OrderContent = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        const mapped = response.map((order: any): Order => ({
          id: order.id,
          customerName: order.customerName,
          orderDate: new Date(order.orderDate).toLocaleDateString('en-GB'), // định dạng ngày dd/mm/yyyy
          totalAmount: order.totalAmount,
          productName: order.productName,
          productVariantId: order.productVariantId,
          quantity: order.quantity,
          unitPrice: order.unitPrice,
          orderStatus: order.orderStatus,
        }));
        setOrders(mapped);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) =>
    o.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [ordersbyId, setOrdersById] = useState<any>(null);
  const [loadingOrderId, setLoadingOrderId] = useState(false);

  const [showOrderModal, setShowOrderModal] = useState(false);


  const handleOrdersbyId = async (OrderId: number) => {
    setSelectedOrderId(OrderId);
    setLoadingOrderId(true);
    try {
      const data = await getOrdersbyId(OrderId);
      console.log("Fetched order by ID:", data);
      setOrdersById(data);
      setShowOrderModal(true); // 👉 mở modal sau khi lấy dữ liệu
    } catch (err) {
      alert("Lỗi khi tải sản phẩm");
      setOrdersById(null);
    } finally {
      setLoadingOrderId(false);
    }
  };








  //   const handleViewDetail = (id:number) => {
  //   // Ví dụ đơn giản: alert thông tin
  //   alert(
  //     `Order #${order.id}\nCustomer: ${order.customerName}\nAmount: $${order.totalAmount}\nStatus: ${order.orderStatus}`
  //   );

  //   // Hoặc mở modal / chuyển route: navigate(`/orders/${order.id}`)
  // };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <button className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search by customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Order Table */}
      <div className="overflow-x-auto bg-white shadow-sm border rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4 font-medium text-gray-600">Order ID</th>
              <th className="py-3 px-4 font-medium text-gray-600">Customer</th>
              <th className="py-3 px-4 font-medium text-gray-600">Date</th>
              <th className="py-3 px-4 font-medium text-gray-600">Status</th>
              <th className="py-3 px-4 font-medium text-gray-600">Amount</th>
              <th className="py-3 px-4 font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{order.id}</td>
                <td className="py-3 px-4">{order.customerName}</td>
                <td className="py-3 px-4">{order.orderDate}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${order.orderStatus === 'paid'
                      ? 'bg-green-100 text-green-600'
                      : order.orderStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600'
                      }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="py-3 px-4 font-medium">${order.totalAmount}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleOrdersbyId(order.id)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 px-4 text-center text-gray-400">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
{showOrderModal && ordersbyId && (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 ease-in-out animate-fadeIn">
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative border border-gray-200 transform transition-all duration-300 ease-out animate-slideUp max-h-[90vh] overflow-y-auto">
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold transition-all duration-200 hover:scale-110"
        onClick={() => setShowOrderModal(false)}
      >
        &times;
      </button>
      
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Chi tiết đơn hàng #{ordersbyId.id}</h2>
        <p className="text-sm text-gray-500 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-8 0h10m-10 0v12a2 2 0 002 2h8a2 2 0 002-2V7m-10 0V7" />
          </svg>
          Ngày đặt: {new Date(ordersbyId.orderDate).toLocaleString()}
        </p>
      </div>
      
      {/* Order Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
          <p className="text-sm text-blue-600 font-medium">Phương thức thanh toán</p>
          <p className="text-lg font-semibold text-blue-800">{ordersbyId.paymentMethod}</p>
        </div>
        
        <div className={`p-4 rounded-lg border-l-4 ${
          ordersbyId.status === 'Completed' ? 'bg-green-50 border-green-400' :
          ordersbyId.status === 'Pending' ? 'bg-yellow-50 border-yellow-400' :
          ordersbyId.status === 'Cancelled' ? 'bg-red-50 border-red-400' :
          'bg-gray-50 border-gray-400'
        }`}>
          <p className={`text-sm font-medium ${
            ordersbyId.status === 'Completed' ? 'text-green-600' :
            ordersbyId.status === 'Pending' ? 'text-yellow-600' :
            ordersbyId.status === 'Cancelled' ? 'text-red-600' :
            'text-gray-600'
          }`}>Trạng thái</p>
          <p className={`text-lg font-semibold ${
            ordersbyId.status === 'Completed' ? 'text-green-800' :
            ordersbyId.status === 'Pending' ? 'text-yellow-800' :
            ordersbyId.status === 'Cancelled' ? 'text-red-800' :
            'text-gray-800'
          }`}>{ordersbyId.status}</p>
        </div>
        
        <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-400">
          <p className="text-sm text-emerald-600 font-medium">Tổng tiền</p>
          <p className="text-2xl font-bold text-emerald-800">${ordersbyId.totalAmount.toFixed(2)}</p>
        </div>
        
        {ordersbyId.address && (
          <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
            <p className="text-sm text-purple-600 font-medium">Địa chỉ giao hàng</p>
            <p className="text-lg font-semibold text-purple-800">{ordersbyId.address}</p>
          </div>
        )}
      </div>
      
      {/* Products Section */}
      <div className="mt-8">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-xl font-bold text-gray-800">Danh sách sản phẩm</h3>
          <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {ordersbyId.orderDetailsList.length} sản phẩm
          </span>
        </div>
        
        <div className="border rounded-xl overflow-hidden shadow-sm bg-gray-50">
          <table className="w-full text-sm text-left">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-bold">
              <tr>
                <th className="px-6 py-4 text-center">Mã SP</th>
                <th className="px-6 py-4 text-center">Số lượng</th>
                <th className="px-6 py-4 text-center">Đơn giá</th>
                <th className="px-6 py-4 text-center">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {ordersbyId.orderDetailsList.map((item: { id: number; quantity: number; unitPrice: number }, index:number) => (
                <tr key={item.id} className={`hover:bg-blue-50 transition-colors duration-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}>
                  <td className="px-6 py-4 text-center font-mono text-blue-600 font-semibold">
                    #{item.id}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-green-600">
                    ${item.unitPrice}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-green-700">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Summary */}
        <div className="mt-4 bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-700">Tổng cộng:</span>
            <span className="text-2xl font-bold text-emerald-600">${ordersbyId.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-8 flex justify-end space-x-3">
        <button
          onClick={() => setShowOrderModal(false)}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
        >
          Đóng
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg">
          In đơn hàng
        </button>
      </div>
    </div>
  </div>
)}

    </div>

  );
};

export default OrderContent;
