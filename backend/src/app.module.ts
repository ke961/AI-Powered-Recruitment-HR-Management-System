import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { JobsModule } from './modules/jobs/jobs.module.js';
import { CandidatesModule } from './modules/candidates/candidates.module.js';
import { ApplicationsModule } from './modules/applications/applications.module.js';
import { AiScreeningModule } from './modules/ai-screening/ai-screening.module.js';
import { InterviewsModule } from './modules/interviews/interviews.module.js';
import { OffersModule } from './modules/offers/offers.module.js';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { DashboardModule } from './modules/dashboard/dashboard.module.js';
import { UploadsModule } from './modules/uploads/uploads.module.js';
import { OnboardingModule } from './modules/onboarding/onboarding.module.js';
import { EmployeesModule } from './modules/employees/employees.module.js';
import { LeavesModule } from './modules/leaves/leaves.module.js';
import { AttendanceModule } from './modules/attendance/attendance.module.js';
import { ReportsModule } from './modules/reports/reports.module.js';
import { ComplianceModule } from './modules/compliance/compliance.module.js';
import { SettingsModule } from './modules/settings/settings.module.js';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    JobsModule,
    CandidatesModule,
    ApplicationsModule,
    AiScreeningModule,
    InterviewsModule,
    OffersModule,
    NotificationsModule,
    DashboardModule,
    UploadsModule,
    OnboardingModule,
    EmployeesModule,
    LeavesModule,
    AttendanceModule,
    ReportsModule,
    ComplianceModule,
    SettingsModule,
  ],
})
export class AppModule {}
