import React, { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';

interface Transaction {
  id: string;
  customerId: string;
  date: string;
  status: 'Paid' | 'Pending' | 'Failed';
  amount: string;
}

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/transactions.json')
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading transactions:', err);
        setLoading(false);
      });
  }, []);

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

      {loading ? (
        <p className="text-gray-500 text-sm">Loading transactions...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-3 text-sm font-medium text-gray-600">No</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Id Customer</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Order Date</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={transaction.id} className="border-b">
                  <td className="py-3 text-sm">{index + 1}.</td>
                  <td className="py-3 text-sm">{transaction.customerId}</td>
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
