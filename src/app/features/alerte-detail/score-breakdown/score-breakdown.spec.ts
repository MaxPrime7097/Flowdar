import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreBreakdown } from './score-breakdown';

describe('ScoreBreakdown', () => {
  let component: ScoreBreakdown;
  let fixture: ComponentFixture<ScoreBreakdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreBreakdown],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreBreakdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
