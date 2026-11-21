'use client';

import React, { useState, useEffect } from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { api } from '@/lib/api';
import {
  Calendar,
  Plus,
  CheckCircle2,
  ExternalLink,
  Award,
  Clock,
  User,
} from 'lucide-react';

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedInterviewForScorecard, setSelectedInterviewForScorecard] = useState<any | null>(null);

  // Schedule form state
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [type, setType] = useState('TECHNICAL');
  const [scheduledAt, setScheduledAt] = useState('2026-11-26T15:00');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/hfa-interview-session');
  const [notes, setNotes] = useState('');

  // Scorecard state
  const [technicalRating, setTechnicalRating] = useState(4);
  const [behavioralRating, setBehavioralRating] = useState(4);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [problemSolvingRating, setProblemSolvingRating] = useState(4);
  const [recommendation, setRecommendation] = useState('STRONG_HIRE');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [intList, appList] = await Promise.all([
        api.getInterviews(),
        api.getAllApplications(),
      ]);
      setInterviews(intList || []);
      setApplications(appList || []);
      if (appList?.length > 0) setSelectedAppId(appList[0].id);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Find current user profile to assign interviewerId
      const profile = await api.getProfile();
      await api.scheduleInterview({
        applicationId: selectedAppId,
        interviewerId: profile.id,
        type,
        scheduledAt: new Date(scheduledAt).toISOString(),
        meetingLink,
        notes,
      });
      setShowScheduleModal(false);
      loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitScorecard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInterviewForScorecard) return;
    setIsSubmitting(true);
    try {
      await api.submitScorecard(selectedInterviewForScorecard.id, {
        technicalRating: Number(technicalRating),
        behavioralRating: Number(behavioralRating),
        communicationRating: Number(communicationRating),
        problemSolvingRating: Number(problemSolvingRating),
        overallRecommendation: recommendation,
        feedbackNotes,
      });
      setSelectedInterviewForScorecard(null);
      setFeedbackNotes('');
      loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-slate-50">
      <DashboardSidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Interviews & Evaluation Scorecards</h1>
            <p className="text-xs text-slate-500 mt-1">Coordinate structured interview rounds and submit candidate ratings.</p>
          </div>

          <button
            onClick={() => setShowScheduleModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs hover:bg-brand-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Schedule Interview
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading interviews...</div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Candidate & Role</th>
                    <th className="px-6 py-3.5">Interview Round</th>
                    <th className="px-6 py-3.5">Scheduled Date</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Scorecards</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {interviews.map((int) => (
                    <tr key={int.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">
                          {int.application?.candidate?.user?.firstName} {int.application?.candidate?.user?.lastName}
                        </div>
                        <div className="text-[11px] text-slate-400">{int.application?.job?.title}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-purple-700">{int.type} Round</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{new Date(int.scheduledAt).toLocaleString()}</div>
                        <div className="text-[11px] text-slate-400">{int.durationMinutes} minutes</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            int.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {int.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {int.scorecards?.length > 0 ? (
                          <div className="flex items-center gap-1 font-bold text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{int.scorecards[0].overallRecommendation}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {int.meetingLink && (
                            <a
                              href={int.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50"
                              title="Join Meeting"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}

                          {int.status !== 'COMPLETED' && (
                            <button
                              onClick={() => setSelectedInterviewForScorecard(int)}
                              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-xs"
                            >
                              Scorecard
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Schedule Interview Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="text-base font-bold text-slate-900">Schedule Interview Round</h3>
                <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 font-bold">&times;</button>
              </div>

              <form onSubmit={handleSchedule} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Candidate Application</label>
                  <select
                    value={selectedAppId}
                    onChange={(e) => setSelectedAppId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {applications.map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.candidate?.user?.firstName} {app.candidate?.user?.lastName} — {app.job?.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Interview Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="TECHNICAL">Technical Round</option>
                      <option value="BEHAVIORAL">Behavioral Round</option>
                      <option value="HR">HR & Culture Fit</option>
                      <option value="FINAL">Executive / Final</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Scheduled Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Meeting Link</label>
                  <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-brand-600 text-white font-semibold shadow-sm hover:bg-brand-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Scheduling...' : 'Confirm Schedule'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Submit Scorecard Modal */}
        {selectedInterviewForScorecard && (
          <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Interview Evaluation Scorecard</h3>
                  <p className="text-xs text-slate-500">
                    Candidate: {selectedInterviewForScorecard.application?.candidate?.user?.firstName}{' '}
                    {selectedInterviewForScorecard.application?.candidate?.user?.lastName}
                  </p>
                </div>
                <button onClick={() => setSelectedInterviewForScorecard(null)} className="text-slate-400 font-bold">&times;</button>
              </div>

              <form onSubmit={handleSubmitScorecard} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Technical Rating (1-5)</label>
                    <select
                      value={technicalRating}
                      onChange={(e) => setTechnicalRating(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Behavioral Rating (1-5)</label>
                    <select
                      value={behavioralRating}
                      onChange={(e) => setBehavioralRating(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Communication (1-5)</label>
                    <select
                      value={communicationRating}
                      onChange={(e) => setCommunicationRating(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Problem Solving (1-5)</label>
                    <select
                      value={problemSolvingRating}
                      onChange={(e) => setProblemSolvingRating(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Overall Recommendation</label>
                  <select
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    <option value="STRONG_HIRE">STRONG HIRE (Top 5% Candidate)</option>
                    <option value="HIRE">HIRE (Meets All Standards)</option>
                    <option value="NEUTRAL">NEUTRAL (Borderline)</option>
                    <option value="NO_HIRE">NO HIRE</option>
                    <option value="STRONG_NO_HIRE">STRONG NO HIRE</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Written Feedback & Evidence</label>
                  <textarea
                    rows={3}
                    required
                    value={feedbackNotes}
                    onChange={(e) => setFeedbackNotes(e.target.value)}
                    placeholder="Candidate demonstrated clean code architecture, answered concurrency questions well..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedInterviewForScorecard(null)}
                    className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-purple-600 text-white font-semibold shadow-sm hover:bg-purple-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Scorecard'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
