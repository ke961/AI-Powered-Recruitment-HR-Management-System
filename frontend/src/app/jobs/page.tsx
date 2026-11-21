'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, JobPosting } from '@/lib/api';
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  Filter,
} from 'lucide-react';

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  useEffect(() => {
    loadJobs();
  }, [search, selectedDept]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.set('search', search);
      if (selectedDept !== 'ALL') query.set('department', selectedDept);

      const res = await api.getPublicJobs(query.toString());
      setJobs(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const departments = ['ALL', 'Engineering', 'Product & Design', 'Marketing', 'Sales'];

  return (
    <div className="flex-1 bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-8">
          <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">
            Careers & Open Vacancies
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Explore exciting career opportunities at HireFlow Tech. Apply in seconds with your resume for instant AI compatibility analysis.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by job title, skill (TypeScript, Python, Figma)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedDept === dept
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept === 'ALL' ? 'All Roles' : dept}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm">Loading open vacancies...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <div className="text-base font-semibold text-slate-800">No vacancies found</div>
            <p className="text-xs text-slate-500 mt-1">Try broadening your search keyword or department filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-brand-400 p-6 flex flex-col justify-between hover:shadow-md transition group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                      {job.department}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {job.employmentType.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition">
                    {job.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Skills badges */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {job.skills?.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills?.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-400">
                        +{job.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    <div className="flex items-center gap-1 text-slate-700 font-semibold">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      {job.salaryMin && job.salaryMax
                        ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
                        : 'Competitive'}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </div>
                  </div>

                  <Link
                    href={`/jobs/${job.slug}`}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-brand-50 text-brand-700 font-semibold text-xs group-hover:bg-brand-600 group-hover:text-white transition shadow-xs"
                  >
                    <span>View & Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
