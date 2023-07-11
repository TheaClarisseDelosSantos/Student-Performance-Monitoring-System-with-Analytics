import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherWeeklyprogPage } from './teacher-weeklyprog.page';

describe('TeacherWeeklyprogPage', () => {
  let component: TeacherWeeklyprogPage;
  let fixture: ComponentFixture<TeacherWeeklyprogPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TeacherWeeklyprogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
