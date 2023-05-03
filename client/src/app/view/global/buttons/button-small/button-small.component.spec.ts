import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonSmallComponent } from './button-small.component';

describe('ButtonSmallComponent', () => {
  let component: ButtonSmallComponent;
  let fixture: ComponentFixture<ButtonSmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonSmallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
