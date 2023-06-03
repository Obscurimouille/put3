import { Component, Input, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications-service/notifications.service';
import { WebSocketService } from 'src/app/services/websocket-service/websocket.service';
import { environment } from 'src/environments/environment';
import { NotificationData } from 'src/app/types/notification-data';

@Component({
    selector: 'app-notifications-board',
    templateUrl: './notifications-board.component.html',
    styleUrls: ['./notifications-board.component.scss'],
})
export class NotificationsBoardComponent implements OnInit {
    @Input() target!: any;
    @Input() disabled: boolean = false;

    notification!: NotificationData;

    apiUrl = environment.serverUrl + environment.apiPath;

    constructor(private notificationsService: NotificationsService, private websocket: WebSocketService) {}

    ngOnInit(): void {
        this.reset();
    }

    reset() {
        this.notification = {
            title: '',
            message: '',
            icon: '',
            image: 'resources/images/ananas-maigrir.jpg'
        }
    }

    preview() {
        this.notificationsService.create(
            this.notification.title,
            this.notification.message,
            this.notification.icon ? this.apiUrl + '/' + this.notification.icon : '',
            this.notification.image ? this.apiUrl + '/' + this.notification.image : '',
            5000
        );
    }

    send() {
        this.websocket.socket.emit('action', {
        target: this.target,
            action: {
                type: 'notification',
                title: this.notification.title,
                message: this.notification.message,
                icon: this.notification.icon,
                image: this.notification.image,
            }
        });
    }
}
