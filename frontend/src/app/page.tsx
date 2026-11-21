'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth, DEMO_CREDENTIALS } from '@/context/auth-context';
import {
  Sparkles,
  ArrowRight,
  Briefcase,
  KanbanSquare,
  ShieldCheck,
  Zap,
  Users,
  Award,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  const { user, demoLogin } = useAuth();

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-brand-50/30 to-slate-50 pt-16 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            AI-Powered Recruitment & HR Management System
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-950 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Smarter Hiring with <span className="text-brand-600">Explainable AI</span> & Modern ATS.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Screen resumes transparently, coordinate interview scorecards, track candidate pipelines with drag-and-drop Kanban, and manage full-cycle HR operations.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition shadow-md shadow-brand-600/20"
            >
              <Briefcase className="w-4 h-4" />
              Browse Open Vacancies
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-semibold text-sm hover:bg-slate-50 transition shadow-xs"
            >
              <KanbanSquare className="w-4 h-4 text-brand-600" />
              Open HR Recruiter Portal
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Quick Demo Sign-in Cards */}
          <div className="mt-14 max-w-3xl mx-auto bg-white/90 backdrop-blur rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Instant One-Click Demo Access (Seeded Roles)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(DEMO_CREDENTIALS).map(([role, creds]) => (
                <button
                  key={role}
                  onClick={() => demoLogin(role as any)}
                  className="flex flex-col items-center text-center p-3 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition group"
                >
                  <span className="text-xs font-bold text-slate-800 group-hover:text-brand-600">
                    {creds.label.split(' ')[0]}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5 truncate w-full">
                    {creds.label.split('(')[1]?.replace(')', '')}
                  </span>
                  <span className="text-[10px] text-brand-600 font-medium mt-2 flex items-center gap-1">
                    Sign in &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Designed for Modern Recruitment & HR Teams
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            From vacancy publishing and AI resume extraction to formal offers and employee onboarding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Explainable AI Resume Screening</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Analyzes candidate CVs (PDF/DOCX) against job requirements. Provides a 0-100% compatibility score with matched skills, missing skills, and evidence summaries without automated rejections.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Human-in-the-loop override verified
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 mb-4">
              <KanbanSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Interactive Kanban Pipeline</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Drag-and-drop applicants seamlessly across 8 structured hiring stages. View applicant AI match badges, interview scorecards, and append evaluation notes.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Full audit logging & state transitions
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">End-to-End HR Operations</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Convert hired applicants into employee records automatically. Track onboarding task checklists, manage leaves, daily check-in attendance, and export compliance reports.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Comprehensive HRIS integration
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
