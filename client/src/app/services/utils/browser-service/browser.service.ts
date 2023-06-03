import { Injectable } from '@angular/core';
import { BrowserName } from 'src/app/enums/browser-name';
import { Theme } from 'src/app/enums/theme';
import { BrowserInfos } from 'src/app/types/browser-infos';

@Injectable({
    providedIn: 'root',
})
export class BrowserService {

    constructor() {}

    /**
     * Returns the browser infos
     * @returns {BrowserInfos} Browser
     */
    public getInfos(): BrowserInfos {
        return {
            name: this.getName(),
            theme: this.getTheme()
        };
    }

    /**
     * Returns the browser name
     * @returns {BrowserName} Browser name
     * @see https://www.positronx.io/angular-detect-browser-name-and-version-tutorial-example/
     */
    public getName(): BrowserName {
        const agent = window.navigator.userAgent.toLowerCase();

        switch (true) {
            case agent.indexOf('edg') > -1:
            case agent.indexOf('edge') > -1: return BrowserName.Edge;

            case agent.indexOf('opr') > -1 && !!(<any>window).opr: return BrowserName.Opera;

            case agent.indexOf('chrome') > -1 && !!(<any>window).chrome: return BrowserName.Chrome;

            case agent.indexOf('firefox') > -1: return BrowserName.Firefox;

            case agent.indexOf('safari') > -1: return BrowserName.Safari;

            case agent.indexOf('trident') > -1: return BrowserName.IE;

            default: return BrowserName.Other;
        }
    }

    /**
     * Returns the browser icon
     * @returns {string} Browser icon
     */
    public get icon(): string {
        const browser = this.getName();
        return this.toIcon(browser);
    }

    /**
     * Returns the icon of a browser passed in parameter
     * @param {Browser} browser Browser
     * @returns {string} Browser icon
     */
    public toIcon(browser: BrowserName): string {
        const dir = "assets/icons/browsers/";

        if (!browser || browser === BrowserName.Other || browser === BrowserName.IE) return '';
        return dir + browser + '.png';
    }

    /**
     * Get browser theme
     * @returns {Theme} Browser theme
     */
    public getTheme(): Theme {
        const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
        return darkThemeMq.matches ? Theme.Dark : Theme.Light;
    }
}
