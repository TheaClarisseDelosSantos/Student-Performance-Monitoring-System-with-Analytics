import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-teacher-home',
  templateUrl: './teacher-home.page.html',
  styleUrls: ['./teacher-home.page.scss'],
})
export class TeacherHomePage implements OnInit {

  userName: string = '';
  currentDate: Date = new Date();

  constructor(private storage: Storage) {}

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getUserName();
  }

  

  async getUserName() {
    const user = await this.storage.get('session_storage');
    if (user) {
      this.userName = user.firstname;
    }
}
}