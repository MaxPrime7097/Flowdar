import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Historique } from './historique';

describe('Historique', () => {
  let component: Historique;
  let fixture: ComponentFixture<Historique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Historique],
    }).compileComponents();

    fixture = TestBed.createComponent(Historique);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
