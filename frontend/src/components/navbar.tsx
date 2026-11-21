'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, DEMO_CREDENTIALS } from '@/context/auth-context';
import { api } from '@/lib/api';
import {
  Sparkles,
  Briefcase,
  LayoutDashboard,
  UserCheck,
  Bell,
  LogOut,
  LogIn,
  ChevronDown,
  KanbanSquare,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, demoLogin } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  useEffect(() => {
    if (user) {
      api.getNotifications()
        .then((data) => setNotifications(data || []))
        .catch(() => {});
    }
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-brand-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                HireFlow<span className="text-brand-600">.ai</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-brand-50 text-brand-700 rounded border border-brand-200">
                HR ATS
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              href="/jobs"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                pathname.startsWith('/jobs') && !pathname.includes('manage')
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Careers
            </Link>

            {user?.role && user.role !== 'CANDIDATE' && (
              <>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    pathname === '/dashboard'
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  HR Dashboard
                </Link>

                <Link
                  href="/pipeline"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    pathname.startsWith('/pipeline')
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <KanbanSquare className="w-4 h-4" />
                  Kanban Pipeline
                </Link>
              </>
            )}

            {user?.role === 'CANDIDATE' && (
              <Link
                href="/candidate/applications"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  pathname.startsWith('/candidate')
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                My Applications
              </Link>
            )}
          </nav>

          {/* Right Action Menu */}
          <div className="flex items-center gap-3">
            {/* Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition shadow-sm"
              >
                <span>Demo Accounts</span>
                <ChevronDown className="w-3.5 h-3.5 text-amber-700" />
              </button>

              {showDemoMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Quick Role Sign-In
                  </div>
                  {Object.entries(DEMO_CREDENTIALS).map(([roleKey, creds]) => (
                    <button
                      key={roleKey}
                      onClick={async () => {
                        await demoLogin(roleKey as any);
                        setShowDemoMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                    >
                      <span className="font-medium">{creds.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{roleKey}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Button */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800">Notifications ({unreadCount} new)</span>
                      <button
                        onClick={async () => {
                          await api.markAllNotificationsRead();
                          setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
                        }}
                        className="text-[11px] text-brand-600 hover:underline"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">No notifications yet.</div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className={`p-3 text-xs ${n.isRead ? 'opacity-70' : 'bg-brand-50/40'}`}>
                            <div className="font-semibold text-slate-800">{n.title}</div>
                            <div className="text-slate-600 mt-0.5">{n.message}</div>
                            <div className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile or Login */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-semibold text-slate-800">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize">{user.role.toLowerCase().replace('_', ' ')}</div>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 shadow-sm transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
