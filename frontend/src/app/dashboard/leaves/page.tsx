'use client';

import React, { useState, useEffect } from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { api } from '@/lib/api';
import { CalendarOff, Check, X, Clock, Calendar } from 'lucide-react';

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    setLoading(true);
    try {
      const data = await api.getAllLeaves();
      setLeaves(data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.reviewLeave(id, status);
      loadLeaves();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-slate-50">
      <DashboardSidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Leave Requests & Approvals</h1>
          <p className="text-xs text-slate-500 mt-1">Review employee leave applications and monitor quota balances.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading leave requests...</div>
        ) : leaves.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <CalendarOff className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <div className="text-base font-bold text-slate-800">No active leave requests</div>
            <p className="text-xs text-slate-500 mt-1">Leave applications submitted by team members will appear here for approval.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Employee</th>
                    <th className="px-6 py-3.5">Leave Type</th>
                    <th className="px-6 py-3.5">Duration & Dates</th>
                    <th className="px-6 py-3.5">Reason</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {leaves.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {req.employee?.user?.firstName} {req.employee?.user?.lastName}
                      </td>
                      <td className="px-6 py-4 font-semibold text-brand-700">{req.leaveType}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{req.daysCount} Day(s)</div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(req.startDate).toLocaleDateString()} &mdash; {new Date(req.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-slate-600">{req.reason}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            req.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : req.status === 'REJECTED'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {req.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleReview(req.id, 'APPROVED')}
                              className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => handleReview(req.id, 'REJECTED')}
                              className="px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
