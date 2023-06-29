import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeeklyprogPage } from './weeklyprog.page';

describe('WeeklyprogPage', () => {
  let component: WeeklyprogPage;
  let fixture: ComponentFixture<WeeklyprogPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WeeklyprogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
