import { Component, Input, OnInit } from '@angular/core';
import { AssetsService } from 'src/app/services/assets-service/assets.service';
import { WebSocketService } from 'src/app/services/websocket-service/websocket.service';

@Component({
  selector: 'app-soundboard',
  templateUrl: './soundboard.component.html',
  styleUrls: ['./soundboard.component.scss']
})
export class SoundboardComponent implements OnInit {

  @Input() fools: any[] = [];
  @Input() target!: any;
  @Input() disabled: boolean = false;
  volume: number = 50;

  constructor(private websocket: WebSocketService, public assetsService: AssetsService) { }

  ngOnInit(): void {
  }

  stopAll() {
    this.websocket.socket.emit('action', {
      target: this.target,
      action: {
        type: 'audio',
        stop: true
      }
    });
  }
}
