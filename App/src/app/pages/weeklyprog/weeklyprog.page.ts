import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostProvider } from 'src/app/providers/post-provider';

@Component({
  selector: 'app-weeklyprog',
  templateUrl: './weeklyprog.page.html',
  styleUrls: ['./weeklyprog.page.scss'],
})
export class WeeklyprogPage implements OnInit {
  subjects: any[] = [];
  studentProgress: any[] = [];
  studentId: number = 0;
  subjectId: number = 0;
  sectionId: number = 0;
  openAccordions: any = {};

  constructor(private http: HttpClient, private postPvdr: PostProvider) {}

  ngOnInit() {
    this.fetchSubjects();
    this.fetchStudentProgress(this.studentId, this.subjectId, this.sectionId);
    this.initializeAccordions();

  }

  fetchSubjects() {
    const body = {
      aksi: 'get_subjects',
    };
  
    this.postPvdr.postData(body, 'server_api/file_aksi.php').subscribe(
      (response: any) => {
        console.log('Subjects Response:', response);
        this.subjects = response.subjects.map((subject: string, index: number) => {
          return { subject_id: index, subject_name: subject };
        });
      },
      (error: any) => {
        console.error('Subjects Error:', error);
      }
    );
  }
  


  initializeAccordions(){
    for (const subject of this.subjects) {
      this.openAccordions[subject.subject_id] = false;
    }
  }
  fetchStudentProgress(studentId: number, subjectId: number, sectionId: number) {
    const body = {
      aksi: 'get_student_progress',
      student_id: studentId,
      subject_id: subjectId,
      section_id: sectionId,
    };
  
    this.postPvdr.postData(body, 'server_api/file_aksi.php').subscribe(
      (response: any) => {
        console.log('Student Progress Response:', response);
        this.studentProgress = response.progress;
      },
      (error: any) => {
        console.error('Student Progress Error:', error);
      }
    );
  }
  
  

  toggleAccordion(subjectId: number) {
    console.log('Toggle Accordion:', subjectId);

    if (this.openAccordions[subjectId]) {
      this.openAccordions[subjectId] = false;
    } else {
      this.openAccordions[subjectId] = true;
    }
  }

  isAccordionOpen(subjectId: number) {
    return this.openAccordions[subjectId];
  }
}
