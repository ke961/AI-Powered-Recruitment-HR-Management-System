import { AttendanceService } from './attendance.service.js';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    checkIn(userId: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        notes: string | null;
        date: Date;
        employeeId: string;
        checkIn: Date | null;
        checkOut: Date | null;
    }>;
    checkOut(userId: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        notes: string | null;
        date: Date;
        employeeId: string;
        checkIn: Date | null;
        checkOut: Date | null;
    }>;
    getTodayStatus(userId: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        notes: string | null;
        date: Date;
        employeeId: string;
        checkIn: Date | null;
        checkOut: Date | null;
    } | null>;
    getMonthlySummary(employeeId: string, month: number, year: number): Promise<{
        month: number;
        year: number;
        totalWorkingDaysLogged: number;
        presentDays: number;
        lateDays: number;
        halfDays: number;
        records: {
            id: string;
            status: string;
            createdAt: Date;
            notes: string | null;
            date: Date;
            employeeId: string;
            checkIn: Date | null;
            checkOut: Date | null;
        }[];
    }>;
    findAll(date?: string): Promise<({
        employee: {
            user: {
                email: string;
                firstName: string;
                lastName: string;
            };
        } & {
            department: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            employeeCode: string;
            designation: string;
            managerId: string | null;
            dateOfJoining: Date;
            employmentStatus: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        notes: string | null;
        date: Date;
        employeeId: string;
        checkIn: Date | null;
        checkOut: Date | null;
    })[]>;
}
