import { Role } from '../../../common/enums/index.js';
export declare class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: Role;
}
