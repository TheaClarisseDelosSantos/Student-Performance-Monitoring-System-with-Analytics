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
}
