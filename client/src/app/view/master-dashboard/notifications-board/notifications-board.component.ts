import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications-board',
  templateUrl: './notifications-board.component.html',
  styleUrls: ['./notifications-board.component.scss'],
})
export class NotificationsBoardComponent implements OnInit {
  @Input() target!: any;
  @Input() disabled: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  importIcon() {
    console.log('importIcon');
  }

  browseGallery() {
    console.log('browseGallery');
  }

  test() {
    console.log('test');
  }

  send() {
    console.log('send');
  }
}
