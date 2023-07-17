import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-teacher-profile',
  templateUrl: './teacher-profile.page.html',
  styleUrls: ['./teacher-profile.page.scss'],
})
export class TeacherProfilePage implements OnInit {

  constructor(private router: Router, private storage:Storage, private appCtrl:NavController) { }

  lastName : string = '';
  firstName: string = '';
  middleName: string = '';
  email: string = '';

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getName();
  }

  editProfile(){
    this.router.navigate(['teacher-edit-profile']);
  }

  about(){
    this.router.navigate(['about'])
  }

  changePassword(){
    this.router.navigate(['teacher-changepass'])
  }


  
  logout(){
    this.storage.clear();
    this.router.navigate(['login']);
}

  async getName(){
    const user = await this.storage.get('session_storage');

    if(user){
      this.lastName = user.lastname;
      this.firstName = user.firstname;
      this.middleName = user.middlename;

      this.email = user.email;
    }
  }


}
