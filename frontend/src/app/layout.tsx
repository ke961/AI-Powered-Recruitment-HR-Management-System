import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { Navbar } from '@/components/navbar';

export const metadata: Metadata = {
  title: 'HireFlow AI — AI-Powered Recruitment & HR Management System',
  description: 'Enterprise Applicant Tracking System with Explainable AI Resume Screening, Kanban Pipeline, and HR Operations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
