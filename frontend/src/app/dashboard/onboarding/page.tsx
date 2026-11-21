'use client';

import React, { useState, useEffect } from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { api } from '@/lib/api';
import { CheckSquare, CheckCircle2, Clock, ShieldCheck, Laptop, FileText } from 'lucide-react';

export default function OnboardingPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');
  const [onboardingData, setOnboardingData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEmployees().then((emps) => {
      setEmployees(emps || []);
      if (emps?.length > 0) {
        setSelectedEmpId(emps[0].id);
        loadOnboarding(emps[0].id);
      } else {
        setLoading(false);
      }
    });
  }, []);

  const loadOnboarding = async (empId: string) => {
    setLoading(true);
    try {
      const data = await api.getOnboarding(empId);
      setOnboardingData(data);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (taskId: string) => {
    try {
      await api.toggleOnboardingTask(taskId);
      loadOnboarding(selectedEmpId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-slate-50">
      <DashboardSidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Employee Onboarding Checklist</h1>
            <p className="text-xs text-slate-500 mt-1">
              Track joining formalities, IT provisioning, and compliance tasks for new hires.
            </p>
          </div>

          {employees.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Employee:</span>
              <select
                value={selectedEmpId}
                onChange={(e) => {
                  setSelectedEmpId(e.target.value);
                  loadOnboarding(e.target.value);
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.user?.firstName} {emp.user?.lastName} ({emp.employeeCode})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading onboarding...</div>
        ) : !onboardingData || onboardingData.totalTasks === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <div className="text-base font-bold text-slate-800">No onboarding tasks initialized</div>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Initialize the standard 5-step onboarding checklist for this employee.
            </p>
            <button
              onClick={async () => {
                await api.initializeOnboarding(selectedEmpId);
                loadOnboarding(selectedEmpId);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold text-xs"
            >
              Initialize Checklist
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Onboarding Completion Progress
                </span>
                <span className="text-sm font-extrabold text-brand-600">
                  {onboardingData.progressPercent}% Completed
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-brand-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${onboardingData.progressPercent}%` }}
                />
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                {onboardingData.completedTasks} of {onboardingData.totalTasks} items verified
              </div>
            </div>

            {/* Checklist items */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
              {onboardingData.tasks.map((task: any) => (
                <div
                  key={task.id}
                  onClick={() => handleToggle(task.id)}
                  className="p-5 flex items-start justify-between gap-4 hover:bg-slate-50 transition cursor-pointer group"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5">
                      {task.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <div className="w-5 h-5 rounded-lg border-2 border-slate-300 group-hover:border-brand-500 transition" />
                      )}
                    </div>
                    <div>
                      <div
                        className={`text-sm font-bold ${
                          task.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </div>
                      {task.description && (
                        <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
                      )}
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                    {task.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
