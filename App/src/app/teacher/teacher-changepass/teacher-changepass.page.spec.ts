import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherChangepassPage } from './teacher-changepass.page';

describe('TeacherChangepassPage', () => {
  let component: TeacherChangepassPage;
  let fixture: ComponentFixture<TeacherChangepassPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TeacherChangepassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
