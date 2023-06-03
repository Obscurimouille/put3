import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class WindowService {

    constructor() {}

    public getWindowHeight() {
        return window.innerHeight;
    }

    public getWindowWidth() {
        return window.innerWidth;
    }

    public getWindowRatio() {
        return this.getWindowWidth() / this.getWindowHeight();
    }

    public getWindowSize() {
        return {
            width: this.getWindowWidth(),
            height: this.getWindowHeight(),
            ratio: this.getWindowRatio()
        }
    }
}
