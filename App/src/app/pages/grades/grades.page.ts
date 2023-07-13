import { Component, OnInit } from '@angular/core';
import { PostProvider } from 'src/app/providers/post-provider';

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

  constructor(private postPvdr: PostProvider) { }

  ngOnInit() {
    this.fetchSubjects();
    this.selectedQuarter = "First Quarter";
    this.filterGrades();
  }

  fetchSubjects(){
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
    if (this.selectedQuarter) {
      const body = {
        aksi: 'get_grades',
        quarter: this.selectedQuarter,
      };
  
      this.postPvdr.postData(body, 'server_api/file_aksi.php').subscribe(
        (response: any) => {
          console.log('Grades Response:', response);
          this.grades = response.grades;
          this.calculateAverageGrade();
  
          if (this.grades.length === 0) {
            this.noGradesAvailable = true; // Flag to indicate no grades available
          } else {
            this.noGradesAvailable = false; // Reset the flag
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
      this.averageGrade = totalGrade / this.grades.length;
    } else {
      this.averageGrade = 0;
    }
  }
  
  ionViewWillEnter(){
    
  }

}
