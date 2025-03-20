import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface DashboardLayoutProps {
    children: React.ReactNode;
    pageTitle?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, pageTitle }) => {
    const router = useRouter();
    return (
        <div className="min-h-screen flex">
            <aside className="w-64 bg-zinc-400 text-black font-medium p-4 rounded-r-lg shadow-md">
                <Image src="/logo.png" alt="Mi logo" width={1000} height={1000} />
                <nav>
                    <Link href="/" className={`block py-2 px-4 rounded hover:bg-zinc-200 mb-2 ${router.pathname === '/' ? 'bg-zinc-200' : ''}`}>
                        Inicio
                    </Link>
                    <Link href="/transactions" className={`block py-2 px-4 rounded hover:bg-zinc-200 mb-2 ${router.pathname === '/transactions' ? 'bg-zinc-200' : ''}`}>
                        Ingresos y Egresos
                    </Link>
                    <Link href="/users" className={`block py-2 px-4 rounded hover:bg-zinc-200 mb-2 ${router.pathname === '/users' ? 'bg-zinc-200' : ''}`}>
                        Usuarios
                    </Link>
                    <Link href="/reports" className={`block py-2 px-4 rounded hover:bg-zinc-200 mb-2 ${router.pathname === '/reports' ? 'bg-zinc-200' : ''}`}>
                        Reportes
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 p-4">
                <div className="text-center mt-4 mb-6 pl-4">
                    <h1 className="text-4xl font-bold text-black">
                        {pageTitle || "Sistema de gestión de Ingresos y Gastos"}
                    </h1>
                </div>
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;