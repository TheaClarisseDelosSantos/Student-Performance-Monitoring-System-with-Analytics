import { Component, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { LoginPage } from './pages/login/login.page';
import { HomePage } from './pages/home/home.page';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild('content') nav: NavController | undefined;
  rootPage: any;
  public appPages = [];
  
  constructor(private storage: Storage) {
    this.initializeApp();
  }

  initializeApp(){
    this.storage.create().then(() => {
      this.storage.get('session_storage').then((res) => {
        if(res == null){
          this.rootPage = LoginPage;
        }else{
          this.rootPage = HomePage;
        }
      });
    });
  }
}
