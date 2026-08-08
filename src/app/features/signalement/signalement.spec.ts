import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Signalement } from './signalement';

describe('Signalement', () => {
  let component: Signalement;
  let fixture: ComponentFixture<Signalement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Signalement],
    }).compileComponents();

    fixture = TestBed.createComponent(Signalement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
