'use client';

import React, { useState, useEffect } from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { api } from '@/lib/api';
import {
  Gift,
  Plus,
  CheckCircle2,
  Send,
  Clock,
  DollarSign,
  Calendar,
} from 'lucide-react';

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New offer form state
  const [selectedAppId, setSelectedAppId] = useState('');
  const [baseSalary, setBaseSalary] = useState(140000);
  const [bonus, setBonus] = useState(15000);
  const [equity, setEquity] = useState('0.15% stock options over 4 years');
  const [joiningDate, setJoiningDate] = useState('2026-12-15');
  const [expiryDate, setExpiryDate] = useState('2026-12-05');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [offerList, appList] = await Promise.all([
        api.getOffers(),
        api.getAllApplications(),
      ]);
      setOffers(offerList || []);
      setApplications(appList || []);
      if (appList?.length > 0) setSelectedAppId(appList[0].id);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createOffer({
        applicationId: selectedAppId,
        baseSalary: Number(baseSalary),
        bonus: Number(bonus),
        equity,
        joiningDate: new Date(joiningDate).toISOString(),
        expiryDate: new Date(expiryDate).toISOString(),
      });
      setShowCreateModal(false);
      loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (offerId: string, status: string) => {
    try {
      await api.updateOfferStatus(offerId, status);
      loadData();
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
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Offer & Hiring Management</h1>
            <p className="text-xs text-slate-500 mt-1">Generate formal job offers, handle approvals, and convert candidates into employees.</p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs hover:bg-brand-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Generate New Offer
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading offers...</div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Candidate & Role</th>
                    <th className="px-6 py-3.5">Compensation</th>
                    <th className="px-6 py-3.5">Joining Date</th>
                    <th className="px-6 py-3.5">Offer Expiry</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Workflow Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {offers.map((offer) => (
                    <tr key={offer.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">
                          {offer.application?.candidate?.user?.firstName} {offer.application?.candidate?.user?.lastName}
                        </div>
                        <div className="text-[11px] text-slate-400">{offer.application?.job?.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">${offer.baseSalary?.toLocaleString()} / yr</div>
                        <div className="text-[11px] text-slate-500">Bonus: ${offer.bonus?.toLocaleString() || 0}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">
                        {new Date(offer.joiningDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(offer.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            offer.status === 'ACCEPTED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : offer.status === 'SENT'
                              ? 'bg-amber-100 text-amber-800'
                              : offer.status === 'APPROVED'
                              ? 'bg-blue-100 text-blue-800'
                              : offer.status === 'DECLINED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {offer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {offer.status === 'DRAFT' && (
                            <button
                              onClick={() => handleUpdateStatus(offer.id, 'APPROVED')}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold"
                            >
                              Approve
                            </button>
                          )}
                          {(offer.status === 'APPROVED' || offer.status === 'DRAFT') && (
                            <button
                              onClick={() => handleUpdateStatus(offer.id, 'SENT')}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-xs"
                            >
                              <Send className="w-3 h-3" />
                              Send to Candidate
                            </button>
                          )}
                          {offer.status === 'ACCEPTED' && (
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Converted to Employee
                            </span>
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

        {/* Generate Offer Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="text-base font-bold text-slate-900">Generate Formal Job Offer</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-400 font-bold">&times;</button>
              </div>

              <form onSubmit={handleCreateOffer} className="space-y-4 text-xs">
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
                    <label className="block font-semibold text-slate-700 mb-1">Base Salary ($)</label>
                    <input
                      type="number"
                      required
                      value={baseSalary}
                      onChange={(e) => setBaseSalary(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Performance Bonus ($)</label>
                    <input
                      type="number"
                      value={bonus}
                      onChange={(e) => setBonus(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Equity & Options</label>
                  <input
                    type="text"
                    value={equity}
                    onChange={(e) => setEquity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Joining Date</label>
                    <input
                      type="date"
                      required
                      value={joiningDate}
                      onChange={(e) => setJoiningDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Offer Expiry Date</label>
                    <input
                      type="date"
                      required
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-brand-600 text-white font-semibold shadow-sm hover:bg-brand-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Generating...' : 'Create Offer'}
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
