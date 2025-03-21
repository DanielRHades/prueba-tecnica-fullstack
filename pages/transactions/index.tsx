import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { GET_TRANSACTIONS, GET_USERS } from '@/graphql/queries';
import { CREATE_TRANSACTION } from '@/graphql/mutations';
import withAuth from '@/components/withAuth';

interface Transaction {
    id: string;
    amount: number;
    concept: string;
    type: TransactionType;
    date: string;
    userId: string;
}

interface User {
    id: string;
    name: string;
}

enum TransactionType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE'
}

interface CreateModalProps {
    onClose: () => void;
    onSave: (amount: number, concept: string, type: TransactionType, date: string, userId: string) => void;
    users: User[];
}

function CreateModal({ onClose, onSave, users }: CreateModalProps) {
    const [amount, setAmount] = useState<string>('');
    const [concept, setConcept] = useState<string>('');
    const [type, setType] = useState<TransactionType>(TransactionType.INCOME);
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [userId, setUserId] = useState<string>(users[0]?.id || '');
    const [error, setError] = useState<string>('');

    const handleSubmit = () => {
        // Validaciones
        if (!amount || parseFloat(amount) <= 0) {
            setError('El monto debe ser mayor a 0');
            return;
        }
        if (!concept.trim()) {
            setError('El concepto es requerido');
            return;
        }
        if (!userId) {
            setError('Debe seleccionar un usuario');
            return;
        }

        onSave(
            parseFloat(amount),
            concept.trim(),
            type,
            date,
            userId
        );

        setAmount('');
        setConcept('');
        setType(TransactionType.INCOME);
        setDate(new Date().toISOString().split('T')[0]);
        setUserId(users[0]?.id || '');
        setError('');
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-zinc-400 p-6 rounded-lg shadow-xl w-96">
                <h3 className="text-lg font-bold mb-4 text-black">Nueva Transacción</h3>
                {error && (
                    <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-black">Monto</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-zinc-300 text-black"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-black">Concepto</label>
                    <input
                        type="text"
                        value={concept}
                        onChange={(e) => setConcept(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-zinc-300 text-black"
                        placeholder="Descripción de la transacción"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-black">Tipo</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as TransactionType)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-zinc-300 text-black"
                    >
                        <option value={TransactionType.INCOME}>Ingreso</option>
                        <option value={TransactionType.EXPENSE}>Gasto</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-black">Fecha</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-zinc-300 text-black"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-black">Usuario</label>
                    <select
                        value={userId}
                        onChange={(e) => setUserId(String(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-zinc-300 text-black"
                    >
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
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
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Crear
                    </button>
                </div>
            </div>
        </div>
    );
}

function Transactions() {
    const { data: transactionsData, error: transactionsError, loading: transactionsLoading, refetch: refetchTransactions } = useQuery(GET_TRANSACTIONS);
    const { data: usersData, error: usersError, loading: usersLoading } = useQuery(GET_USERS);
    const [createTransaction] = useMutation(CREATE_TRANSACTION);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleCreate = async (amount: number, concept: string, type: TransactionType, date: string, userId: string) => {
        try {
            await createTransaction({
                variables: {
                    amount,
                    concept,
                    type,
                    date,
                    userId,
                },
            });
            setShowCreateModal(false);
            refetchTransactions();
        } catch (err) {
            console.error('Error creating transaction:', err);
        }
    };

    const calculateTotal = (transactions: Transaction[]) => {
        return transactions.reduce((total, transaction) => {
            return total + (transaction.type === TransactionType.INCOME ? transaction.amount : -transaction.amount);
        }, 0);
    };

    if (transactionsLoading || usersLoading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (transactionsError) return <p className="text-red-500">Error al cargar transacciones: {transactionsError.message}</p>;
    if (usersError) return <p className="text-red-500">Error al cargar usuarios: {usersError.message}</p>;

    const total = transactionsData?.transactions ? calculateTotal(transactionsData.transactions) : 0;

    return (
        <DashboardLayout pageTitle="Sistema de gestión de Ingresos y Gastos" currentPathname="/transactions">
            <div className="p-4 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6 mt-8">
                    <h2 className="text-2xl underline font-bold text-black">Gestión de Transacciones</h2>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-zinc-400 hover:bg-zinc-600 text-black font-bold py-2 px-4 rounded"
                    >
                        Nueva Transacción
                    </button>
                </div>
                {transactionsData && transactionsData.transactions && transactionsData.transactions.length > 0 ? (
                    <>
                        <div className="rounded-lg shadow-md overflow-hidden">
                            <table className="min-w-full">
                                <thead className="bg-zinc-400">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-base font-bold text-black uppercase tracking-wider">Monto</th>
                                        <th className="px-6 py-3 text-left text-base font-bold text-black uppercase tracking-wider">Concepto</th>
                                        <th className="px-6 py-3 text-left text-base font-bold text-black uppercase tracking-wider">Tipo</th>
                                        <th className="px-6 py-3 text-left text-base font-bold text-black uppercase tracking-wider">Fecha</th>
                                        <th className="px-6 py-3 text-left text-base font-bold text-black uppercase tracking-wider">Usuario</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-zinc-400">
                                    {transactionsData.transactions.map((transaction: Transaction) => (
                                        <tr key={transaction.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                                {transaction.type === TransactionType.INCOME ? '+' : '-'}${transaction.amount.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{transaction.concept}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                                {transaction.type === TransactionType.INCOME ? 'Ingreso' : 'Gasto'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                                {usersData?.users?.find((user: User) => user.id === transaction.userId)?.name || 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 p-4 bg-zinc-400 rounded-lg shadow-md">
                            <p className="text-lg font-bold text-black">
                                Total: ${total >= 0 ? '+' : ''}{total.toFixed(2)} COP
                            </p>
                        </div>
                    </>
                ) : (
                    <p className="text-slate-600">No se encontraron transacciones.</p>
                )}
            </div>

            {showCreateModal && usersData?.users && (
                <CreateModal
                    onClose={() => setShowCreateModal(false)}
                    onSave={handleCreate}
                    users={usersData.users}
                />
            )}
        </DashboardLayout>
    );
}

export default withAuth(Transactions);