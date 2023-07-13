import { Component, OnInit} from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonDatetime } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
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
