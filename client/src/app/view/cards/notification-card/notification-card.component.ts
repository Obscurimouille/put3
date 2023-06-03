import { Component, Input, OnInit } from '@angular/core';
import { Theme } from 'src/app/enums/theme';
import { NotificationData } from 'src/app/types/notification-data';
import { environment } from 'src/environments/environment';
import { ResourceType } from 'src/app/enums/resources/type';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';

@Component({
    selector: 'app-notification-card',
    templateUrl: './notification-card.component.html',
    styleUrls: ['./notification-card.component.scss'],
})
export class NotificationCardComponent implements OnInit {

    @Input() data!: NotificationData;
    @Input() theme: Theme = Theme.Light;

    constructor() {}

    ngOnInit(): void {}

    imageChanged(image: string) {
        this.data.image = image;
    }

    iconChanged(icon: string) {
        this.data.icon = icon;
    }
}
