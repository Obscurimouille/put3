import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsBoardComponent } from './notifications-board.component';

describe('NotificationsBoardComponent', () => {
  let component: NotificationsBoardComponent;
  let fixture: ComponentFixture<NotificationsBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationsBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
