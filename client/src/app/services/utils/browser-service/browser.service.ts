import { Injectable } from '@angular/core';
import { EnumBrowser } from 'src/app/enums/browser';

@Injectable({
    providedIn: 'root',
})
export class BrowserService {

    constructor() {}

    /**
     * Returns the browser
     * @returns {Browser} Browser
     * @see https://www.positronx.io/angular-detect-browser-name-and-version-tutorial-example/
     */
    public get(): EnumBrowser {
        const agent = window.navigator.userAgent.toLowerCase();

        switch (true) {
            case agent.indexOf('edg') > -1:
            case agent.indexOf('edge') > -1: return EnumBrowser.EDGE;

            case agent.indexOf('opr') > -1 && !!(<any>window).opr: return EnumBrowser.OPERA;

            case agent.indexOf('chrome') > -1 && !!(<any>window).chrome: return EnumBrowser.CHROME;

            case agent.indexOf('firefox') > -1: return EnumBrowser.FIREFOX;

            case agent.indexOf('safari') > -1: return EnumBrowser.SAFARI;

            case agent.indexOf('trident') > -1: return EnumBrowser.IE;

            default: return EnumBrowser.OTHER;
        }
    }

    /**
     * Returns the browser icon
     * @returns {string} Browser icon
     */
    public get icon(): string {
        const browser = this.get();
        return this.toIcon(browser);
    }

    /**
     * Returns the icon of a browser passed in parameter
     * @param {Browser} browser Browser
     * @returns {string} Browser icon
     */
    public toIcon(browser: EnumBrowser): string {
        const dir = "assets/icons/browsers/";

        if (!browser || browser === EnumBrowser.OTHER || browser === EnumBrowser.IE) return '';
        return dir + browser + '.png';
    }
}
