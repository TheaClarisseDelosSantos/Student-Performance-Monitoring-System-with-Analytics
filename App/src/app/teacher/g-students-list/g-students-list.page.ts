import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostProvider } from 'src/app/providers/post-provider';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-g-students-list',
  templateUrl: './g-students-list.page.html',
  styleUrls: ['./g-students-list.page.scss'],
})
export class GStudentsListPage implements OnInit {
  students: any[] = [];
  subjectId: string = '';
  sectionId: string = '';
  selectedSection: any = null;
  selectedQuarter: string = 'First Quarter';
  subjects: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private postPvdr: PostProvider,
    private alert: AlertController
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.subjectId = params['subjectId'];
      this.sectionId = params['sectionId'];
      const studentsParam = params['students'];
      this.students = studentsParam ? JSON.parse(studentsParam) : [];
      console.log('params:', { subjectId: this.subjectId, sectionId: this.sectionId });
      console.log('Students:', this.students);

      this.fetchSectionDetails(this.sectionId);
    });
  }

  fetchSectionDetails(sectionId: string) {
    const body = {
      aksi: 'get_section_details',
      sectionId: sectionId,
    };

    this.postPvdr.postData(body, 'server_api/file_aksi.php').subscribe(
      (response: any) => {
        console.log('Section Details Response:', response);
        this.selectedSection = {
          gradelevel: response.gradelevel,
          sectionname: response.sectionname,
        };
      },
      (error: any) => {
        console.error('Section Details Error:', error);
      }
    );
  }

  filterByQuarter() {
    // Implement filtering logic based on the selected quarter
    console.log('Selected Quarter:', this.selectedQuarter);
  }

  toggleAccordion(student: any) {
    student.showInput = !student.showInput;
  
    if (student.showInput && !student.subjects) {
      this.fetchSubjects(student.student_id);
      student.subjects = [];
    }
  
    if (student.showInput) {
      // Get the student ID of the selected accordion
      const studentId = student.student_id;
      console.log('Selected Student ID:', studentId);
    }
  }
  
  fetchSubjects(studentId: string) {
    const body = {
      aksi: 'getg_subjects',
      studentId: studentId,
    };
  
    this.postPvdr.postData(body, 'server_api/file_aksi.php').subscribe(
      (response: any) => {
        console.log('Subjects Response:', response);
        const student = this.students.find((s) => s.student_id === studentId);
        if (student) {
          student.subjects = response.subjects.map((subject: any) => {
            const existingGrade = student.subjects.find((s: any) => s.subject_id === subject.subject_id);
            return {
              subject_id: subject.subject_id,
              subject_name: subject.subject_name,
              grade: existingGrade ? existingGrade.grade : '',
              remarks: existingGrade ? existingGrade.remarks : '',
            };
          });
        }
  
        // Call fetchGrades after subjects are fetched
        this.fetchGrades(studentId);
      },
      (error: any) => {
        console.error('Subjects Error:', error);
      }
    );
  }
  
  
  fetchGrades(studentId: string) {
    const body = {
      aksi: 'getg_grades',
      studentId: studentId,
      quarter: this.selectedQuarter,
    };
  
    this.postPvdr.postData(body, 'server_api/file_aksi.php').subscribe(
      (response: any) => {
        console.log('Grades Response:', response);
        const student = this.students.find((s) => s.student_id === studentId);
        if (student) {
          student.subjects.forEach((subject: any) => {
            const grade = response.grades.find((g: any) => g.subject === subject.subject_name);
            if (grade) {
              subject.grade_id = grade.grade_id;
              subject.grade = grade.grade;
              subject.remarks = grade.remark;
            }
          });
        } else {
          console.error('No grades found for the student');
        }
        console.log('Updated Students:', this.students); // Add this line
      },
      (error: any) => {
        console.error('Grades Error:', error);
      }
    );
  }
  
  saveTasks(student: any) {
    const studentId = student.student_id;
    const gradesToSave: any[] = [];
  
    for (const subject of student.subjects) {
      if (subject.grade) {
        const gradesBody = {
          aksi: 'get_subject_id',
          subjectName: subject.subject_name,
        };
  
        this.postPvdr.postData(gradesBody, 'server_api/file_aksi.php').subscribe(
          (response: any) => {
            console.log('Get Subject ID Response:', response);
            const subjectId = response.subjectId;
  
            const gradeData = {
              studentId: studentId,
              subjectId: subjectId,
              grade: subject.grade,
            };
  
            gradesToSave.push(gradeData);
  
            if (gradesToSave.length === student.subjects.length) {
              console.log('Grades to Save:', gradesToSave);
              this.saveGrades(studentId, gradesToSave);
            }
          },
          (error: any) => {
            console.error('Get Subject ID Error:', error);
          }
        );
      }
    }
  
    if (gradesToSave.length === 0) {
      console.error('No grades found for the student');
    } else {
      console.log('Grades to Save:', gradesToSave);
      this.saveGrades(studentId, gradesToSave);
    }
  }
  
  saveGrades(studentId: string, gradesToSave: any[]) {
    const savePromises = gradesToSave.map((gradeData) => {
      const subjectId = gradeData.subjectId;
      const grade = gradeData.grade;
  
      const saveGradeBody = {
        aksi: 'add_grades',
        quarter: this.selectedQuarter, // Add quarter parameter
        grades: [
          {
            studentId: studentId,
            subjectId: subjectId,
            grade: grade,
          },
        ],
      };
  
      return this.postPvdr.postData(saveGradeBody, 'server_api/file_aksi.php').toPromise();
    });
  
    Promise.all(savePromises)
      .then((responses: any[]) => {
        console.log('Add Grades Responses:', responses);
        const saveSuccess = responses.every((res) => res.status === 'success');
        if (saveSuccess) {
          this.fetchGrades(studentId); // Fetch grades again after successful addition
        } else {
          throw new Error('Failed to save grades');
        }
      })
      .catch((error: any) => {
        console.error('Save Grades Error:', error);
      });
  }
  
  
  
  
  
  
  
  
  

  
  
  
 
}
