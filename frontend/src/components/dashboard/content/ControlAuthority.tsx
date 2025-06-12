import React, { useEffect, useState } from 'react';

interface Permission {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}

interface AdminPermission {
  id: string;
  name: string;
  role: string;
  permissions: Permission;
}

const ControlAuthority = () => {
  const [adminPermissions, setAdminPermissions] = useState<AdminPermission[]>([]);

  useEffect(() => {
    // Fake data (có thể fetch từ API sau này)
    setAdminPermissions([
      {
        id: 'A001',
        name: 'Nguyen Van A',
        role: 'Super Admin',
        permissions: {
          view: true,
          add: true,
          edit: true,
          delete: true,
        },
      },
      {
        id: 'A002',
        name: 'Tran Thi B',
        role: 'Manager',
        permissions: {
          view: true,
          add: true,
          edit: false,
          delete: false,
        },
      },
      {
        id: 'A003',
        name: 'Le Van C',
        role: 'Editor',
        permissions: {
          view: true,
          add: false,
          edit: true,
          delete: false,
        },
      },
    ]);
  }, []);

  const togglePermission = (adminId: string, permissionType: keyof Permission) => {
    setAdminPermissions((prev) =>
      prev.map((admin) =>
        admin.id === adminId
          ? {
              ...admin,
              permissions: {
                ...admin.permissions,
                [permissionType]: !admin.permissions[permissionType],
              },
            }
          : admin
      )
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Control Authority</h2>

      <div className="overflow-x-auto bg-white shadow-sm border rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4 font-medium text-gray-600">Admin</th>
              <th className="py-3 px-4 font-medium text-gray-600">Role</th>
              <th className="py-3 px-4 font-medium text-gray-600 text-center">View</th>
              <th className="py-3 px-4 font-medium text-gray-600 text-center">Add</th>
              <th className="py-3 px-4 font-medium text-gray-600 text-center">Edit</th>
              <th className="py-3 px-4 font-medium text-gray-600 text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {adminPermissions.map((admin) => (
              <tr key={admin.id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{admin.name}</td>
                <td className="py-3 px-4 text-gray-500">{admin.role}</td>
                {(['view', 'add', 'edit', 'delete'] as (keyof Permission)[]).map((perm) => (
                  <td key={perm} className="py-3 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={admin.permissions[perm]}
                      onChange={() => togglePermission(admin.id, perm)}
                      className="accent-green-500 w-4 h-4"
                    />
                  </td>
                ))}
              </tr>
            ))}

            {adminPermissions.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 px-4 text-center text-gray-400">
                  No admin permission data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ControlAuthority;
