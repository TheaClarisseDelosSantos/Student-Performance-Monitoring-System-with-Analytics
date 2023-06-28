import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from 'src/app/services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  passwordVisible: boolean = false;
  validationUserMessage: any;
  validationFormUser!: FormGroup;

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }


  constructor(public formbuider: FormBuilder, public authservice: AuthService) { }

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
      ]))
    })
  }

  LoginUser(value:any){
    console.log("Am logged in");
    try{
      this.authservice.loginFireauth(value).then(resp=>{
        console.log(resp);
      })
    }catch(err){
      console.log(err);
    }
  }

}
