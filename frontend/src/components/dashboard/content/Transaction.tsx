import React, { useEffect, useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { getTransactions } from '../../../api/transactions';


interface Transaction {
  id: string;
  customer: string;
  date: string;
  status: string;
  amount: string;
}



const TransactionContent = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState('');

useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const response = await getTransactions();
      const mappedTransactions = response.map((tx: any): Transaction => ({
        id: tx.paymentId.toString(),
        customer: tx.customerName,
        date: new Date(tx.paymentDate).toLocaleDateString('en-GB'),
        status: tx.paymentStatus,
        amount: `$${tx.amount.toFixed(2)}`
      }));
      setTransactions(mappedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  fetchTransactions();
}, []);

  const filtered = transactions.filter((t) =>
  t.customer.toLowerCase().includes(search.toLowerCase())
);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <button className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search by customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-sm border rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4 font-medium text-gray-600">Transaction ID</th>
              <th className="py-3 px-4 font-medium text-gray-600">Customer</th>
              <th className="py-3 px-4 font-medium text-gray-600">Date</th>
              <th className="py-3 px-4 font-medium text-gray-600">Status</th>
              <th className="py-3 px-4 font-medium text-gray-600">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{tx.id}</td>
                <td className="py-3 px-4">{tx.customer}</td>
                <td className="py-3 px-4">{tx.date}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tx.status === 'paid'|| tx.status === 'Completed'
                        ? 'bg-green-100 text-green-600'
                        : tx.status === 'Pending' || tx.status === 'cannceled'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="py-3 px-4 font-medium">{tx.amount}</td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 px-4 text-center text-gray-400">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionContent;
