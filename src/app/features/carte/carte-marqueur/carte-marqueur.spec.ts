import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteMarqueur } from './carte-marqueur';

describe('CarteMarqueur', () => {
  let component: CarteMarqueur;
  let fixture: ComponentFixture<CarteMarqueur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteMarqueur],
    }).compileComponents();

    fixture = TestBed.createComponent(CarteMarqueur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
