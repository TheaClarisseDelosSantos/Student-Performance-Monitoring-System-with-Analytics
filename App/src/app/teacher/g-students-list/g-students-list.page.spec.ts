import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GStudentsListPage } from './g-students-list.page';

describe('GStudentsListPage', () => {
  let component: GStudentsListPage;
  let fixture: ComponentFixture<GStudentsListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GStudentsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
