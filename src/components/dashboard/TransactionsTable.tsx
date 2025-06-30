import React, { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { getTransactions } from '../../api/transactions';

interface Transaction {
  id: string;
  customer: string;
  date: string;
  status: string;
  amount: string;
}

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const response = await getTransactions();
      console.log('Fetched transactions:', response); // Debug log
      const mappedTransactions = response.map((transaction: any): Transaction => ({
        id: transaction.paymentId.toString(),
        customer: transaction.customerName,
        date: new Date(transaction.paymentDate).toLocaleDateString('en-GB'),
        status: transaction.paymentStatus,
        amount: `$${transaction.amount.toFixed(2)}`
      }));
      setTransactions(mappedTransactions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  fetchTransactions();
}, []);


const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState('');

const filteredTransactions = transactions.filter((t) => {
  const matchesCustomer = t.customer.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesStatus = statusFilter ? t.status === statusFilter : true;
  return matchesCustomer && matchesStatus;
});



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'text-green-600';
      case 'Pending':
        return 'text-yellow-600';
      case 'Failed':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const getDotColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-500';
      case 'Pending':
        return 'bg-yellow-500';
      case 'Failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">Transaction</h3>
      <button className="flex items-center gap-2 px-3 py-1 border border-gray-200 rounded-lg text-sm">
        <Filter size={16} />
        Filter
      </button>
    </div>

    <div className="flex flex-wrap gap-4 mb-4">
  <input
    type="text"
    placeholder="Tìm theo tên khách hàng..."
    className="border px-3 py-1 rounded-md text-sm"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <select
    className="border px-3 py-1 rounded-md text-sm"
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="">Tất cả trạng thái</option>
    <option value="Paid">Paid</option>
    <option value="Pending">Pending</option>
    <option value="Failed">Failed</option>
  </select>
</div>


    {loading ? (
      <p className="text-gray-500 text-sm">Loading transactions...</p>
    ) : (
      <div className="max-h-[400px] overflow-y-auto border border-gray-200 rounded-md">
        <table className="w-full min-w-[600px]">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="text-left border-b">
              <th className="pb-3 text-sm font-medium text-gray-600">No</th>
              <th className="pb-3 text-sm font-medium text-gray-600">Customer</th>
              <th className="pb-3 text-sm font-medium text-gray-600">Order Date</th>
              <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
              <th className="pb-3 text-sm font-medium text-gray-600">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction, index) => (
              <tr key={transaction.id} className="border-b">
                <td className="py-3 text-sm">{index + 1}.</td>
                <td className="py-3 text-sm">{transaction.customer}</td>
                <td className="py-3 text-sm">{transaction.date}</td>
                <td className="py-3">
                  <span className={`inline-flex items-center gap-1 text-sm ${getStatusColor(transaction.status)}`}>
                    <div className={`w-2 h-2 rounded-full ${getDotColor(transaction.status)}`}></div>
                    {transaction.status}
                  </span>
                </td>
                <td className="py-3 text-sm font-medium">{transaction.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
};

export default TransactionsTable;
