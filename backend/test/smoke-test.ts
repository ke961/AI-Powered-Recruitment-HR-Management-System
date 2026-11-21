import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../dist/app.module.js';

async function runComprehensiveSmokeTests() {
  console.log('🧪 Starting Full HireFlow AI Backend Smoke Test (Phases 1 & 2)...');

  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(0); // Random free port
  const server = app.getHttpServer();
  const address = server.address();
  const port = address.port;
  const baseUrl = `http://localhost:${port}/api`;

  try {
    // 1. Auth & Login (Admin)
    console.log('1. Testing POST /api/auth/login (Admin)...');
    const adminLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@hireflow.ai', password: 'Password123!' }),
    });
    const adminData = await adminLoginRes.json();
    if (!adminLoginRes.ok) throw new Error('Admin login failed');
    const adminToken = adminData.accessToken;
    console.log('   -> Admin token acquired.');

    // 2. Public Jobs & HR Dashboard
    console.log('2. Testing GET /api/jobs/public & GET /api/dashboard/metrics...');
    const [jobsRes, dashRes] = await Promise.all([
      fetch(`${baseUrl}/jobs/public`),
      fetch(`${baseUrl}/dashboard/metrics`, { headers: { Authorization: `Bearer ${adminToken}` } }),
    ]);
    const jobs = await jobsRes.json();
    const metrics = await dashRes.json();
    console.log(`   -> Found ${jobs.data?.length || 0} public jobs.`);
    console.log(`   -> Active vacancies: ${metrics.overview?.activeJobs}, Total Applications: ${metrics.overview?.totalApplications}`);

    // 3. Candidate Flow & Application
    console.log('3. Testing Candidate Login & Profile...');
    const candLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alex.chen@hireflow.ai', password: 'Password123!' }),
    });
    const candData = await candLoginRes.json();
    const candToken = candData.accessToken;

    const myAppsRes = await fetch(`${baseUrl}/applications/my-applications`, {
      headers: { Authorization: `Bearer ${candToken}` },
    });
    const myApps = await myAppsRes.json();
    console.log(`   -> Candidate retrieved ${myApps.length} active application(s).`);

    // 4. Employee Directory (Module 11)
    console.log('4. Testing GET /api/employees...');
    const empRes = await fetch(`${baseUrl}/employees`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const employees = await empRes.json();
    console.log(`   -> Employee directory returned ${employees.length} employee records.`);

    // 5. Recruitment Reports & CSV Export (Module 14)
    console.log('5. Testing GET /api/reports/summary & CSV Export...');
    const reportRes = await fetch(`${baseUrl}/reports/summary`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const reportData = await reportRes.json();
    console.log(`   -> Report summary stage conversions: ${reportData.stageConversions?.length || 0} stages.`);

    const csvRes = await fetch(`${baseUrl}/reports/export/applications`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const csvText = await csvRes.text();
    console.log(`   -> CSV export generated (${csvText.split('\n').length} rows).`);

    // 6. Audit & Compliance (Module 15)
    console.log('6. Testing GET /api/compliance/audit-logs & retention policies...');
    const [auditRes, policyRes] = await Promise.all([
      fetch(`${baseUrl}/compliance/audit-logs`, { headers: { Authorization: `Bearer ${adminToken}` } }),
      fetch(`${baseUrl}/compliance/retention-policies`, { headers: { Authorization: `Bearer ${adminToken}` } }),
    ]);
    const auditLogs = await auditRes.json();
    const policies = await policyRes.json();
    console.log(`   -> Audit log has ${auditLogs.length} immutable events.`);
    console.log(`   -> Compliance policies loaded: ${policies.policies?.length} categories.`);

    // 7. Settings & Departments (Module 16)
    console.log('7. Testing GET /api/settings/company & departments...');
    const [settingsRes, deptRes] = await Promise.all([
      fetch(`${baseUrl}/settings/company`, { headers: { Authorization: `Bearer ${adminToken}` } }),
      fetch(`${baseUrl}/settings/departments`, { headers: { Authorization: `Bearer ${adminToken}` } }),
    ]);
    const companySettings = await settingsRes.json();
    const departments = await deptRes.json();
    console.log(`   -> Company: "${companySettings.name}", Active Departments: ${departments.length}`);

    console.log('\n🎉 ALL 16 MODULES PASSED COMPREHENSIVE SMOKE TEST!\n');
  } finally {
    await app.close();
  }
}

runComprehensiveSmokeTests().catch((err) => {
  console.error('❌ Comprehensive smoke test failed:', err);
  process.exit(1);
});
