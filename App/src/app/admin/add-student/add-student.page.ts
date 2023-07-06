import { Component,OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.page.html',
  styleUrls: ['./add-student.page.scss'],
})
export class AddStudentPage {
  validationMessages = {
    fname: [{type: "required", message: "Enter First Name"}],
    lname: [{type: "required", message: "Enter Last Name"}],
    address: [{type: "required", message: "Enter Address"}],
    phone:[{type: "required", message:"Enter Phone Number"}],
    gender:[{type: "required", message: "Select Gender"}],
    gradelevel:[{type:"required", message:"Choose Grade Level"}],
    section:[{type:"required", message:"Choose section"}],
    email:[
      {type:"required", message:"Enter Email Address"},
      {type:"pattern", message:"Incorrect Email Address"}
    ],  
    password: [
      {type: "required", message:"Password required"},
      {type: "minLength", message:"Password must be atleast 5 characters"}
    ]
  }
  selectedMode = 'date';
  showPicker = false;
  dateValue = format(new Date(),'yyyy-MM-dd') + 'T09:00:00.000Z';
  formattedString = '';

  ValidationFormUser: FormGroup;

  constructor(private formbuilder:FormBuilder) {
    this.setToday();

    this.ValidationFormUser = this.formbuilder.group({
      fname: new FormControl ('', Validators.compose([
        Validators.required
      ])),
      lname: new FormControl('',Validators.compose([
        Validators.required
      ])),
      address: new FormControl('',Validators.compose([
        Validators.required
      ])),
      phone: new FormControl('',Validators.compose([
        Validators.required
      ])),
      gender: new FormControl('',Validators.compose([
        Validators.required
      ])),
      gradelevel: new FormControl('',Validators.compose([
        Validators.required
      ])),
      section: new FormControl('',Validators.compose([
        Validators.required
      ])),
      email: new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('',Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])),
    })
  }

  setToday(){
    this.formattedString = 'Date of Birth';
  }
  
  dateChanged(value:any){
    this.dateValue = value;
    this.formattedString = format(parseISO(value),'MMM d, yyyy');
    this.showPicker = false;
  }

  
  

  ngOnInit(){
   
  }
    
}
