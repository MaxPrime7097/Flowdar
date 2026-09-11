import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreBadge } from './score-badge';

describe('ScoreBadge', () => {
  let component: ScoreBadge;
  let fixture: ComponentFixture<ScoreBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
