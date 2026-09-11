import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepDetails } from './step-details';

describe('StepDetails', () => {
  let component: StepDetails;
  let fixture: ComponentFixture<StepDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(StepDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
