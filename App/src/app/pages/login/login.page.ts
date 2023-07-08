import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from 'src/app/services/auth.service'
import { Router } from '@angular/router';
import { PostProvider } from '../../providers/post-provider';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home.page';
import { NavController, NavParams } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  passwordVisible: boolean = false;
  validationUserMessage: any;
  validationFormUser!: FormGroup;
  selectedRole: string = '';


  constructor(public formbuider: FormBuilder, public authservice: AuthService, 
    private router: Router, private postPvdr: PostProvider, public navCtrl: NavController) { }

  ngOnInit() {
    this.validationUserMessage = {
      email:[
        {type:"required",message:"Please enter your email"},
        {type:"pattern",message:"Incorrect Email. Try again."}
      ],
      password:[
        {type:"required", message:"Please enter your password"},
        {type:"minlength",message:"The password must be at least 5 characters or more"}
      ]
    };

    this.validationFormUser = this.formbuider.group({
      email:new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('',Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])),
      role: new FormControl('', Validators.required)
    })
  }

  LoginUser(value:any){
    console.log("Am logged in");
    try{
      this.authservice.loginFireauth(value).then(resp=>{
        console.log(resp);
        this.authservice.updateUserRole(resp.user.uid, value.role);
        this.router.navigate(['tabs'])
      })
    }catch(err){
      console.log(err);
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

}
