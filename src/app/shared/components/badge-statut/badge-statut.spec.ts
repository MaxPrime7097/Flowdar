import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeStatut } from './badge-statut';

describe('BadgeStatut', () => {
  let component: BadgeStatut;
  let fixture: ComponentFixture<BadgeStatut>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeStatut],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeStatut);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
