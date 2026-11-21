'use client';

import React, { useState, useEffect } from 'react';
import { api, Application, JobPosting } from '@/lib/api';
import {
  Sparkles,
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  FileText,
  Calendar,
  Gift,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

const STAGES = [
  { id: 'APPLIED', label: 'Applied', color: 'border-slate-200 bg-slate-50' },
  { id: 'SCREENING', label: 'Screening', color: 'border-blue-200 bg-blue-50/20' },
  { id: 'SHORTLISTED', label: 'Shortlisted', color: 'border-indigo-200 bg-indigo-50/20' },
  { id: 'INTERVIEW', label: 'Interview', color: 'border-purple-200 bg-purple-50/20' },
  { id: 'OFFER', label: 'Offer', color: 'border-amber-200 bg-amber-50/20' },
  { id: 'HIRED', label: 'Hired 🎉', color: 'border-emerald-200 bg-emerald-50/20' },
  { id: 'REJECTED', label: 'Rejected', color: 'border-red-200 bg-red-50/20' },
];

export default function PipelinePage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('ALL');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected candidate modal state
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [overrideNotes, setOverrideNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedJobId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.getAdminJobs(),
        selectedJobId === 'ALL'
          ? api.getAllApplications()
          : api.getApplicationsByJob(selectedJobId),
      ]);
      setJobs(jobsRes.data || []);
      setApplications(appsRes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveStage = async (appId: string, targetStage: string) => {
    try {
      const updated = await api.updateStage(appId, targetStage);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, stage: updated.stage } : a)),
      );
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp({ ...selectedApp, stage: updated.stage as any });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddNotes = async () => {
    if (!selectedApp || !notesInput.trim()) return;
    setIsUpdating(true);
    try {
      await api.addRecruiterNotes(selectedApp.id, notesInput.trim());
      const updatedDetail = await api.getApplicationDetail(selectedApp.id);
      setSelectedApp(updatedDetail);
      setNotesInput('');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOverrideAI = async (status: 'APPROVED' | 'OVERRIDDEN') => {
    if (!selectedApp) return;
    setIsUpdating(true);
    try {
      await api.overrideAiAnalysis(selectedApp.id, status, overrideNotes);
      const updatedDetail = await api.getApplicationDetail(selectedApp.id);
      setSelectedApp(updatedDetail);
      setOverrideNotes('');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-100 min-h-[calc(100vh-4rem)]">
      {/* Top Filter Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Vacancy:</span>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-white text-slate-800"
            >
              <option value="ALL">All Active Vacancies ({applications.length} candidates)</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} ({job.department})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <span>AI compatibility scores color-coded: 80%+ Green, 60-79% Amber, &lt;60% Red</span>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 p-6 overflow-x-auto flex gap-4 items-start">
        {STAGES.map((stage) => {
          const stageApps = applications.filter((a) => a.stage === stage.id);
          return (
            <div
              key={stage.id}
              className={`w-72 flex-shrink-0 rounded-2xl border ${stage.color} p-3 flex flex-col max-h-[calc(100vh-9.5rem)]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-200/60">
                <span className="text-xs font-bold text-slate-800">{stage.label}</span>
                <span className="w-5 h-5 rounded-full bg-white text-[11px] font-bold text-slate-600 flex items-center justify-center shadow-xs">
                  {stageApps.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
                {stageApps.length === 0 ? (
                  <div className="py-8 text-center text-[11px] text-slate-400">No candidates</div>
                ) : (
                  stageApps.map((app) => {
                    const aiScore = app.aiAnalysis?.overallMatchScore;
                    const scoreBg =
                      !aiScore
                        ? 'bg-slate-100 text-slate-600'
                        : aiScore >= 80
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : aiScore >= 60
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200';

                    return (
                      <div
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        className="bg-white rounded-xl p-3.5 border border-slate-200/80 hover:border-brand-500 shadow-xs hover:shadow-sm transition cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-1 mb-1.5">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition">
                            {app.candidate?.user?.firstName} {app.candidate?.user?.lastName}
                          </h4>
                          {aiScore && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${scoreBg}`}>
                              {aiScore}% Match
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-500 line-clamp-1">{app.job?.title}</div>

                        {app.candidate?.skills && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {app.candidate.skills.slice(0, 3).map((s) => (
                              <span key={s} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-medium">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Quick Stage Move Buttons */}
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </span>

                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            {stage.id !== 'APPLIED' && (
                              <button
                                onClick={() => {
                                  const idx = STAGES.findIndex((s) => s.id === stage.id);
                                  if (idx > 0) handleMoveStage(app.id, STAGES[idx - 1].id);
                                }}
                                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                                title="Previous Stage"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}

                            {stage.id !== 'HIRED' && stage.id !== 'REJECTED' && (
                              <button
                                onClick={() => {
                                  const idx = STAGES.findIndex((s) => s.id === stage.id);
                                  if (idx >= 0 && idx < STAGES.length - 1) handleMoveStage(app.id, STAGES[idx + 1].id);
                                }}
                                className="p-1 rounded hover:bg-brand-50 text-brand-600 hover:text-brand-700 font-bold"
                                title="Next Stage"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate AI Review & Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedApp.candidate?.user?.firstName} {selectedApp.candidate?.user?.lastName}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                    {selectedApp.stage}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Applied for {selectedApp.job?.title} • {selectedApp.candidate?.user?.email}
                </p>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto py-4 space-y-6">
              {/* AI Resume Screening Insights Card */}
              {selectedApp.aiAnalysis ? (
                <div className="bg-gradient-to-br from-brand-50/50 via-white to-slate-50 p-5 rounded-2xl border border-brand-200 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-brand-600" />
                      <span className="text-sm font-bold text-slate-900">Explainable AI Match Assessment</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-brand-600 text-white shadow-xs">
                      {selectedApp.aiAnalysis.overallMatchScore}% Match
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed mb-4">
                    {selectedApp.aiAnalysis.matchExplanation}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="font-bold text-emerald-700 mb-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Matched Skills
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedApp.aiAnalysis.skillsMatched?.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="font-bold text-amber-700 mb-1.5 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Missing / Unverified Skills
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedApp.aiAnalysis.skillsMissing?.length === 0 ? (
                          <span className="text-slate-400 text-[11px]">None detected</span>
                        ) : (
                          selectedApp.aiAnalysis.skillsMissing?.map((s) => (
                            <span key={s} className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-medium border border-amber-200">
                              {s}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Human Recruiter Override */}
                  <div className="mt-4 pt-4 border-t border-brand-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <ShieldCheck className="w-4 h-4 text-brand-600" />
                      <span>Review Status: <strong>{selectedApp.aiAnalysis.humanReviewStatus}</strong></span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOverrideAI('APPROVED')}
                        className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition"
                      >
                        Approve Match
                      </button>
                      <button
                        onClick={() => handleOverrideAI('OVERRIDDEN')}
                        className="px-3 py-1 rounded-xl bg-slate-200 text-slate-800 font-semibold text-xs hover:bg-slate-300 transition"
                      >
                        Override
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-100 text-center text-xs text-slate-500">
                  AI analysis in progress or pending trigger.
                  <button
                    onClick={async () => {
                      await api.triggerScreening(selectedApp.id);
                      const updated = await api.getApplicationDetail(selectedApp.id);
                      setSelectedApp(updated);
                    }}
                    className="ml-2 font-semibold text-brand-600 hover:underline"
                  >
                    Trigger AI Analysis Now
                  </button>
                </div>
              )}

              {/* Cover Letter & Resume Link */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Candidate Resume & Cover Letter</div>
                {selectedApp.coverLetter && (
                  <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-700 italic border border-slate-200">
                    &ldquo;{selectedApp.coverLetter}&rdquo;
                  </div>
                )}
                {selectedApp.resumeUrl && (
                  <a
                    href={selectedApp.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold hover:bg-slate-200 transition"
                  >
                    <FileText className="w-4 h-4 text-slate-500" />
                    Open Uploaded Resume Document
                  </a>
                )}
              </div>

              {/* Recruiter Evaluation Notes */}
              <div>
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Recruiter Evaluation Notes</div>
                {selectedApp.recruiterNotes && (
                  <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-700 whitespace-pre-line border border-slate-200 mb-2">
                    {selectedApp.recruiterNotes}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="Add recruiter feedback or interview notes..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                  <button
                    onClick={handleAddNotes}
                    disabled={isUpdating || !notesInput.trim()}
                    className="px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold text-xs disabled:opacity-50"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-500 font-medium">Move Stage:</span>
                {['SHORTLISTED', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleMoveStage(selectedApp.id, st)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                      selectedApp.stage === st ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
