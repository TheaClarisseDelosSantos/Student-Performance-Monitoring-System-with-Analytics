import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentsListPage } from './students-list.page';

describe('StudentsListPage', () => {
  let component: StudentsListPage;
  let fixture: ComponentFixture<StudentsListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StudentsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
