import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import AdminNav from '@/components/admin/AdminNav';

export const metadata = {
  title: 'Admin CRM & Property Management | Grand Realty NCR',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row w-full overflow-x-hidden">
      {user && <AdminNav user={user} />}
      <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto min-w-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
