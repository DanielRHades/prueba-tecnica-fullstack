import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import withAuth from '@/components/withAuth';

function Dashboard() {
  return (
    <DashboardLayout pageTitle="Sistema de gestión de Ingresos y Egresos" currentPathname="/">
      <div className="p-4">
        <h2 className="text-black font-bold mb-6 mt-16 text-2xl pl-12">Bienvenido al Inicio. Nuestros servicios:</h2>

        <div className="flex flex-col space-y-4 mt-10 pl-12">
          <Link
            href="/transactions"
            className="bg-zinc-400 hover:bg-zinc-500 text-black font-medium py-4 px-10 rounded shadow-md text-lg w-full max-w-md text-left"
          >
            Sistema de gestión de Ingresos y Egresos
          </Link>
          <Link
            href="/users"
            className="bg-zinc-400 hover:bg-zinc-500 text-black font-medium py-4 px-10 rounded shadow-md text-lg w-full max-w-md text-left"
          >
            Gestión de usuarios
          </Link>
          <Link
            href="/reports"
            className="bg-zinc-400 hover:bg-zinc-500 text-black font-medium py-4 px-10 rounded shadow-md text-lg w-full max-w-md text-left"
          >
            Reportes
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default withAuth(Dashboard);