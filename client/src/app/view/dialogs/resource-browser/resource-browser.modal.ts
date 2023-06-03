import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ResourceType } from 'src/app/enums/resources/type';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';
import { SelectionService } from 'src/app/services/selection-service/selection.service';
import { FileData } from 'src/app/types/resources/file-data';

@Component({
    selector: 'app-resource-browser',
    templateUrl: './resource-browser.modal.html',
    styleUrls: ['./resource-browser.modal.scss'],
})
export class ResourceBrowserModal implements OnInit {

    type: ResourceType | null = null;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<ResourceBrowserModal>,
        public resourceService: ResourcesService,
        public selectionService: SelectionService
    ) {}

    ngOnInit(): void {
        if (this.data) this.type = this.data.type || null;

        this.selectionService.init(this.resourceService.getResources(this.type), false);
    }

    select(file: FileData, event: any, rightClick: boolean = false) {
        this.selectionService.handleSelect(event, file, rightClick);
    }

    close() {
        const file = this.selectionService.getSelection()[0];
        this.dialogRef.close(file);
    }
}
