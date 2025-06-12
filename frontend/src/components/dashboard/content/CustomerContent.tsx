import React, { useEffect, useState } from 'react';
import { Search, UserPlus, X, Edit, Save } from 'lucide-react';
import { getUsers } from '../../../api/users';
import { updateStatus } from '../../../api/users'; // Cập nhật đúng đường dẫn nếu cần

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  joined: string; // createdAt
}

const CustomerContent = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getUsers();

        // map lại từ API sang đúng interface
        const mapped = data.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          status: user.status,
          joined: user.createdAt,
        }));

        setCustomers(mapped);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleRowClick = (customer: Customer) => {
    // Lấy thông tin user từ data đã có trong state customers
    const userDetail = customers.find(c => c.id === customer.id);

    if (userDetail) {
      setSelectedCustomer(userDetail);
      setEditedStatus(userDetail.status);
      setIsEditing(false);
    }
  };

  const handleClosePopup = () => {
    setSelectedCustomer(null);
    setIsEditing(false);
    setEditedStatus('');
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (selectedCustomer) {
      try {



        const newStatus = (editedStatus === 'Active'); console.log(newStatus);
        await updateStatus(parseInt(selectedCustomer.id), newStatus);



        // Cập nhật state local
        const updatedCustomers = customers.map(customer =>
          customer.id === selectedCustomer.id
            ? { ...customer, status: editedStatus }
            : customer
        );
        setCustomers(updatedCustomers);

        // Cập nhật selected customer
        setSelectedCustomer({ ...selectedCustomer, status: editedStatus });
        setIsEditing(false);

        // Hiển thị thông báo thành công
        alert(`Status updated successfully to ${editedStatus}!`);

      } catch (error) {
        console.error('Error updating customer status:', error);
        alert('Failed to update status. Please try again.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditedStatus(selectedCustomer?.status || '');
    setIsEditing(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Customers</h2>
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600">
          <UserPlus size={16} />
          Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-sm border rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4 font-medium text-gray-600">ID</th>
              <th className="py-3 px-4 font-medium text-gray-600">Name</th>
              <th className="py-3 px-4 font-medium text-gray-600">Email</th>
              <th className="py-3 px-4 font-medium text-gray-600">Phone</th>
              <th className="py-3 px-4 font-medium text-gray-600">Status</th>
              <th className="py-3 px-4 font-medium text-gray-600">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer, index) => (
              <tr
                key={index}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(customer)}
              >
                <td className="py-3 px-4">{customer.id}</td>
                <td className="py-3 px-4">{customer.name}</td>
                <td className="py-3 px-4">{customer.email}</td>
                <td className="py-3 px-4">{customer.phone}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${customer.status === 'Active'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-200 text-gray-500'
                      }`}
                  >
                    {customer.status}
                  </span>
                </td>
                <td className="py-3 px-4">{customer.joined}</td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 px-4 text-center text-gray-400">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Popup Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">Customer Details</h3>
              <button
                onClick={handleClosePopup}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID
                </label>
                <div className="text-sm text-gray-900">{selectedCustomer.id}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <div className="text-sm text-gray-900">{selectedCustomer.name}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="text-sm text-gray-900">{selectedCustomer.email}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <div className="text-sm text-gray-900">{selectedCustomer.phone}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                {isEditing ? (
                  <select
                    value={editedStatus}
                    onChange={(e) => setEditedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    {/* <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option> */}
                  </select>
                ) : (
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${selectedCustomer.status === 'Active'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-200 text-gray-500'
                      }`}
                  >
                    {selectedCustomer.status}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Joined
                </label>
                <div className="text-sm text-gray-900">{selectedCustomer.joined}</div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 p-6 border-t">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveClick}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    <Save size={16} />
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditClick}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <Edit size={16} />
                  Edit Status
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerContent;