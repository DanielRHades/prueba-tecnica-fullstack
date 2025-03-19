// pages/index.tsx
import DashboardLayout from '@/components/DashboardLayout';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6 text-slate-800">Dashboard</h1>
        <p className="text-slate-600">Bienvenido al panel de administración.</p>
        { }
      </div>
    </DashboardLayout>
  );
}