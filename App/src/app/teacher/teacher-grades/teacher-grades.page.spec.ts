import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherGradesPage } from './teacher-grades.page';

describe('TeacherGradesPage', () => {
  let component: TeacherGradesPage;
  let fixture: ComponentFixture<TeacherGradesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TeacherGradesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
