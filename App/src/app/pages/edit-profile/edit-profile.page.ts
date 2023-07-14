import { Component, OnInit } from '@angular/core';
import { PostProvider } from 'src/app/providers/post-provider';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  firstName: string = "";
  middleName: string = "";
  lastName: string = "";
  address: string = "";
  phoneNumber: string = "";
  gender: string = "";
  birthdate: string = "";
  studentData: any;
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
    this.fetchStudentData();
  }

  async fetchStudentData() {
    try {
      const user = await this.storage.get('session_storage');
  
      const body = {
        aksi: 'fetch_student_data',
        studentId: user.user_id,
      };
  
      this.postPvdr.postData(body, 'server_api/file_aksi.php').subscribe(
        (response: any) => {
          console.log('Student Data', response);
          this.studentData = response.data;
          this.firstName = this.studentData.firstname;
          this.middleName = this.studentData.middlename;
          this.lastName = this.studentData.lastname;
          this.address = this.studentData.address;
          this.phoneNumber = this.studentData.phone;
          this.gender = this.studentData.gender;
          this.birthdate = this.studentData.birthdate;
        },
        (error: any) => {
          console.error('Student Data Error:', error);
        }
      );
    } catch (error) {
      console.error('Error fetching student data:', error);
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
      aksi: 'update_student_data',
      studentId: this.studentData.user_id,
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
          this.router.navigate(['/tabs/tabs/profile']);

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
