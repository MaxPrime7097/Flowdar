import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraireCarte } from './itineraire-carte';

describe('ItineraireCarte', () => {
  let component: ItineraireCarte;
  let fixture: ComponentFixture<ItineraireCarte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItineraireCarte],
    }).compileComponents();

    fixture = TestBed.createComponent(ItineraireCarte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
