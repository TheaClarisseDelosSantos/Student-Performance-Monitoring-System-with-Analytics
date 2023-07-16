import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostProvider } from 'src/app/providers/post-provider';
@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.page.html',
  styleUrls: ['./students-list.page.scss'],
})
export class StudentsListPage implements OnInit {
  students: any[] = [];
  subjectId: string = '';
  sectionId: string = '';
  selectedSection: any = null;
  

  constructor(private activatedRoute: ActivatedRoute, 
    private router: Router,
    private postPvdr:PostProvider) {}

  ngOnInit() {
  this.activatedRoute.queryParams.subscribe(params => {
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

  viewStudents(event: Event, sectionId: string) {
    event.stopPropagation();
    this.router.navigate(['/students-list'], { queryParams: { subjectId: this.subjectId, sectionId: sectionId } });
  }

  toggleAccordion(student: any) {
    student.showInput = !student.showInput;
    if (student.showInput && !student.tasks) {
      student.tasks = [{}];
    }
  }
  
  addTask(student: any) {
    if (!student.tasks) {
      student.tasks = [];
    }
    student.tasks.push({});
  }

  removeTask(student: any, index: number) {
    if (student.tasks && student.tasks.length > index) {
      student.tasks.splice(index, 1);
    }
  }
  saveTasks(student: any) {
    const studentId = student.student_id;
    const tasks = student.tasks;
  
    if (tasks && Array.isArray(tasks)) {
      const tasksToSave = tasks.filter((task: any) => task.activity_name && task.score_value && task.status_value);
  
      for (const task of tasksToSave) {
        const activityName = task.activity_name;
        const score = task.score_value; 
        const status_value = task.status_value; 
  
        // Extract subjectId and sectionId from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const subjectId = urlParams.get('subjectId');
        const sectionId = urlParams.get('sectionId');
  
        if (subjectId && sectionId) {
          const activityBody = {
            aksi: 'add_activity',
            activityName: activityName,
            subjectId: subjectId,
            sectionId: sectionId,
            studentId: studentId,
            score_value: score,
            status_value: status_value,
            date: new Date().toISOString(),
          };
  
          this.postPvdr.postData(activityBody, 'server_api/file_aksi.php').subscribe(
            (response: any) => {
              console.log('Add Activity Response:', response);
            },
            (error: any) => {
              console.error('Add Activity Error:', error);
            }
          );
        } else {
          console.error('Subject ID or Section ID not found in the URL');
        }
      }
    } else {
      console.error('No tasks found for the student');
    }
  }
  

  
  
}
