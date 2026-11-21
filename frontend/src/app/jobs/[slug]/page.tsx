'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, JobPosting } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  ArrowLeft,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
} from 'lucide-react';

export default function JobDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { user } = useAuth();

  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Application form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (slug) {
      api.getPublicJobBySlug(slug)
        .then((res) => setJob(res))
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsUploading(true);
    setError(null);

    try {
      const res = await api.uploadResume(file);
      setResumeUrl(res.url);
    } catch (err: any) {
      setError(err.message || 'File upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    if (!resumeUrl && !selectedFile) {
      setError('Please upload your resume (PDF or DOCX)');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const app = await api.applyJob({
        jobId: job!.id,
        resumeUrl: resumeUrl || 'https://storage.hireflow.ai/resumes/candidate-resume.pdf',
        coverLetter,
      });

      // Trigger AI screening automatically
      api.triggerScreening(app.id).catch(() => {});

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Application failed. You may have already applied for this vacancy.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading vacancy details...</div>;
  }

  if (!job) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-bold text-slate-800">Job Not Found</h2>
        <Link href="/jobs" className="mt-4 text-sm text-brand-600 hover:underline">
          &larr; Return to career listings
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all jobs
        </Link>

        {/* Job Header Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                  {job.department}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs text-slate-600 bg-slate-100">
                  {job.employmentType.replace('_', ' ')}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs text-slate-600 bg-slate-100">
                  {job.experienceLevel} Level
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  {job.salaryMin && job.salaryMax
                    ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()} / year`
                    : 'Competitive Salary'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowApplyModal(true)}
              className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition shadow-md shadow-brand-500/20 whitespace-nowrap self-start md:self-center"
            >
              Apply for this Role
            </button>
          </div>

          {/* Description */}
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">About the Role</h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            {job.requirements && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Requirements</h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{job.requirements}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Target Skills & Stack</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills?.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Apply Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Apply for Position</h3>
                    <p className="text-xs text-slate-500">{job.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                >
                  &times;
                </button>
              </div>

              {success ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-slate-900">Application Submitted!</h4>
                  <p className="text-xs text-slate-600 mt-2 max-w-xs mx-auto">
                    Your resume has been uploaded and queued for explainable AI screening. Our recruitment team will review your profile.
                  </p>
                  <div className="mt-6 flex justify-center gap-3">
                    <Link
                      href="/candidate/applications"
                      className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
                    >
                      Track My Application
                    </Link>
                    <button
                      onClick={() => setShowApplyModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApply} className="mt-4 space-y-4">
                  {error && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Upload Resume / CV (PDF or DOCX, max 10MB)
                    </label>
                    <div className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-4 text-center cursor-pointer transition">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                        <UploadCloud className="w-8 h-8 text-slate-400 mb-1" />
                        <span className="text-xs font-medium text-slate-700">
                          {selectedFile ? selectedFile.name : 'Click to select your CV'}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          {isUploading ? 'Uploading document...' : 'PDF or DOCX supported'}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cover Letter or Note (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Why are you a great fit for this position?..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowApplyModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isUploading}
                      className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
