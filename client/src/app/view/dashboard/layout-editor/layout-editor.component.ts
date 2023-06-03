import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ResourceType } from 'src/app/enums/resources/type';
import { DesktopService } from 'src/app/services/desktop-service/desktop.service';
import { HitboxService } from 'src/app/services/hitbox-service/hitbox.service';
import { WebSocketService } from 'src/app/services/websocket-service/websocket.service';
import { ResourceBrowserModal } from '../../dialogs/resource-browser/resource-browser.modal';
import { environment } from 'src/environments/environment';
import { Fool } from 'src/app/classes/fool';
import { Hitbox } from 'src/app/classes/hitbox';
import { FoolService } from 'src/app/services/fool-service/fool.service';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';
import { FileData } from 'src/app/types/resources/file-data';

@Component({
    selector: 'app-layout-editor',
    templateUrl: './layout-editor.component.html',
    styleUrls: ['./layout-editor.component.scss'],
})
export class LayoutEditorComponent implements OnInit {

    @ViewChild('content') content!: ElementRef;
    @ViewChild('editor') editor!: ElementRef;
    @Input() fools: Fool[] = [];
    @Input() target!: Fool | undefined;
    @Input() disabled: boolean = false;

    apiUrl = environment.serverUrl + environment.apiPath;
    defaultDesktopImage = environment.defaultDesktopImage;

    constructor(
        private foolService: FoolService,
        private dialog: MatDialog,
        private desktopService: DesktopService,
        public hitboxService: HitboxService,
        private resources: ResourcesService
    ) {}

    ngOnInit(): void {
        // Get desktop background image
        this.desktopService.getBackground().then((image) => {
            this.defaultDesktopImage = image;
        });
    }

    ngAfterViewInit(): void {
        this.hitboxService.setWindow(() => {
            return this.editor
        });
    }

    addHitbox() {
        this.target!.layout.hitboxes.push(new Hitbox());
    }

    changeBackground() {
        this.resources.browse(ResourceType.Image).then((image: any) => {
            if (!image) return;
            this.target!.layout.desktop.image = image.href;
        });
    }

    sendConfig() {
        this.foolService.sendConfig(this.target!);
    }
}
