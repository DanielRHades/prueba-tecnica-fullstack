import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { GET_USERS } from '@/graphql/queries';
import { UPDATE_USER } from '@/graphql/mutations';
import withAuth from '@/components/withAuth';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: 'ADMIN' | 'USER';
}

interface EditModalProps {
    user: User | null;
    onClose: () => void;
    onSave: (id: string, name: string, role: 'ADMIN' | 'USER') => void;
}

function EditModal({ user, onClose, onSave }: EditModalProps) {
    const [name, setName] = useState(user?.name || '');
    const [role, setRole] = useState<'ADMIN' | 'USER'>(user?.role || 'USER');

    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-zinc-400 p-6 rounded-lg shadow-xl w-96">
                <h3 className="text-lg font-bold mb-4 text-black">Editar Usuario</h3>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-black">Nombre</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-zinc-300 text-black"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-black">Rol</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as 'ADMIN' | 'USER')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-zinc-300 text-black"
                    >
                        <option value="USER">Usuario</option>
                        <option value="ADMIN">Administrador</option>
                    </select>
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-black bg-zinc-300 rounded-md hover:bg-zinc-500"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onSave(user.id, name, role)}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}

function Users() {
    const { data, error, loading, refetch } = useQuery(GET_USERS);
    const [updateUser] = useMutation(UPDATE_USER);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleEdit = (user: User) => {
        setEditingUser(user);
    };

    const handleSave = async (id: string, name: string, role: 'ADMIN' | 'USER') => {
        try {
            await updateUser({
                variables: {
                    id,
                    name,
                    role,
                },
            });
            setEditingUser(null);
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
        <DashboardLayout pageTitle="Sistema de gestión de Ingresos y Gastos" currentPathname="/users">
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{user.phone || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm text-black">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="bg-zinc-300 hover:bg-zinc-500 text-black font-bold py-2 px-4 rounded"
                                            >
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-slate-600">No se encontraron Usuarios.</p>
                )}
            </div>

            {editingUser && (
                <EditModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={handleSave}
                />
            )}
        </DashboardLayout>
    );
}

export default withAuth(Users);