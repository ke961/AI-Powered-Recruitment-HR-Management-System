export var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["RECRUITER"] = "RECRUITER";
    Role["HIRING_MANAGER"] = "HIRING_MANAGER";
    Role["CANDIDATE"] = "CANDIDATE";
})(Role || (Role = {}));
export var ApplicationStage;
(function (ApplicationStage) {
    ApplicationStage["APPLIED"] = "APPLIED";
    ApplicationStage["SCREENING"] = "SCREENING";
    ApplicationStage["SHORTLISTED"] = "SHORTLISTED";
    ApplicationStage["INTERVIEW"] = "INTERVIEW";
    ApplicationStage["OFFER"] = "OFFER";
    ApplicationStage["HIRED"] = "HIRED";
    ApplicationStage["REJECTED"] = "REJECTED";
    ApplicationStage["WITHDRAWN"] = "WITHDRAWN";
})(ApplicationStage || (ApplicationStage = {}));
export var JobStatus;
(function (JobStatus) {
    JobStatus["DRAFT"] = "DRAFT";
    JobStatus["PUBLISHED"] = "PUBLISHED";
    JobStatus["CLOSED"] = "CLOSED";
})(JobStatus || (JobStatus = {}));
export var EmploymentType;
(function (EmploymentType) {
    EmploymentType["FULL_TIME"] = "FULL_TIME";
    EmploymentType["PART_TIME"] = "PART_TIME";
    EmploymentType["CONTRACT"] = "CONTRACT";
    EmploymentType["INTERNSHIP"] = "INTERNSHIP";
    EmploymentType["REMOTE"] = "REMOTE";
})(EmploymentType || (EmploymentType = {}));
export var ExperienceLevel;
(function (ExperienceLevel) {
    ExperienceLevel["ENTRY"] = "ENTRY";
    ExperienceLevel["MID"] = "MID";
    ExperienceLevel["SENIOR"] = "SENIOR";
    ExperienceLevel["LEAD"] = "LEAD";
    ExperienceLevel["EXECUTIVE"] = "EXECUTIVE";
})(ExperienceLevel || (ExperienceLevel = {}));
export var InterviewType;
(function (InterviewType) {
    InterviewType["SCREENING"] = "SCREENING";
    InterviewType["TECHNICAL"] = "TECHNICAL";
    InterviewType["BEHAVIORAL"] = "BEHAVIORAL";
    InterviewType["HR"] = "HR";
    InterviewType["FINAL"] = "FINAL";
})(InterviewType || (InterviewType = {}));
export var InterviewStatus;
(function (InterviewStatus) {
    InterviewStatus["SCHEDULED"] = "SCHEDULED";
    InterviewStatus["COMPLETED"] = "COMPLETED";
    InterviewStatus["CANCELLED"] = "CANCELLED";
    InterviewStatus["RESCHEDULED"] = "RESCHEDULED";
})(InterviewStatus || (InterviewStatus = {}));
export var Recommendation;
(function (Recommendation) {
    Recommendation["STRONG_HIRE"] = "STRONG_HIRE";
    Recommendation["HIRE"] = "HIRE";
    Recommendation["NEUTRAL"] = "NEUTRAL";
    Recommendation["NO_HIRE"] = "NO_HIRE";
    Recommendation["STRONG_NO_HIRE"] = "STRONG_NO_HIRE";
})(Recommendation || (Recommendation = {}));
export var OfferStatus;
(function (OfferStatus) {
    OfferStatus["DRAFT"] = "DRAFT";
    OfferStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    OfferStatus["APPROVED"] = "APPROVED";
    OfferStatus["SENT"] = "SENT";
    OfferStatus["ACCEPTED"] = "ACCEPTED";
    OfferStatus["DECLINED"] = "DECLINED";
    OfferStatus["EXPIRED"] = "EXPIRED";
})(OfferStatus || (OfferStatus = {}));
export var HumanReviewStatus;
(function (HumanReviewStatus) {
    HumanReviewStatus["PENDING"] = "PENDING";
    HumanReviewStatus["APPROVED"] = "APPROVED";
    HumanReviewStatus["OVERRIDDEN"] = "OVERRIDDEN";
})(HumanReviewStatus || (HumanReviewStatus = {}));
export var NotificationType;
(function (NotificationType) {
    NotificationType["APPLICATION_UPDATE"] = "APPLICATION_UPDATE";
    NotificationType["INTERVIEW_SCHEDULED"] = "INTERVIEW_SCHEDULED";
    NotificationType["OFFER_STATUS"] = "OFFER_STATUS";
    NotificationType["SYSTEM"] = "SYSTEM";
})(NotificationType || (NotificationType = {}));
//# sourceMappingURL=index.js.map