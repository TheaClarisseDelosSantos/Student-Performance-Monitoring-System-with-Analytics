import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherTabsPage } from './teacher-tabs.page';

describe('TeacherTabsPage', () => {
  let component: TeacherTabsPage;
  let fixture: ComponentFixture<TeacherTabsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TeacherTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
