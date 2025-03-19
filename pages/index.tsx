import { gql, useQuery } from '@apollo/client';

interface Transaction {
  concept: string;
  type: 'INGRESO' | 'EGRESO';
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: 'ADMIN' | 'USER';
  transactions: Transaction[];
}

const AllUsersQuery = gql`
  query Users {
    users {
      id
      name
      email
      phone
      role
      transactions {
        concept
        type
      }
    }
  }
`;

export default function Home() {
  const { data, error, loading } = useQuery(AllUsersQuery);

  if (loading) return <p className="text-slate-600">Loading...</p>;
  if (error) return <p className="text-red-500">Oops, something went wrong: {error.message}</p>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Users</h1>
      {data && data.users && data.users.length > 0 ? (
        <div className="rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Transactions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {data.users.map((user: User) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{user.phone || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{user.role}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {user.transactions && user.transactions.length > 0 ? (
                      <ul className="space-y-1">
                        {user.transactions.map((transaction: Transaction, index: number) => (
                          <li key={index} className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.type === 'INGRESO' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.type}
                            </span>
                            <span className="text-slate-600">{transaction.concept}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-slate-400">No transactions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-slate-600">No users found.</p>
      )}
    </div>
  );
}