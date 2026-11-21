const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'RECRUITER' | 'HIRING_MANAGER' | 'CANDIDATE';
  status?: string;
  avatarUrl?: string;
}

export interface JobPosting {
  id: string;
  title: string;
  slug: string;
  description: string;
  requirements?: string;
  department: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  skills: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  applicationsCount?: number;
  createdAt: string;
}

export interface AIAnalysis {
  id: string;
  applicationId: string;
  overallMatchScore: number;
  skillsMatched: string[];
  skillsMissing: string[];
  experienceMatch?: string;
  strengths: string[];
  redFlags: string[];
  matchExplanation: string;
  humanReviewStatus: 'PENDING' | 'APPROVED' | 'OVERRIDDEN';
  humanReviewNotes?: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  stage: 'APPLIED' | 'SCREENING' | 'SHORTLISTED' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED' | 'WITHDRAWN';
  resumeUrl: string;
  coverLetter?: string;
  recruiterNotes?: string;
  rejectionReason?: string;
  appliedAt: string;
  updatedAt: string;
  job?: JobPosting;
  candidate?: {
    id: string;
    phone?: string;
    location?: string;
    headline?: string;
    skills?: string[];
    user: User;
  };
  aiAnalysis?: AIAnalysis;
  interviews?: any[];
  offer?: any;
  auditLogs?: any[];
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('hireflow_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMsg = `HTTP Error ${res.status}`;
    try {
      const errData = await res.json();
      errorMsg = errData.message || errData.error || errorMsg;
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }

  return res.json() as Promise<T>;
}

export const api = {
  // Auth
  login: (data: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => request<User>('/auth/me'),

  // Public Jobs
  getPublicJobs: (params: string = '') => request<{ data: JobPosting[]; meta: any }>(`/jobs/public${params ? `?${params}` : ''}`),
  getPublicJobBySlug: (slug: string) => request<JobPosting>(`/jobs/public/${slug}`),

  // HR Jobs
  getAdminJobs: (params: string = '') => request<{ data: JobPosting[]; meta: any }>(`/jobs${params ? `?${params}` : ''}`),
  createJob: (data: any) => request<JobPosting>('/jobs', { method: 'POST', body: JSON.stringify(data) }),
  updateJob: (id: string, data: any) => request<JobPosting>(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateJobStatus: (id: string, status: string) => request<JobPosting>(`/jobs/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteJob: (id: string) => request<any>(`/jobs/${id}`, { method: 'DELETE' }),

  // Applications
  applyJob: (data: { jobId: string; resumeUrl: string; coverLetter?: string }) => request<Application>('/applications/apply', { method: 'POST', body: JSON.stringify(data) }),
  getMyApplications: () => request<Application[]>('/applications/my-applications'),
  withdrawApplication: (id: string) => request<Application>(`/applications/${id}/withdraw`, { method: 'PATCH' }),
  getApplicationsByJob: (jobId: string, stage?: string) => request<Application[]>(`/applications/job/${jobId}${stage ? `?stage=${stage}` : ''}`),
  getAllApplications: (stage?: string) => request<Application[]>(`/applications${stage ? `?stage=${stage}` : ''}`),
  getApplicationDetail: (id: string) => request<Application>(`/applications/${id}`),
  updateStage: (id: string, stage: string, notes?: string, rejectionReason?: string) => request<Application>(`/applications/${id}/stage`, { method: 'PATCH', body: JSON.stringify({ stage, notes, rejectionReason }) }),
  addRecruiterNotes: (id: string, notes: string) => request<any>(`/applications/${id}/notes`, { method: 'POST', body: JSON.stringify({ notes }) }),

  // AI Screening
  triggerScreening: (applicationId: string) => request<AIAnalysis>(`/ai-screening/trigger/${applicationId}`, { method: 'POST' }),
  overrideAiAnalysis: (applicationId: string, status: string, notes?: string) => request<AIAnalysis>(`/ai-screening/${applicationId}/override`, { method: 'PATCH', body: JSON.stringify({ humanReviewStatus: status, humanReviewNotes: notes }) }),

  // Interviews
  scheduleInterview: (data: any) => request<any>('/interviews/schedule', { method: 'POST', body: JSON.stringify(data) }),
  getInterviews: (params: string = '') => request<any[]>(`/interviews${params ? `?${params}` : ''}`),
  getInterviewById: (id: string) => request<any>(`/interviews/${id}`),
  updateInterviewStatus: (id: string, status: string, notes?: string) => request<any>(`/interviews/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, notes }) }),
  submitScorecard: (interviewId: string, data: any) => request<any>(`/interviews/${interviewId}/scorecard`, { method: 'POST', body: JSON.stringify(data) }),

  // Offers
  createOffer: (data: any) => request<any>('/offers', { method: 'POST', body: JSON.stringify(data) }),
  getOffers: (status?: string) => request<any[]>(`/offers${status ? `?status=${status}` : ''}`),
  getOfferById: (id: string) => request<any>(`/offers/${id}`),
  updateOfferStatus: (id: string, status: string) => request<any>(`/offers/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  respondToOffer: (id: string, decision: 'ACCEPTED' | 'DECLINED', comments?: string) => request<any>(`/offers/${id}/respond`, { method: 'PATCH', body: JSON.stringify({ decision, comments }) }),

  // Dashboard
  getDashboardMetrics: () => request<any>('/dashboard/metrics'),

  // Notifications
  getNotifications: () => request<any[]>('/notifications'),
  markNotificationRead: (id: string) => request<any>(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request<any>('/notifications/read-all', { method: 'PATCH' }),

  // File Uploads
  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request<any>('/uploads/resume', { method: 'POST', body: formData });
  },

  // Phase 2 Modules
  getEmployees: (params: string = '') => request<any[]>(`/employees${params ? `?${params}` : ''}`),
  getEmployeeMe: () => request<any>('/employees/me'),
  getOnboarding: (employeeId: string) => request<any>(`/onboarding/employee/${employeeId}`),
  toggleOnboardingTask: (taskId: string) => request<any>(`/onboarding/task/${taskId}/toggle`, { method: 'PATCH' }),
  getMyLeaves: () => request<any>('/leaves/my-leaves'),
  applyLeave: (data: any) => request<any>('/leaves/apply', { method: 'POST', body: JSON.stringify(data) }),
  getAllLeaves: (status?: string) => request<any[]>(`/leaves${status ? `?status=${status}` : ''}`),
  reviewLeave: (id: string, status: string, rejectionReason?: string) => request<any>(`/leaves/${id}/review`, { method: 'PATCH', body: JSON.stringify({ status, rejectionReason }) }),
  checkInAttendance: () => request<any>('/attendance/check-in', { method: 'POST' }),
  checkOutAttendance: () => request<any>('/attendance/check-out', { method: 'POST' }),
  getTodayAttendance: () => request<any>('/attendance/today'),
  getReportsSummary: () => request<any>('/reports/summary'),
  getCompanySettings: () => request<any>('/settings/company'),
  updateCompanySettings: (data: any) => request<any>('/settings/company', { method: 'PATCH', body: JSON.stringify(data) }),
  getDepartments: () => request<any[]>('/settings/departments'),
  createDepartment: (data: any) => request<any>('/settings/departments', { method: 'POST', body: JSON.stringify(data) }),
  request: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, options),
  getAllAttendance: (date?: string) => request<any[]>(`/attendance${date ? `?date=${date}` : ''}`),
  initializeOnboarding: (employeeId: string) => request<any>(`/onboarding/employee/${employeeId}/initialize`, { method: 'POST' }),
  getAuditLogs: () => request<any[]>('/compliance/audit-logs'),
};
