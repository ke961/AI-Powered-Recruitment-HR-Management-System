'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, Application } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import {
  Briefcase,
  Clock,
  Calendar,
  Gift,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export default function CandidateApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [offerNotes, setOfferNotes] = useState('');
  const [respondingOfferId, setRespondingOfferId] = useState<string | null>(null);

  useEffect(() => {
    loadMyApplications();
  }, []);

  const loadMyApplications = async () => {
    setLoading(true);
    try {
      const data = await api.getMyApplications();
      setApplications(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (appId: string) => {
    if (!confirm('Are you sure you want to withdraw your application?')) return;
    try {
      await api.withdrawApplication(appId);
      loadMyApplications();
    } catch (e) {
      console.error(e);
    }
  };

  const handleOfferResponse = async (offerId: string, decision: 'ACCEPTED' | 'DECLINED') => {
    try {
      await api.respondToOffer(offerId, decision, offerNotes);
      setRespondingOfferId(null);
      setOfferNotes('');
      loadMyApplications();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Job Applications</h1>
            <p className="text-xs text-slate-500 mt-1">
              Track your application statuses, scheduled interviews, and incoming job offers.
            </p>
          </div>

          <Link
            href="/jobs"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition shadow-sm"
          >
            Browse More Jobs
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading your applications...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No applications submitted yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Find open positions matching your skills and apply in seconds with your resume.
            </p>
            <Link
              href="/jobs"
              className="mt-4 inline-block px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold text-xs"
            >
              Explore Vacancies
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col gap-6"
              >
                {/* Application Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                        {app.job?.department}
                      </span>
                      <span className="text-[11px] text-slate-500">{app.job?.employmentType.replace('_', ' ')}</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">{app.job?.title}</h2>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Applied on {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        app.stage === 'HIRED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.stage === 'OFFER'
                          ? 'bg-amber-100 text-amber-800'
                          : app.stage === 'INTERVIEW'
                          ? 'bg-purple-100 text-purple-800'
                          : app.stage === 'SHORTLISTED'
                          ? 'bg-blue-100 text-blue-800'
                          : app.stage === 'REJECTED' || app.stage === 'WITHDRAWN'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-brand-50 text-brand-700'
                      }`}
                    >
                      Stage: {app.stage}
                    </span>

                    {app.stage !== 'HIRED' && app.stage !== 'WITHDRAWN' && (
                      <button
                        onClick={() => handleWithdraw(app.id)}
                        className="text-xs text-red-600 hover:underline font-medium"
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>

                {/* Scheduled Interviews Box */}
                {app.interviews && app.interviews.length > 0 && (
                  <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-900 mb-2">
                      <Calendar className="w-4 h-4 text-purple-700" />
                      Scheduled Interview Session
                    </div>
                    {app.interviews.map((int: any) => (
                      <div key={int.id} className="text-xs text-slate-700 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-slate-900">
                            {int.type} Interview • Status: {int.status}
                          </div>
                          <div className="text-slate-500 mt-0.5">
                            {new Date(int.scheduledAt).toLocaleString()}
                          </div>
                        </div>
                        {int.meetingLink && (
                          <a
                            href={int.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition"
                          >
                            <span>Join Meeting</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Formal Job Offer Card */}
                {app.offer && (
                  <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm font-bold text-amber-950">
                        <Gift className="w-5 h-5 text-amber-700" />
                        Formal Job Offer Received!
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white text-amber-800 border border-amber-300">
                        Status: {app.offer.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-4">
                      <div>
                        <span className="text-slate-500">Base Salary</span>
                        <div className="font-bold text-slate-900 text-sm mt-0.5">
                          ${app.offer.baseSalary?.toLocaleString()} / year
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500">Joining Date</span>
                        <div className="font-bold text-slate-900 text-sm mt-0.5">
                          {new Date(app.offer.joiningDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500">Offer Expiry</span>
                        <div className="font-bold text-slate-900 text-sm mt-0.5">
                          {new Date(app.offer.expiryDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {app.offer.status === 'SENT' && (
                      <div className="pt-3 border-t border-amber-200/80">
                        {respondingOfferId === app.offer.id ? (
                          <div className="space-y-3">
                            <textarea
                              rows={2}
                              value={offerNotes}
                              onChange={(e) => setOfferNotes(e.target.value)}
                              placeholder="Add optional acceptance or response comments..."
                              className="w-full px-3 py-2 text-xs rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-white"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleOfferResponse(app.offer.id, 'ACCEPTED')}
                                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition"
                              >
                                Accept & Join Team 🎉
                              </button>
                              <button
                                onClick={() => handleOfferResponse(app.offer.id, 'DECLINED')}
                                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700 transition"
                              >
                                Decline Offer
                              </button>
                              <button
                                onClick={() => setRespondingOfferId(null)}
                                className="px-3 py-2 text-xs text-slate-600 hover:underline"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setRespondingOfferId(app.offer.id)}
                            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition shadow-sm"
                          >
                            Review & Respond to Offer &rarr;
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
