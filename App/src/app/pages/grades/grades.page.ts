import { Component, OnInit } from '@angular/core';
import { PostProvider } from 'src/app/providers/post-provider';
import { Storage } from '@ionic/storage';
 
@Component({
  selector: 'app-grades',
  templateUrl: './grades.page.html',
  styleUrls: ['./grades.page.scss'],
})
export class GradesPage implements OnInit {
  selectedQuarter: string = '';
  grades: any[] = [];
  averageGrade: number = 0;
  subjects: string[] = [];
  noGradesAvailable: boolean = false;
  studentId: string = '';

  constructor(private postPvdr: PostProvider, private storage: Storage) {}

  ngOnInit() {
    this.fetchSubjects();
    this.selectedQuarter = 'First Quarter';
    this.fetchUserInfo();
  }

  async fetchUserInfo() {
    const user = await this.storage.get('session_storage');
    if (user) {
      this.studentId = user.user_id;
      this.filterGrades();
    }
  }

  fetchSubjects() {
    const body = {
      aksi: 'get_subjects',
    };

    this.postPvdr.postData(body, 'server_api/file_aksi.php').subscribe(
      (response: any) => {
        console.log('Subjects Response:', response);
        this.subjects = response.subjects;
      },
      (error: any) => {
        console.error('Subjects Error:', error);
      }
    );
  }

  filterGrades() {
    if (this.selectedQuarter && this.studentId) {
      const body = {
        aksi: 'get_student_grades',
        quarter: this.selectedQuarter,
        studentId: this.studentId,
      };

      this.postPvdr.postData(body, 'server_api/file_aksi.php').subscribe(
        (response: any) => {
          console.log('Grades Response:', response);
          this.grades = response.grades;
          this.calculateAverageGrade();

          if (this.grades.length === 0) {
            this.noGradesAvailable = true;
          } else {
            this.noGradesAvailable = false;
          }
        },
        (error: any) => {
          console.error('Grades Error:', error);
        }
      );
    }
  }

  calculateAverageGrade() {
    let totalGrade = 0;
  
    for (let grade of this.grades) {
      totalGrade += parseFloat(grade.grade);
    }
  
    if (this.grades.length > 0) {
      const average = totalGrade / this.grades.length;
      this.averageGrade = parseFloat(average.toFixed(2));
    } else {
      this.averageGrade = 0;
    }
  }
  
  ionViewWillEnter() {}
}
