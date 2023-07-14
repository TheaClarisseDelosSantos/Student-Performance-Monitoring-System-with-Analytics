import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PostProvider } from '../../providers/post-provider';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

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

  constructor(
    private formBuilder: FormBuilder,
    private postPvdr: PostProvider,
    private alertController: AlertController,
    private storage: Storage
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
        this.filterSections();

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
      },
      (error: any) => {
        console.error('Assigned Sections Error:', error);
      }
    );
  }

  // getSubjectIds() {
  //   const selectedSubjects = Array.isArray(this.form.value.subjects)
  //     ? this.form.value.subjects
  //     : [this.form.value.subjects];
  
  //   if (selectedSubjects.length === 0) {
  //     this.sections = [];
  //     return;
  //   }
  
  //   const body = {
  //     aksi: 'get_subject_ids',
  //     subjects: selectedSubjects,
  //   };
  
  //   this.postPvdr.postData(body, 'server_api/file_aksi.php').subscribe(
  //     (response: any) => {
  //       console.log('Subject IDs Response:', response);
  //       this.subjectIds = response.subjectIds;
  //       this.filterSections();
  //     },
  //     (error: any) => {
  //       console.error('Subject IDs Error:', error);
  //     }
  //   );
  // }
  
  

  filterSections() {
    const selectedSubjectId = this.form.value.subjects;
  
    if (!selectedSubjectId) {
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
        },
        (error: any) => {
          console.error('Filtered Sections Error:', error);
        }
      );
    }
  }
  
}
