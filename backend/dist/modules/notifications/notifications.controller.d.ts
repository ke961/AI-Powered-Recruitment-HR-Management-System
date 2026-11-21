import { NotificationsService } from './notifications.service.js';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
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
}
