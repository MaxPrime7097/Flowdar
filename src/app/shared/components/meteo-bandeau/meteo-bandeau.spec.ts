import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeteoBandeau } from './meteo-bandeau';

describe('MeteoBandeau', () => {
  let component: MeteoBandeau;
  let fixture: ComponentFixture<MeteoBandeau>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeteoBandeau],
    }).compileComponents();

    fixture = TestBed.createComponent(MeteoBandeau);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
