import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Script } from 'src/app/enums/assets/scrips';
import { Role } from 'src/app/enums/role';
import { AssetsService } from 'src/app/services/assets-service/assets.service';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

    hover: Role.Master | Role.Fool | null = null;
    scripts = Script;
    role = Role;

    constructor(public assetsService: AssetsService, private router: Router) {}

    ngOnInit(): void {}

    chooseMaster() {
        this.router.navigate(['/master']);
    }

    chooseFool() {
        this.router.navigate(['/fool']);
    }

    mouseEnter(elem: Role.Master | Role.Fool) {
        this.hover = elem;
    }

    mouseLeave() {
        this.hover = null;
    }
}
