export declare enum LeaveTypeEnum {
    ANNUAL = "ANNUAL",
    SICK = "SICK",
    CASUAL = "CASUAL",
    UNPAID = "UNPAID"
}
export declare class CreateLeaveRequestDto {
    leaveType: LeaveTypeEnum;
    startDate: string;
    endDate: string;
    reason: string;
}
export declare class ReviewLeaveRequestDto {
    status: 'APPROVED' | 'REJECTED';
    rejectionReason?: string;
}
