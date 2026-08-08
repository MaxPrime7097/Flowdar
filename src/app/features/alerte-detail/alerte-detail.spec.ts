import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlerteDetail } from './alerte-detail';

describe('AlerteDetail', () => {
  let component: AlerteDetail;
  let fixture: ComponentFixture<AlerteDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlerteDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(AlerteDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
