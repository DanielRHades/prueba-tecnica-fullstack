import Link from 'next/link';
import { useRouter } from 'next/router';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const router = useRouter();

    return (
        <div className="min-h-screen flex">
            { }
            <aside className="w-64 bg-gray-800 text-white p-4">
                <h2 className="text-2xl font-bold mb-6">SEG-A 2.0</h2>
                <nav>
                    <Link href="/" className={`block py-2 px-4 rounded hover:bg-gray-700 mb-2 ${router.pathname === '/' ? 'bg-gray-700' : ''}`}>
                        Inicio
                    </Link>
                    <Link href="/users" className={`block py-2 px-4 rounded hover:bg-gray-700 mb-2 ${router.pathname === '/users' ? 'bg-gray-700' : ''}`}>
                        Usuarios
                    </Link>
                    <Link href="/transactions" className={`block py-2 px-4 rounded hover:bg-gray-700 mb-2 ${router.pathname === '/transactions' ? 'bg-gray-700' : ''}`}>
                        Transacciones
                    </Link>
                    { }
                </nav>
            </aside>

            { }
            <main className="flex-1 p-4">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;