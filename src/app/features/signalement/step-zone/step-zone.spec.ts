import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepZone } from './step-zone';

describe('StepZone', () => {
  let component: StepZone;
  let fixture: ComponentFixture<StepZone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepZone],
    }).compileComponents();

    fixture = TestBed.createComponent(StepZone);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
