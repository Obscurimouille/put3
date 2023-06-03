import { Component, HostListener, OnInit } from '@angular/core';
import { Fool } from 'src/app/classes/fool';
import { ContextMenuAction } from 'src/app/enums/context-menu-action';
import { DashboardPage } from 'src/app/enums/dashboard-pages';
import { Role } from 'src/app/enums/role';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';
import { WebSocketService } from 'src/app/services/websocket-service/websocket.service';
import { ContextMenu } from 'src/app/types/context-menu';
import { MenuItem } from 'src/app/types/menu-item';

@Component({
    selector: 'app-master-dashboard-page',
    templateUrl: './master-dashboard-page.component.html',
    styleUrls: ['./master-dashboard-page.component.scss']
})
export class MasterDashboardPageComponent implements OnInit {

    selectedItem: MenuItem = {
        title: DashboardPage.Notifications
    };
    fools: Fool[] = [];
    target: Fool | undefined = undefined;
    dashboardPage = DashboardPage;

    // Context menu
    contextMenu: ContextMenu = {
        show: false,
        x: 0,
        y: 0,
        style: {
            position: 'fixed',
            top: '0px',
            left: '0px'
        },
        items: []
    };
    contextFocus: Fool | undefined = undefined;
    renaming: Fool | undefined = undefined;

    constructor(private websocket: WebSocketService, public resourceService: ResourcesService) { }

    ngOnInit(): void {
        // Update role if needed
        this.websocket.declare(Role.Master);

        this.websocket.socket.on('foolList', (list: any) => {
            this.updateFools(list);
        });
    }

    private updateFools(newList: any[]): void {
        this.fools = newList.map((fool: any) => {
            // Create a new fool object
            const foolObj = new Fool(fool);
            // Find if a fool with the same id already exists
            let existing = this.fools.find((f) => f.id === foolObj.id);
            // If it exists, keep its hitboxes
            if (existing) {
                foolObj.layout.hitboxes = existing.layout.hitboxes;
            }
            return foolObj;
        });

        this.updateTarget();
    }

    private updateTarget() {
        // If a target is defined, check if it still exists
        if (this.target && this.fools.length) {
            this.target = this.fools.find((fool) => fool.id === this.target!.id);
        }
        else this.target = undefined;
    }

    public clickFool(fool: Fool) {
        if (fool == this.renaming) return;
        this.selectTarget(fool);
        this.contextFocus = undefined;
        this.renaming = undefined;
    }

    public rightClickFool(fool: Fool, event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.contextFocus = fool;
        this.displayContextMenu(event);
    }

    private displayContextMenu(event: any) {
        this.contextMenu.show = true;

        this.contextMenu.items = [
            {
                title: "Rename",
                action: ContextMenuAction.RENAME
            }
        ];

        this.contextMenu.x = event.clientX;
        this.contextMenu.y = event.clientY;
        this.contextMenu.style.left = event.clientX + 1 + 'px';
        this.contextMenu.style.top = event.clientY + 'px';
    }

    public handleContextMenu(event: any) {
        this.contextMenu.show = false;

        switch (event.item.action) {
            case ContextMenuAction.RENAME:
                this.renaming = this.contextFocus;
                break;
        };

        this.contextFocus = undefined;
    }

    public renameFool(name: string, fool: Fool) {
        this.contextFocus = undefined;
        this.renaming = undefined;

        this.websocket.socket.emit('rename', { target: fool, name });
    }

    private selectTarget(fool: Fool) {
        this.target = this.target === fool ? undefined : fool;
    }

    public selectItem(item: MenuItem) {
        this.selectedItem = item;
    }

    @HostListener('document:click')
    documentClick(): void {
        this.contextMenu.show = false;
    }

    @HostListener('contextmenu', ['$event'])
    onRightClick(event: any) {
        this.contextMenu.show = false;
        event.preventDefault();
    }
}
