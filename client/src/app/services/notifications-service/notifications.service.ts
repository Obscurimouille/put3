import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class NotificationsService {
    private _permission: string = 'default';

    constructor() {}

    public init() {
        this.askPermission();
    }

    public get permission() {
        return this._permission;
    }

    private askPermission(): Promise<NotificationPermission> {
        return new Promise((resolve, reject) => {
            // This browser does not support desktop notifications
            if (!('Notification' in window)) {
                return reject('Unsupported');
            }
            // Notification permission already granted
            if (Notification.permission === 'granted') {
                return resolve(Notification.permission);
            }
            // Request permission
            if (Notification.permission !== 'denied') {
                Notification.requestPermission().then((permission) => {
                    // Notification permission granted
                    if (permission === 'granted') return resolve(permission);
                    // Notification permission denied
                    return reject('Denied');
                });
            }

            // Permission denied
            reject('Denied');
        });
    }

    private checkPermission() {
        return Notification.permission === 'granted';
    }

    public create(title: string, message: string = '', icon: string = '', image: string = '', duration: number = 5000) {
        // Check permissions
        if (!this.checkPermission()) return;

        // Create notification
        const notification = new Notification(title, {
            body: message,
            icon,
            image,
            requireInteraction: duration == 0,
        });

        // Close notification after duration
        if (duration) {
            setTimeout(() => {
                notification.close();
            }, duration);
        }
    }
}
