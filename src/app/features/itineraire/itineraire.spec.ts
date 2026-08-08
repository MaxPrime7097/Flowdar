import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Itineraire } from './itineraire';

describe('Itineraire', () => {
  let component: Itineraire;
  let fixture: ComponentFixture<Itineraire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Itineraire],
    }).compileComponents();

    fixture = TestBed.createComponent(Itineraire);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
