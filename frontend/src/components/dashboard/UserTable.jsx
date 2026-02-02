import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

const UserTable = ({ users }) => {
  return (
    <Card className="bg-[#1a1a1a] border-[#2a2a2a] p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-1">Recent Users</h3>
        <p className="text-sm text-gray-400">Latest registered users</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Name</th>
              <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Email</th>
              <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Role</th>
              <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Status</th>
              <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Join Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-[#2a2a2a] hover:bg-[#0a0a0a] transition-colors duration-200"
              >
                <td className="py-3 px-4 text-white">{user.name}</td>
                <td className="py-3 px-4 text-gray-300">{user.email}</td>
                <td className="py-3 px-4">
                  <Badge
                    variant="outline"
                    className={
                      user.role === 'Admin'
                        ? 'border-[#00d9ff] text-[#00d9ff]'
                        : user.role === 'Manager'
                        ? 'border-[#00b8e6] text-[#00b8e6]'
                        : 'border-[#2a2a2a] text-gray-400'
                    }
                  >
                    {user.role}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant="outline"
                    className={
                      user.status === 'Active'
                        ? 'border-green-500 text-green-500'
                        : 'border-red-500 text-red-500'
                    }
                  >
                    {user.status}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-gray-300">{user.joinDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default UserTable;
