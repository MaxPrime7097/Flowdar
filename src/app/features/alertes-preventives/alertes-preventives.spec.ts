import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertesPreventives } from './alertes-preventives';

describe('AlertesPreventives', () => {
  let component: AlertesPreventives;
  let fixture: ComponentFixture<AlertesPreventives>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertesPreventives],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertesPreventives);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
