import { LeavesService } from './leaves.service.js';
import { CreateLeaveRequestDto, ReviewLeaveRequestDto } from './dto/create-leave.dto.js';
export declare class LeavesController {
    private readonly leavesService;
    constructor(leavesService: LeavesService);
    apply(userId: string, dto: CreateLeaveRequestDto): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        rejectionReason: string | null;
        employeeId: string;
        leaveType: string;
        startDate: Date;
        endDate: Date;
        reason: string;
        daysCount: number;
        approvedById: string | null;
    }>;
    getMyLeaves(userId: string): Promise<{
        balance: {
            id: string;
            year: number;
            employeeId: string;
            annualAllowed: number;
            annualUsed: number;
            sickAllowed: number;
            sickUsed: number;
            casualAllowed: number;
            casualUsed: number;
        } | {
            annualAllowed: number;
            annualUsed: number;
            sickAllowed: number;
            sickUsed: number;
            casualAllowed: number;
            casualUsed: number;
        };
        requests: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            rejectionReason: string | null;
            employeeId: string;
            leaveType: string;
            startDate: Date;
            endDate: Date;
            reason: string;
            daysCount: number;
            approvedById: string | null;
        }[];
    }>;
    findAll(status?: string): Promise<({
        employee: {
            user: {
                email: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
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
        updatedAt: Date;
        rejectionReason: string | null;
        employeeId: string;
        leaveType: string;
        startDate: Date;
        endDate: Date;
        reason: string;
        daysCount: number;
        approvedById: string | null;
    })[]>;
    review(id: string, userId: string, dto: ReviewLeaveRequestDto): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        rejectionReason: string | null;
        employeeId: string;
        leaveType: string;
        startDate: Date;
        endDate: Date;
        reason: string;
        daysCount: number;
        approvedById: string | null;
    }>;
}
