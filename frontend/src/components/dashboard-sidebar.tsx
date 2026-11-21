'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  KanbanSquare,
  Briefcase,
  Calendar,
  Gift,
  Users,
  CheckSquare,
  CalendarOff,
  Clock,
  FileSpreadsheet,
  Settings,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'HR Analytics', icon: LayoutDashboard },
  { href: '/pipeline', label: 'Kanban Pipeline', icon: KanbanSquare },
  { href: '/dashboard/jobs', label: 'Job Postings', icon: Briefcase },
  { href: '/dashboard/interviews', label: 'Interviews & Scorecards', icon: Calendar },
  { href: '/dashboard/offers', label: 'Offers & Hiring', icon: Gift },
  { href: '/dashboard/employees', label: 'Employee Directory', icon: Users },
  { href: '/dashboard/onboarding', label: 'Onboarding Checklist', icon: CheckSquare },
  { href: '/dashboard/leaves', label: 'Leave Requests', icon: CalendarOff },
  { href: '/dashboard/attendance', label: 'Daily Attendance', icon: Clock },
  { href: '/dashboard/reports', label: 'Recruitment Reports', icon: FileSpreadsheet },
  { href: '/dashboard/settings', label: 'Company Settings', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col gap-1 min-h-[calc(100vh-4rem)]">
      <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        HR Management
      </div>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
              isActive
                ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}
