'use client';

import React, { useState, useEffect } from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { api } from '@/lib/api';
import { FileSpreadsheet, Download, BarChart2, CheckCircle2 } from 'lucide-react';

export default function ReportsPage() {
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getReportsSummary()
      .then((data) => setReport(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const downloadCsv = async (type: 'applications' | 'jobs') => {
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/reports/export/${type}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-slate-50">
      <DashboardSidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Recruitment & Compliance Reports</h1>
            <p className="text-xs text-slate-500 mt-1">
              Analyze stage conversion performance and export statutory recruitment records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => downloadCsv('applications')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Export Applications (CSV)
            </button>
            <button
              onClick={() => downloadCsv('jobs')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-900 transition shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Export Jobs (CSV)
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading reports...</div>
        ) : (
          <div className="space-y-8">
            {/* Overview Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Total Published Jobs</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">{report?.summary?.totalJobs || 0}</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Total Candidates Applied</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">{report?.summary?.totalApplications || 0}</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Formal Offers Generated</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">{report?.summary?.totalOffers || 0}</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Offers Accepted</div>
                <div className="text-2xl font-extrabold text-emerald-600 mt-1">{report?.summary?.acceptedOffers || 0}</div>
              </div>
            </div>

            {/* Stage Conversion Rates */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Pipeline Stage Conversion Performance</h3>
                <span className="text-xs text-slate-400">Total applications tracked: {report?.summary?.totalApplications}</span>
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Stage</th>
                    <th className="px-6 py-3.5">Applicant Volume</th>
                    <th className="px-6 py-3.5">Conversion Share (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {report?.stageConversions?.map((row: any) => (
                    <tr key={row.stage} className="hover:bg-slate-50/60">
                      <td className="px-6 py-3.5 font-bold text-slate-900">{row.stage}</td>
                      <td className="px-6 py-3.5 font-semibold">{row.count} candidates</td>
                      <td className="px-6 py-3.5 font-mono font-bold text-brand-600">{row.conversionRate}</td>
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
