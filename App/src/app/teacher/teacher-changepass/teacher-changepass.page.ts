import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
import { PostProvider } from 'src/app/providers/post-provider';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-teacher-changepass',
  templateUrl: './teacher-changepass.page.html',
  styleUrls: ['./teacher-changepass.page.scss'],
})
export class TeacherChangepassPage implements OnInit {

  passwordVisible: boolean = false;
  passwordVisible1: boolean = false;

  currentPassword: string = '';
  newPassword: string = '';
  teacherId: number = 0;

  constructor(
    private authService: AuthService,
    private postProvider: PostProvider,
    private toastController: ToastController,
    private storage: Storage
  ) {}

  ngOnInit() {
    this.fetchUserInfo();
  }

  async fetchUserInfo() {
    const user = await this.storage.get('session_storage');
    if (user) {
      this.teacherId = user.user_id;
    }
  }

  async changePassword() {
    if (!this.currentPassword || !this.newPassword) {
      this.showToast('Please fill in all the fields');
      return;
    }

    const body = {
      aksi: 'teacher_change_password',
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      teacherId: this.teacherId,
    };

    this.postProvider.postData(body, 'server_api/file_aksi.php').subscribe(
      (response: any) => {
        if (response.success) {
          this.showToast('Password changed successfully');
          this.currentPassword = '';
          this.newPassword = '';
        } else {
          this.showToast('Failed to change password. Please try again.');
        }
      },
      (error) => {
        console.error(error);
        this.showToast('An error occurred. Please try again.');
      }
    );
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color:'success',
    });
    toast.present();
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  togglePasswordVisibility1() {
    this.passwordVisible1 = !this.passwordVisible1;
  }

}
