import { OfferStatus } from '../../../common/enums/index.js';
export declare class CreateOfferDto {
    applicationId: string;
    baseSalary: number;
    bonus?: number;
    equity?: string;
    joiningDate: string;
    expiryDate: string;
    offerLetterUrl?: string;
}
export declare class UpdateOfferStatusDto {
    status: OfferStatus;
}
export declare class CandidateOfferResponseDto {
    decision: 'ACCEPTED' | 'DECLINED';
    comments?: string;
}
