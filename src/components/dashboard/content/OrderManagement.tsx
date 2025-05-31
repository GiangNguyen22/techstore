import React, { useEffect, useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { getOrders } from '../../../api/orders'; // Cập nhật đúng đường dẫn nếu cần

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
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.orderStatus === 'paid'
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
    </div>
  );
};

export default OrderContent;
