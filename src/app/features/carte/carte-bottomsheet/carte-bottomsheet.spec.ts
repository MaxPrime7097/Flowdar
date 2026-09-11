import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteBottomsheet } from './carte-bottomsheet';

describe('CarteBottomsheet', () => {
  let component: CarteBottomsheet;
  let fixture: ComponentFixture<CarteBottomsheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteBottomsheet],
    }).compileComponents();

    fixture = TestBed.createComponent(CarteBottomsheet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
