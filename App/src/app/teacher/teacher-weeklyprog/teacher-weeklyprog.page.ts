import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PostProvider } from '../../providers/post-provider';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-teacher-weeklyprog',
  templateUrl: './teacher-weeklyprog.page.html',
  styleUrls: ['./teacher-weeklyprog.page.scss'],
})
export class TeacherWeeklyprogPage implements OnInit {
  form: FormGroup;
  subjects: any[] = [];
  sections: any[] = [];
  teacherId: number | null = null;
  subjectIds: number[] = [];
  students: any[] = [];
  selectedSectionId: number = 0;
  selectedSubjectId : number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private postPvdr: PostProvider,
    private alertController: AlertController,
    private storage: Storage,
    private navCtrl: NavController,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      subjects: [''],
    });
  }

  ngOnInit() {
    this.getSubjects();
    this.fetchTeacherId();
  }

  async fetchTeacherId() {
    const user = await this.storage.get('session_storage');
    if (user) {
      this.teacherId = user.user_id;
      this.getAssignedSections();
    }
  }

  getSubjects() {
    const body = { aksi: 'get_teacher_subjects' };

    this.postPvdr.postData(body, 'server_api/file_aksi.php').subscribe(
      (response: any) => {
        console.log('Subjects Response:', response);
        this.subjects = response.subjects.map((subject: any) => ({
          subject_id: subject.subject_id,
          subjectname: subject.subject_name,
        }));

        console.log('Subjects:', this.subjects);
      },
      (error: any) => {
        console.error('Subjects Error:', error);
      }
    );
  }

  getAssignedSections() {
    const body = {
      aksi: 'get_assigned_sections',
      teacherId: this.teacherId,
    };
  
    this.postPvdr.postData(body, 'server_api/file_aksi.php').subscribe(
      (response: any) => {
        console.log('Assigned Sections Response:', response);
        this.sections = response.sections;
  
        if (response.subjects) {
          this.subjects = response.subjects;
  
          console.log('Sections:', this.sections);
          console.log('Subjects:', this.subjects);
  
          this.sections.forEach((section: any) => {
            section.subjectId = section.subject_id; // Set the subject ID for each section in the default state
          });
        }
      },
      (error: any) => {
        console.error('Assigned Sections Error:', error);
      }
    );
  }
  

  getSubjectIds() {
    const selectedSubjects = Array.isArray(this.form.value.subjects)
      ? this.form.value.subjects
      : [this.form.value.subjects];
  
    if (selectedSubjects.length === 0) {
      this.sections = [];
      return;
    }
  
    const body = {
      aksi: 'get_subject_ids',
      subjects: selectedSubjects,
    };
  
    this.postPvdr.postData(body, 'server_api/file_aksi.php').subscribe(
      (response: any) => {
        console.log('Subject IDs Response:', response);
        this.subjectIds = response.subjectIds;
        this.filterSections();
      },
      (error: any) => {
        console.error('Subject IDs Error:', error);
      }
    );
  }
  
  

  filterSections() {
    const selectedSubjectId = this.form.value.subjects;
  
    if (selectedSubjectId === '') {
      this.getAssignedSections();
    } else {
      const body = {
        aksi: 'filter_sections',
        teacherId: this.teacherId,
        subjects: [selectedSubjectId],
      };
  
      this.postPvdr.postData(body, 'server_api/file_aksi.php').subscribe(
        (response: any) => {
          console.log('Filtered Sections Response:', response);
          this.sections = response.sections;
  
          const subjectName = this.getSubjectName(selectedSubjectId);
          this.sections.forEach((section: any) => {
            section.subjectName = subjectName;
            section.subjectId = selectedSubjectId; 
          });
        },
        (error: any) => {
          console.error('Filtered Sections Error:', error);
        }
      );
    }
  }
  
  
  
  
  
  getSubjectName(subjectId: number) {
    const subject = this.subjects.find((subject: any) => subject.subject_id === subjectId);
    return subject ? subject.subjectname : '';
  }
  
  

  viewStudents(sectionId: number) {
    this.selectedSectionId = sectionId;
  
    const section = this.sections.find((section: any) => section.section_id === sectionId);
    const subjectId = section.subjectId || section.subject_id; // Use either `subjectId` or `subject_id` based on the availability
  
    const body = {
      aksi: "get_students_by_section_subject",
      sectionId: this.selectedSectionId,
      subjectId: subjectId,
    };
  
    this.postPvdr.postData(body, "server_api/file_aksi.php").subscribe(
      (response: any) => {
        console.log('Students Response:', response);
        this.students = response.students;
  
        const queryParams: NavigationExtras = {
          queryParams: {
            subjectId: subjectId,
            sectionId: this.selectedSectionId,
            students: JSON.stringify(this.students)
          }
        };
  
        this.router.navigate(['/students-list'], queryParams);
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }
  
  
  
  
  
  
  
  
  
  
  
}
