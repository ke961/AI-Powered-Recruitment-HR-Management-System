'use client';

import React, { useState, useEffect } from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { api } from '@/lib/api';
import { Clock, CheckCircle2, AlertCircle, LogIn, LogOut } from 'lucide-react';

export default function AttendancePage() {
  const [todayRecord, setTodayRecord] = useState<any | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const [today, list] = await Promise.all([
        api.getTodayAttendance().catch(() => null),
        api.getAllAttendance(),
      ]);
      setTodayRecord(today);
      setRecords(list || []);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setActionMsg(null);
    try {
      const rec = await api.checkInAttendance();
      setTodayRecord(rec);
      setActionMsg(`Checked in at ${new Date(rec.checkIn).toLocaleTimeString()} (${rec.status})`);
      loadAttendance();
    } catch (err: any) {
      setActionMsg(err.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    setActionMsg(null);
    try {
      const rec = await api.checkOutAttendance();
      setTodayRecord(rec);
      setActionMsg(`Checked out at ${new Date(rec.checkOut).toLocaleTimeString()}`);
      loadAttendance();
    } catch (err: any) {
      setActionMsg(err.message || 'Check-out failed');
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-slate-50">
      <DashboardSidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Daily Attendance Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time daily check-in/out records, late arrival grace period monitoring, and monthly summaries.
          </p>
        </div>

        {/* Action card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-600" />
              <h3 className="text-base font-bold text-slate-900">Your Attendance for Today</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Standard work day starts at 09:00 AM (09:30 AM grace period).
            </p>
            {actionMsg && (
              <div className="mt-2 text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200 inline-block">
                {actionMsg}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCheckIn}
              disabled={!!todayRecord?.checkIn}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition disabled:opacity-40"
            >
              <LogIn className="w-4 h-4" />
              {todayRecord?.checkIn ? 'Already Checked In' : 'Log Daily Check-in'}
            </button>

            <button
              onClick={handleCheckOut}
              disabled={!todayRecord?.checkIn || !!todayRecord?.checkOut}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs shadow-sm transition disabled:opacity-40"
            >
              <LogOut className="w-4 h-4" />
              {todayRecord?.checkOut ? 'Checked Out' : 'Log Check-out'}
            </button>
          </div>
        </div>

        {/* Company Attendance Log */}
        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading attendance...</div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Today&apos;s Workforce Log</h3>
              <span className="text-xs text-slate-400">{new Date().toDateString()}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Employee</th>
                    <th className="px-6 py-3.5">Check In Time</th>
                    <th className="px-6 py-3.5">Check Out Time</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                        No attendance records logged for today yet.
                      </td>
                    </tr>
                  ) : (
                    records.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/60 transition">
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {rec.employee?.user?.firstName} {rec.employee?.user?.lastName}
                        </td>
                        <td className="px-6 py-4 font-mono">
                          {rec.checkIn ? new Date(rec.checkIn).toLocaleTimeString() : '—'}
                        </td>
                        <td className="px-6 py-4 font-mono">
                          {rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString() : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              rec.status === 'PRESENT'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : rec.status === 'LATE'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {rec.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{rec.notes || '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
