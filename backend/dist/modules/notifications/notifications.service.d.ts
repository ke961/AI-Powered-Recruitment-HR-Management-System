import { PrismaService } from '../../prisma/prisma.service.js';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserNotifications(userId: string): Promise<{
        type: string;
        title: string;
        id: string;
        createdAt: Date;
        link: string | null;
        userId: string;
        message: string;
        isRead: boolean;
    }[]>;
    markAsRead(id: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    createNotification(data: {
        userId: string;
        title: string;
        message: string;
        type?: string;
        link?: string;
    }): Promise<{
        type: string;
        title: string;
        id: string;
        createdAt: Date;
        link: string | null;
        userId: string;
        message: string;
        isRead: boolean;
    }>;
}
