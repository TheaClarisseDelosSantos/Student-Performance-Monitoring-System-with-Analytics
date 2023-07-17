import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostProvider } from 'src/app/providers/post-provider';
import { AlertController } from '@ionic/angular';
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
    private postPvdr:PostProvider,
    private alert: AlertController) {}

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
      this.fetchActivities(student.student_id, this.subjectId);
      student.tasks = [{}];
    }
  }

  fetchActivities(studentId: string, subjectId: string) {
    const body = {
      aksi: 'get_activities',
      studentId: studentId,
      subjectId: subjectId,
    };

    this.postPvdr.postData(body, 'server_api/file_aksi.php').subscribe(
      (response: any) => {
        console.log('Activities Response:', response);
        const student = this.students.find((s) => s.student_id === studentId);
        if (student) {
          student.tasks = response.activities;
        }
      },
      (error: any) => {
        console.error('Activities Error:', error);
      }
    );
  }
  
  
  
  addTask(student: any) {
    if (!student.tasks) {
      student.tasks = [];
    }
    student.tasks.push({});
  }


  removeTask(student: any, index: number) {
    if (student.tasks && student.tasks.length > index) {
      const task = student.tasks[index];
      if (task.id) {
        const activityBody = {
          aksi: 'remove_activity',
          activityId: task.id,
        };
  
        (async () => {
          try {
            const response = await this.postPvdr.postData(activityBody, 'server_api/file_aksi.php').toPromise();
            console.log('Remove Activity Response:', response);
            const alert = await this.alert.create({
              header: 'Success',
              message: 'Activity Deleted.',
              buttons: ['OK']
            });
            await alert.present();
          } catch (error) {
            console.error('Remove Activity Error:', error);
    
          }
        })();
      }
  
      student.tasks.splice(index, 1);
    }
  }
  
  

  saveTasks(student: any) {
  const studentId = student.student_id;
  const tasks = student.tasks;

  if (tasks && Array.isArray(tasks)) {
    const tasksToSave = tasks.filter(
      (task: any) => task.activity_name && task.score_value && task.status_value
    );

    for (const task of tasksToSave) {
      const activityName = task.activity_name;
      const score = task.score_value;
      const status_value = task.status_value;

      if (task.id) {
        const activityBody = {
          aksi: 'update_activity',
          activityId: task.id,
          activityName: activityName,
          score_value: score,
          status_value: status_value,
        };

        this.postPvdr.postData(activityBody, 'server_api/file_aksi.php').subscribe(
          async (response: any) => {
            console.log('Update Activity Response:', response);
          },
          (error: any) => {
            console.error('Update Activity Error:', error);
          }
        );
      } else {
        const activityBody = {
          aksi: 'add_activity',
          activityName: activityName,
          subjectId: this.subjectId,
          sectionId: this.sectionId,
          studentId: studentId,
          score_value: score,
          status_value: status_value,
          date: new Date().toISOString(),
        };

        this.postPvdr.postData(activityBody, 'server_api/file_aksi.php').subscribe(
          async (response: any) => {
            console.log('Add Activity Response:', response);
            task.id = response.id;
            const alert = await this.alert.create({
              header: 'Success',
              message: 'Activity Added.',
              buttons: ['OK']
            });
            await alert.present();
          },
          (error: any) => {
            console.error('Add Activity Error:', error);
          }
        );
      }
    }
  } else {
    console.error('No tasks found for the student');
  }
}

  

  
  
}
