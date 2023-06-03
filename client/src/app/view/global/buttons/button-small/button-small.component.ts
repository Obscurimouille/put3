import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-small',
  templateUrl: './button-small.component.html',
  styleUrls: ['./button-small.component.scss']
})
export class ButtonSmallComponent implements OnInit {

  @Input() title?: string;
  @Input() icon?: string;
  @Input() disabled: boolean = false;
  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  click(event: any) {
    this.onClick.emit(event);
  }
}
