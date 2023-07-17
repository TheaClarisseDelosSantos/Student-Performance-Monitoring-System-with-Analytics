import { Component, OnInit } from '@angular/core';
import { PostProvider } from 'src/app/providers/post-provider';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-teacher-edit-profile',
  templateUrl: './teacher-edit-profile.page.html',
  styleUrls: ['./teacher-edit-profile.page.scss'],
})
export class TeacherEditProfilePage implements OnInit {

  
  firstName: string = "";
  middleName: string = "";
  lastName: string = "";
  address: string = "";
  phoneNumber: string = "";
  gender: string = "";
  birthdate: string = "";
  teacherData: any;
  data: any;

  constructor(
    private postPvdr: PostProvider,
    private route: ActivatedRoute,
    private authService: AuthService,
    private storage: Storage,
    private router: Router,
    private navCtrl: NavController,
    public alertController: AlertController,

  ) {}

  ngOnInit() {
    this.fetchTeacherData();
  }

  async fetchTeacherData() {
    try {
      const user = await this.storage.get('session_storage');
  
      const body = {
        aksi: 'fetch_teacher_data',
        teacherId: user.user_id,
      };
  
      this.postPvdr.postData(body, 'server_api/file_aksi.php').subscribe(
        (response: any) => {
          console.log('Teacher Data', response);
          this.teacherData = response.data;
          this.firstName = this.teacherData.firstname;
          this.middleName = this.teacherData.middlename;
          this.lastName = this.teacherData.lastname;
          this.address = this.teacherData.address;
          this.phoneNumber = this.teacherData.phone;
          this.gender = this.teacherData.gender;
          this.birthdate = this.teacherData.birthdate;
        },
        (error: any) => {
          console.error('Teacher Data Error:', error);
        }
      );
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    }
  }
  
  async saveChanges() {
    const body = {
      firstName: this.firstName,
      middleName: this.middleName,
      lastName: this.lastName,
      address: this.address,
      phoneNumber: this.phoneNumber,
      gender: this.gender,
      birthdate: this.birthdate,
      aksi: 'update_teacher_data',
      teacherId: this.teacherData.user_id,
    };
  
    this.postPvdr.postData(body, 'server_api/file_aksi.php').subscribe(
      async (response: any) => {
        console.log('Save Changes Response', response);
        if (response.success) {
          const alert = await this.alertController.create({
            header: 'Success',
            message: 'Changes made',
            buttons: ['OK']
          });
          await alert.present();
          this.router.navigate(['/teacher-tabs/teacher-tabs/teacher-profile']);

        } else {
          alert('No changes made.');
        }
      },
      (error: any) => {
        console.error('Save Changes Error:', error);
        alert('An error occurred while saving changes.');
      }
    );
  }
  

}
