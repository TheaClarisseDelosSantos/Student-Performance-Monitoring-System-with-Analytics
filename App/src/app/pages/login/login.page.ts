import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PostProvider } from '../../providers/post-provider';
import { Storage } from '@ionic/storage';
import { NavController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  passwordVisible: boolean = false;
  validationUserMessage: any;
  validationFormUser!: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private postPvdr: PostProvider,
    public navCtrl: NavController,
    public alertController: AlertController,
    private storage: Storage,
    private http: HttpClient
  ) {}


  ngOnInit() {

    this.validationUserMessage = {
      email: [
        { type: 'required', message: 'Please enter your email' },
        { type: 'pattern', message: 'Incorrect Email. Try again.' }
      ],
      password: [
        { type: 'required', message: 'Please enter your password' },
        { type: 'minlength', message: 'The password must be at least 5 characters or more' }
      ],
      role: new FormControl('', Validators.required)
    };

    this.validationFormUser = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
      role: new FormControl('', Validators.required)
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  async LoginUser() {
    if (this.validationFormUser.valid) {
      const email = this.validationFormUser.value.email;
      const password = this.validationFormUser.value.password;
      const role = this.validationFormUser.value.role;
  
      let body = {
        email: email,
        password: password,
        role: role,
        aksi: 'login'
      };
  
      this.postPvdr.postData(body, 'server_api/file_aksi.php').subscribe(
        async (response: any) => {
          console.log('Response:', response);
          if (response.success) {
            // Set the role property in the user object
            response.result.role = role;
            
            this.storage.set('session_storage', response.result);
            switch (role) {
              case 'student':
                console.log('Navigating to student page...');
                this.navCtrl.navigateRoot('/tabs');
                break;
              case 'teacher':
                console.log('Navigating to teacher page...');
                this.navCtrl.navigateRoot('/teacher-tabs');
                break;
              case 'admin':
                console.log('Navigating to admin page...');
                this.navCtrl.navigateRoot('/admin-home');
                break;
              default:
                console.log('No matching role found');
                break;
            }
            const alert = await this.alertController.create({
              header: 'Success',
              message: 'Login Successful',
              buttons: ['OK']
            });
            await alert.present();
          } else {
            const alert = await this.alertController.create({
              header: 'Error',
              message: response.msg,
              buttons: ['OK']
            });
            await alert.present();
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Please fill in all the required fields.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

 

}
