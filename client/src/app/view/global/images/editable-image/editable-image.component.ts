import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResourceType } from 'src/app/enums/resources/type';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-editable-image',
    templateUrl: './editable-image.component.html',
    styleUrls: ['./editable-image.component.scss'],
})
export class EditableImageComponent implements OnInit {

    @Input() image!: string;
    @Output() change: EventEmitter<string> = new EventEmitter<string>();

    apiUrl = environment.serverUrl + environment.apiPath;

    constructor(private resources: ResourcesService) {}

    ngOnInit(): void {}

    import() {
        console.log('import image');
        this.emitChanges();
    }

    browse() {
        this.resources.browse(ResourceType.Image).then((image: any) => {
            if (!image) return;
            this.image = image.href;
            this.emitChanges();
        });
    }

    emitChanges() {
        this.change.emit(this.image);
    }
}
