import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepRecap } from './step-recap';

describe('StepRecap', () => {
  let component: StepRecap;
  let fixture: ComponentFixture<StepRecap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepRecap],
    }).compileComponents();

    fixture = TestBed.createComponent(StepRecap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
