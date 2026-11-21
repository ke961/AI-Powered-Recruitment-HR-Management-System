'use client';

import React, { useState, useEffect } from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { api } from '@/lib/api';
import { Settings, Building, Sparkles, Plus, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [autoShortlistScore, setAutoShortlistScore] = useState(85);
  const [enableAiScreening, setEnableAiScreening] = useState(true);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptDesc, setNewDeptDesc] = useState('');
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const [comp, depts] = await Promise.all([
        api.getCompanySettings(),
        api.getDepartments(),
      ]);
      setSettings(comp);
      setDepartments(depts || []);
      if (comp?.settings) {
        setAutoShortlistScore(comp.settings.autoShortlistScore || 85);
        setEnableAiScreening(comp.settings.enableAiScreening ?? true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateCompanySettings({
        autoShortlistScore: Number(autoShortlistScore),
        enableAiScreening,
      });
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    try {
      await api.createDepartment({ name: newDeptName.trim(), description: newDeptDesc });
      setNewDeptName('');
      setNewDeptDesc('');
      loadSettings();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-slate-50">
      <DashboardSidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Company & Recruitment Settings</h1>
          <p className="text-xs text-slate-500 mt-1">Configure organizational departments and AI screening parameters.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading settings...</div>
        ) : (
          <div className="space-y-8 max-w-3xl">
            {/* AI Screening Configuration */}
            <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-600" />
                <h3 className="text-base font-bold text-slate-900">AI Resume Screening Engine Configuration</h3>
              </div>

              {savedMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Settings updated successfully!
                </div>
              )}

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="font-bold text-slate-900">Enable Automated AI Screening</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Automatically evaluate uploaded resumes on submission.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableAiScreening}
                    onChange={(e) => setEnableAiScreening(e.target.checked)}
                    className="w-4 h-4 accent-brand-600 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Auto-Shortlist Sensitivity Threshold (% Score)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={60}
                      max={95}
                      value={autoShortlistScore}
                      onChange={(e) => setAutoShortlistScore(Number(e.target.value))}
                      className="flex-1 accent-brand-600"
                    />
                    <span className="font-extrabold text-sm text-brand-700 w-12 text-right">
                      {autoShortlistScore}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Candidates scoring above {autoShortlistScore}% will be flagged for accelerated recruiter review.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-xs"
                >
                  Save Configuration
                </button>
              </div>
            </form>

            {/* Department Management */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Organizational Departments</h3>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {departments.map((dept) => (
                  <div key={dept.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{dept.name}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{dept.description || 'No description'}</div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {dept._count?.jobPostings || 0} Open Roles
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleCreateDept} className="pt-3 border-t border-slate-100 flex gap-2 text-xs">
                <input
                  type="text"
                  required
                  placeholder="New department name (e.g. Finance)..."
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
