import { useQuery } from '@apollo/client';
import { TrendingUp, TrendingDown, Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import DashboardLayout from '@/components/DashboardLayout';
import { GET_TRANSACTIONS } from '@/graphql/queries';

interface Transaction {
    id: string;
    amount: number;
    concept: string;
    type: 'INCOME' | 'EXPENSE';
    date: string;
    userId: string;
}

function processTransactionsForChart(transactions: Transaction[]) {

    const monthlyData = transactions.reduce((acc: { [key: string]: number }, transaction) => {
        const date = new Date(transaction.date);
        const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
        const amount = transaction.type === 'INCOME' ? transaction.amount : -transaction.amount;

        acc[monthYear] = (acc[monthYear] || 0) + amount;
        return acc;
    }, {});

    return Object.entries(monthlyData).map(([month, amount]) => ({
        month,
        amount
    }));
}

function calculateTotal(transactions: Transaction[]) {
    return transactions.reduce((total, transaction) => {
        return total + (transaction.type === 'INCOME' ? transaction.amount : -transaction.amount);
    }, 0);
}

function downloadCSV(transactions: Transaction[]) {
    const headers = ['Fecha', 'Concepto', 'Tipo', 'Monto', 'Usuario'];
    const csvData = transactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.concept,
        t.type === 'INCOME' ? 'Ingreso' : 'Gasto',
        t.type === 'INCOME' ? `+${t.amount}` : `-${t.amount}`,
        t.userId
    ]);

    const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transacciones_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export default function Reports() {
    const { data, loading, error } = useQuery(GET_TRANSACTIONS);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return <p className="text-red-500">Error al cargar datos: {error.message}</p>;

    const chartData = processTransactionsForChart(data?.transactions || []);
    const total = calculateTotal(data?.transactions || []);
    const monthlyChange = chartData.length >= 2 ?
        ((chartData[chartData.length - 1].amount - chartData[chartData.length - 2].amount) /
            Math.abs(chartData[chartData.length - 2].amount) * 100).toFixed(1) : 0;

    return (
        <DashboardLayout pageTitle="Sistema de gestión de Ingresos y Gastos" currentPathname="/reports">
            <div className="p-4 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl underline font-bold text-black">Reportes Financieros</h2>
                    <button
                        onClick={() => downloadCSV(data?.transactions || [])}
                        className="bg-zinc-400 hover:bg-zinc-500 text-black font-bold py-2 px-4 rounded flex items-center gap-2"
                    >
                        <Download className="h-5 w-5" />
                        Descargar CSV
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6">

                    {/* Gráfico de Barras */}
                    <div className="bg-zinc-400 p-6 rounded-lg shadow-lg">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-black">Movimientos Financieros</h3>
                            <p className="text-sm text-gray-700">Últimos {chartData.length} meses</p>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="amount">
                                        <LabelList dataKey="month" position="top" />
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.amount >= 0 ? '#4ade80' : '#f87171'}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm">
                            {Number(monthlyChange) >= 0 ? (
                                <div className="flex items-center text-black">
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                    Incremento del {monthlyChange}% este mes
                                </div>
                            ) : (
                                <div className="flex items-center text-red-600">
                                    <TrendingDown className="h-4 w-4 mr-1" />
                                    Reducción del {Math.abs(Number(monthlyChange))}% este mes
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Saldo Actual */}
                    <div className="bg-zinc-400 p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-bold text-black mb-4">Saldo Actual</h3>
                        <p className="text-3xl font-bold text-black">
                            {total >= 0 ? '+' : ''}{total.toFixed(2)} COP
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}