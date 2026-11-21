import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting HireFlow AI database seed...');

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.scorecard.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.aIAnalysis.deleteMany();
  await prisma.application.deleteMany();
  await prisma.candidateProfile.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.jobPosting.deleteMany();
  await prisma.department.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Company
  const company = await prisma.company.create({
    data: {
      name: 'HireFlow Tech Innovations',
      domain: 'hireflow.ai',
      description: 'Next-generation AI recruitment and workplace platform.',
      website: 'https://hireflow.ai',
    },
  });

  // 2. Create Departments
  const engDept = await prisma.department.create({
    data: { companyId: company.id, name: 'Engineering', description: 'Software and systems engineering' },
  });
  const designDept = await prisma.department.create({
    data: { companyId: company.id, name: 'Product & Design', description: 'Product design and UX research' },
  });

  // 3. Create Users with hashed passwords
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@hireflow.ai',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Vance',
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });

  const recruiter = await prisma.user.create({
    data: {
      email: 'recruiter@hireflow.ai',
      passwordHash,
      firstName: 'Marcus',
      lastName: 'Sterling',
      role: 'RECRUITER',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: 'manager@hireflow.ai',
      passwordHash,
      firstName: 'Elena',
      lastName: 'Rostova',
      role: 'HIRING_MANAGER',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });

  const candidate1 = await prisma.user.create({
    data: {
      email: 'alex.chen@hireflow.ai',
      passwordHash,
      firstName: 'Alex',
      lastName: 'Chen',
      role: 'CANDIDATE',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });

  const candidate2 = await prisma.user.create({
    data: {
      email: 'sophia.taylor@hireflow.ai',
      passwordHash,
      firstName: 'Sophia',
      lastName: 'Taylor',
      role: 'CANDIDATE',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });

  // 4. Create Candidate Profiles
  const profile1 = await prisma.candidateProfile.create({
    data: {
      userId: candidate1.id,
      phone: '+1 (415) 890-1234',
      location: 'San Francisco, CA',
      headline: 'Senior Full-Stack Engineer | TypeScript & Cloud Systems',
      bio: '5+ years building distributed applications using Next.js, NestJS, and PostgreSQL.',
      skills: 'TypeScript,Next.js,React,NestJS,PostgreSQL,Docker,Tailwind CSS,Redis',
      experienceYears: 5,
      resumeUrl: 'https://storage.hireflow.ai/resumes/alex-chen-cv.pdf',
      githubUrl: 'https://github.com/alexchen-dev',
      linkedinUrl: 'https://linkedin.com/in/alexchen',
    },
  });

  const profile2 = await prisma.candidateProfile.create({
    data: {
      userId: candidate2.id,
      phone: '+1 (206) 789-4321',
      location: 'Seattle, WA',
      headline: 'Lead Product Designer & Design Technologist',
      bio: 'Passionate about design systems, accessible UI, and cross-functional design sprints.',
      skills: 'Figma,UI/UX,Design Systems,React,Tailwind CSS,User Research',
      experienceYears: 4,
      resumeUrl: 'https://storage.hireflow.ai/resumes/sophia-taylor-cv.pdf',
    },
  });

  // 5. Create Job Postings
  const job1 = await prisma.jobPosting.create({
    data: {
      title: 'Senior Full-Stack Engineer',
      slug: 'senior-full-stack-engineer-acme',
      description:
        'We are seeking an experienced Full-Stack Engineer to lead development of our real-time collaboration tools. You will architect scalable backend microservices and design intuitive interfaces.',
      requirements:
        '• 4+ years experience with TypeScript and Node.js\n• Hands-on NestJS & Next.js production experience\n• Solid understanding of relational database optimization (PostgreSQL)',
      department: 'Engineering',
      location: 'San Francisco, CA / Remote',
      employmentType: 'FULL_TIME',
      experienceLevel: 'SENIOR',
      salaryMin: 130000,
      salaryMax: 165000,
      salaryCurrency: 'USD',
      skills: 'TypeScript,Next.js,NestJS,PostgreSQL,Docker,Redis',
      status: 'PUBLISHED',
      createdById: recruiter.id,
      companyId: company.id,
      departmentId: engDept.id,
    },
  });

  const job2 = await prisma.jobPosting.create({
    data: {
      title: 'AI / Machine Learning Engineer',
      slug: 'ai-machine-learning-engineer-acme',
      description:
        'Join our core AI team building semantic search and intelligent resume matching pipelines using LLMs and vector databases.',
      requirements:
        '• 3+ years experience with Python and FastAPI\n• Experience with HuggingFace, PyTorch, and NLP models\n• Production deployment experience with Docker',
      department: 'Engineering',
      location: 'Remote',
      employmentType: 'FULL_TIME',
      experienceLevel: 'MID',
      salaryMin: 140000,
      salaryMax: 175000,
      salaryCurrency: 'USD',
      skills: 'Python,FastAPI,PyTorch,Transformers,Docker,PostgreSQL',
      status: 'PUBLISHED',
      createdById: recruiter.id,
      companyId: company.id,
      departmentId: engDept.id,
    },
  });

  const job3 = await prisma.jobPosting.create({
    data: {
      title: 'Staff Product Designer',
      slug: 'staff-product-designer-acme',
      description:
        'Define design systems and end-to-end recruitment experiences for enterprise HR teams and candidates worldwide.',
      requirements:
        '• 5+ years product design experience\n• Mastery of Figma, design systems, and rapid prototyping',
      department: 'Product & Design',
      location: 'New York, NY',
      employmentType: 'FULL_TIME',
      experienceLevel: 'SENIOR',
      salaryMin: 125000,
      salaryMax: 155000,
      salaryCurrency: 'USD',
      skills: 'Figma,Design Systems,UI/UX,User Research',
      status: 'PUBLISHED',
      createdById: recruiter.id,
      companyId: company.id,
      departmentId: designDept.id,
    },
  });

  // 6. Create Applications
  const app1 = await prisma.application.create({
    data: {
      jobId: job1.id,
      candidateId: profile1.id,
      stage: 'SHORTLISTED',
      resumeUrl: profile1.resumeUrl!,
      coverLetter:
        'I have been developing full-stack web architectures for over five years with a deep focus on NestJS and Next.js. I am thrilled to apply for HireFlow AI!',
      recruiterNotes: 'Candidate has outstanding technical credentials. Proceeding to technical interview.',
    },
  });

  const app2 = await prisma.application.create({
    data: {
      jobId: job3.id,
      candidateId: profile2.id,
      stage: 'INTERVIEW',
      resumeUrl: profile2.resumeUrl!,
      coverLetter: 'Passionate about building intuitive enterprise experiences. Excited to lead the design roadmap.',
      recruiterNotes: 'Portfolio demonstrated exceptional UI craft. Scheduled technical design interview.',
    },
  });

  // 7. AI Analysis for App 1
  await prisma.aIAnalysis.create({
    data: {
      applicationId: app1.id,
      overallMatchScore: 92,
      skillsMatched: JSON.stringify(['TypeScript', 'Next.js', 'NestJS', 'PostgreSQL', 'Docker']),
      skillsMissing: JSON.stringify(['Redis']),
      experienceMatch: 'HIGH',
      strengths: JSON.stringify([
        '5+ years professional experience directly matching tech stack',
        'Demonstrated production track record with NestJS and PostgreSQL',
        'Strong cloud and containerization background',
      ]),
      redFlags: JSON.stringify([]),
      matchExplanation:
        'Alex Chen exhibits an exceptional 92% compatibility match. Holds 5 of 6 primary required skills. Extensive demonstrated architecture proficiency in the exact enterprise tech stack.',
      humanReviewStatus: 'APPROVED',
      humanReviewNotes: 'Fast-tracked by HR Recruiter.',
    },
  });

  // 8. Interview for App 2
  const interview1 = await prisma.interview.create({
    data: {
      applicationId: app2.id,
      interviewerId: manager.id,
      type: 'TECHNICAL',
      scheduledAt: new Date(Date.now() + 86400 * 2000), // In 2 days
      durationMinutes: 45,
      meetingLink: 'https://meet.google.com/hfa-team-view',
      location: 'Virtual Google Meet',
      status: 'SCHEDULED',
      notes: 'Review candidate portfolio and design system architectural leadership.',
    },
  });

  // 9. Notifications
  await prisma.notification.create({
    data: {
      userId: recruiter.id,
      title: 'New High-Match Application',
      message: 'Alex Chen applied for Senior Full-Stack Engineer with a 92% AI compatibility match.',
      type: 'APPLICATION_UPDATE',
      link: `/applications/${app1.id}`,
    },
  });

  await prisma.notification.create({
    data: {
      userId: candidate2.id,
      title: 'Interview Scheduled',
      message: 'Your Technical Interview for Staff Product Designer has been scheduled.',
      type: 'INTERVIEW_SCHEDULED',
      link: `/candidate/interviews/${interview1.id}`,
    },
  });

  // 10. Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: recruiter.id,
      applicationId: app1.id,
      action: 'APPLICATION_SHORTLISTED',
      entityType: 'Application',
      entityId: app1.id,
      details: JSON.stringify({ previousStage: 'APPLIED', newStage: 'SHORTLISTED', matchScore: 92 }),
    },
  });

  console.log('✅ HireFlow AI seed finished successfully!');
  console.log('\n--- Demo Accounts Seeded ---');
  console.log('Admin:          admin@hireflow.ai       (Pass: Password123!)');
  console.log('Recruiter:      recruiter@hireflow.ai   (Pass: Password123!)');
  console.log('Hiring Manager: manager@hireflow.ai     (Pass: Password123!)');
  console.log('Candidate 1:    alex.chen@hireflow.ai   (Pass: Password123!)');
  console.log('Candidate 2:    sophia.taylor@hireflow.ai (Pass: Password123!)');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
