import { Component, Input, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications-service/notifications.service';
import { WebSocketService } from 'src/app/services/websocket-service/websocket.service';

@Component({
  selector: 'app-notifications-board',
  templateUrl: './notifications-board.component.html',
  styleUrls: ['./notifications-board.component.scss'],
})
export class NotificationsBoardComponent implements OnInit {
  @Input() target!: any;
  @Input() disabled: boolean = false;

  icon: string = '';
  title: string = '';
  message: string = '';

  constructor(private notification: NotificationsService, private websocket: WebSocketService) {}

  ngOnInit(): void {}

  importIcon() {
    console.log('importIcon');
  }

  browseGallery() {
    console.log('browseGallery');
  }

  test() {
    this.notification.create(this.title, this.message, this.icon);
  }

  send() {
    this.websocket.socket.emit('action', {
      target: this.target,
      action: {
        type: 'notification',
        title: this.title,
        message: this.message,
        icon: this.icon,
      }
    });
  }
}
