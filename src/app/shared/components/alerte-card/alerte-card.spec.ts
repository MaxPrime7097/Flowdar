import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlerteCard } from './alerte-card';

describe('AlerteCard', () => {
  let component: AlerteCard;
  let fixture: ComponentFixture<AlerteCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlerteCard],
    }).compileComponents();

    fixture = TestBed.createComponent(AlerteCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
