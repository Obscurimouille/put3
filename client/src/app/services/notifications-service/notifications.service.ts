import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private _permission: string = '';

  constructor() {}

  public init() {
    this.getPermission();
  }

  public get permission() {
    return this._permission;
  }

  private getPermission() {
    return new Promise<string>(async (resolve, reject) => {
      const permission = await Notification.requestPermission();
      this._permission = permission;
      resolve(permission);
    });
  }

  private checkPermission() {
    return new Promise<boolean>(async (resolve, reject) => {
      this.getPermission().then((permission: string) => {
        resolve(permission == 'granted');
      });
    })
  }

  public async create(title: string, message: string = '', icon: string = '') {
    // Check permissions
    if (!await this.checkPermission()) return;

    const notification = new Notification(title, {
      body: message,
      icon: icon
    });
  }
}
