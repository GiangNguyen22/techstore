import React, { useEffect, useState } from 'react';
import { Search, ShieldCheck, Plus } from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Manager' | 'Editor';
  status: 'Active' | 'Suspended';
}

const AdminRole = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Fake admin data
    setAdmins([
      {
        id: 'A001',
        name: 'Nguyen Van A',
        email: 'adminA@dealport.com',
        role: 'Super Admin',
        status: 'Active',
      },
      {
        id: 'A002',
        name: 'Tran Thi B',
        email: 'managerB@dealport.com',
        role: 'Manager',
        status: 'Suspended',
      },
      {
        id: 'A003',
        name: 'Le Van C',
        email: 'editorC@dealport.com',
        role: 'Editor',
        status: 'Active',
      },
    ]);
  }, []);

  const filteredAdmins = admins.filter((admin) =>
    admin.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Roles</h2>
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600">
          <Plus size={16} />
          Add Admin
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-4">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={16}
        />
        <input
          type="text"
          placeholder="Search admin by name"
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
              <th className="py-3 px-4 font-medium text-gray-600">ID</th>
              <th className="py-3 px-4 font-medium text-gray-600">Name</th>
              <th className="py-3 px-4 font-medium text-gray-600">Email</th>
              <th className="py-3 px-4 font-medium text-gray-600">Role</th>
              <th className="py-3 px-4 font-medium text-gray-600">Status</th>
              <th className="py-3 px-4 font-medium text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map((admin, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{admin.id}</td>
                <td className="py-3 px-4">{admin.name}</td>
                <td className="py-3 px-4">{admin.email}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-700">
                    <ShieldCheck size={14} />
                    {admin.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      admin.status === 'Active'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {admin.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="text-blue-500 text-sm hover:underline">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {filteredAdmins.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 px-4 text-center text-gray-400">
                  No admin users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRole;
