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

    if (error) return <p className="text-red-500">Oops, algo salio mal: {error.message}</p>;

    return (
        <DashboardLayout pageTitle="Sistema de gestión de Ingresos y Gastos">
            <div className="p-4 max-w-7xl mx-auto">
                <h2 className="text-2xl underline font-bold mb-6 mt-8 text-black">Gestión de Usuarios</h2>
                {data && data.users && data.users.length > 0 ? (
                    <div className="rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-zinc-400">
                                <tr>
                                    <th className="px-6 py-3 text-left text-base font-bold text-black uppercase tracking-wider">Nombre</th>
                                    <th className="px-6 py-3 text-left text-base font-bold text-black uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-base font-bold text-black uppercase tracking-wider">Telefono</th>
                                    <th className="px-6 py-3 text-left text-base font-bold text-black uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-zinc-400">
                                {data.users.map((user: User) => (
                                    <tr key={user.id}>
                                        {editUserId === user.id ? (
                                            <>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                                    <input
                                                        type="text"
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        className="bg-zinc-300 text-black"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{user.phone || 'N/A'}</td>
                                                <td className="px-6 py-4 text-sm text-black">
                                                    <select
                                                        value={editRole}
                                                        onChange={(e) => setEditRole(e.target.value as 'ADMIN' | 'USER')}
                                                        className="bg-zinc-300 text-black"
                                                    >
                                                        <option value="ADMIN">ADMIN</option>
                                                        <option value="USER">USER</option>
                                                    </select>
                                                    <button onClick={() => handleSave(user.id)} className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Guardar</button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{user.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{user.phone || 'N/A'}</td>
                                                <td className="px-6 py-4 text-sm text-black">
                                                    <button onClick={() => handleEdit(user)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Editar</button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-slate-600">No se encontraron Usuarios.</p>
                )}
            </div>
        </DashboardLayout>
    );
}