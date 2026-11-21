'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { api } from '@/lib/api';
import {
  Briefcase,
  Users,
  Clock,
  TrendingUp,
  KanbanSquare,
  Sparkles,
  ArrowRight,
  Activity,
  Award,
} from 'lucide-react';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardMetrics()
      .then((data) => setMetrics(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-slate-50">
      <DashboardSidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Recruitment Overview & Analytics
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Real-time pipeline performance, funnel velocity, and hiring metrics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/pipeline"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold text-xs hover:bg-brand-700 transition shadow-sm"
            >
              <KanbanSquare className="w-4 h-4" />
              Open Kanban Board
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading analytics...</div>
        ) : (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Vacancies</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">
                    {metrics?.overview?.activeJobs || 0}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {metrics?.overview?.totalJobs || 0} total created
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Applications</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">
                    {metrics?.overview?.totalApplications || 0}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {metrics?.overview?.totalCandidates || 0} candidates
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Time-to-Hire</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">
                    {metrics?.overview?.averageTimeToHireDays || 14} <span className="text-sm font-normal text-slate-500">days</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
                    Fast screening with AI
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hiring Success Rate</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">
                    {metrics?.overview?.hiringSuccessRate || '0%'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {metrics?.overview?.hiredCount || 0} total hires
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Funnel Visualization */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Recruitment Funnel Velocity</h3>
                  <p className="text-xs text-slate-500">Applicant breakdown across all active pipeline stages</p>
                </div>
                <Link
                  href="/pipeline"
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  View Kanban Board &rarr;
                </Link>
              </div>

              <div className="space-y-3">
                {metrics?.recruitmentFunnel?.map((item: any) => {
                  const maxCount = Math.max(...metrics.recruitmentFunnel.map((f: any) => f.count), 1);
                  const percent = Math.round((item.count / maxCount) * 100);

                  const stageColor =
                    item.stage === 'HIRED'
                      ? 'bg-emerald-500'
                      : item.stage === 'OFFER'
                      ? 'bg-indigo-500'
                      : item.stage === 'INTERVIEW'
                      ? 'bg-purple-500'
                      : item.stage === 'SHORTLISTED'
                      ? 'bg-brand-500'
                      : item.stage === 'REJECTED'
                      ? 'bg-red-400'
                      : 'bg-slate-400';

                  return (
                    <div key={item.stage} className="flex items-center gap-4 text-xs">
                      <div className="w-28 font-medium text-slate-700 truncate">{item.stage}</div>
                      <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${stageColor} transition-all duration-500`}
                          style={{ width: `${Math.max(percent, item.count > 0 ? 8 : 0)}%` }}
                        />
                      </div>
                      <div className="w-12 text-right font-bold text-slate-900">{item.count}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Audit / Recruiter Activity */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-brand-600" />
                <h3 className="text-base font-bold text-slate-900">Recent Pipeline Audit Trail</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {metrics?.recentActivity?.length === 0 ? (
                  <div className="py-4 text-center text-xs text-slate-400">No activity recorded yet.</div>
                ) : (
                  metrics?.recentActivity?.map((act: any) => (
                    <div key={act.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {act.action.replace(/_/g, ' ')}
                        </div>
                        <div className="text-slate-500 mt-0.5">
                          {act.user ? `${act.user.firstName} ${act.user.lastName} (${act.user.role})` : 'System'} • {act.entityType}
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 whitespace-nowrap">
                        {new Date(act.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
