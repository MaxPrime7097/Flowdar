import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeNiveau } from './badge-niveau';

describe('BadgeNiveau', () => {
  let component: BadgeNiveau;
  let fixture: ComponentFixture<BadgeNiveau>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeNiveau],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeNiveau);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
