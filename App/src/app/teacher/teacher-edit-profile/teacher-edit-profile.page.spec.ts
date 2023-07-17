import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherEditProfilePage } from './teacher-edit-profile.page';

describe('TeacherEditProfilePage', () => {
  let component: TeacherEditProfilePage;
  let fixture: ComponentFixture<TeacherEditProfilePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TeacherEditProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
