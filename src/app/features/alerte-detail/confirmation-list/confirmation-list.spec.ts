import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationList } from './confirmation-list';

describe('ConfirmationList', () => {
  let component: ConfirmationList;
  let fixture: ComponentFixture<ConfirmationList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationList],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
