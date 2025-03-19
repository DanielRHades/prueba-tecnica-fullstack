import { gql, useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
}

const AllUsersQuery = gql`
  query Users {
      users {
          id
          name
          email
          phone
      }
  }
`;

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: Int!, $name: String, $role: Role) {
      updateUser(id: $id, name: $name, role: $role) {
          id
          name
          email
          phone
      }
  }
`;

export default function Users() {
    const { data, error, loading, refetch } = useQuery(AllUsersQuery);
    const [updateUser] = useMutation(UPDATE_USER_MUTATION);
    const [editUserId, setEditUserId] = useState<number | null>(null);
    const [editName, setEditName] = useState<string>('');
    const [editRole, setEditRole] = useState<'ADMIN' | 'USER' | ''>('');

    const handleEdit = (user: User) => {
        setEditUserId(user.id);
        setEditName(user.name);
    };

    const handleSave = async (id: number) => {
        try {
            await updateUser({
                variables: {
                    id: id,
                    name: editName,
                    role: editRole,
                },
            });
            setEditUserId(null);
            refetch();
        } catch (err) {
            console.error('Error updating user:', err);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return <p className="text-red-500">Oops, something went wrong: {error.message}</p>;

    return (
        <DashboardLayout>
            <div className="p-4 max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-slate-800">Users</h1>
                {data && data.users && data.users.length > 0 ? (
                    <div className="rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {data.users.map((user: User) => (
                                    <tr key={user.id} className="hover:bg-slate-50">
                                        {editUserId === user.id ? (
                                            <>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                                    <input
                                                        type="text"
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{user.phone || 'N/A'}</td>
                                                <td className="px-6 py-4 text-sm text-slate-900">
                                                    <select
                                                        value={editRole}
                                                        onChange={(e) => setEditRole(e.target.value as 'ADMIN' | 'USER')}
                                                    >
                                                        <option value="ADMIN">ADMIN</option>
                                                        <option value="USER">USER</option>
                                                    </select>
                                                    <button onClick={() => handleSave(user.id)}>Save</button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{user.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{user.phone || 'N/A'}</td>
                                                <td className="px-6 py-4 text-sm text-slate-900">
                                                    <button onClick={() => handleEdit(user)}>Edit</button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-slate-600">No users found.</p>
                )}
            </div>
        </DashboardLayout>
    );
}