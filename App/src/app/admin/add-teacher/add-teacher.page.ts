import { Component } from '@angular/core';
import { parseISO, parse, format, isValid } from 'date-fns';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { PostProvider } from '../../providers/post-provider';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.page.html',
  styleUrls: ['./add-teacher.page.scss'],
})
export class AddTeacherPage {
  fname : string = "";
  mname : string = "";
  lname : string = "";
  address : string = "";
  phone : string = "";
  gender : string = "";
  birthdate:string= ""
  gradelevel : string = "";
  section : string = "";
  email : string = "";
  password : string = "";
  validationMessages = {
    fname: [{type: "required", message: "Enter First Name"}],
    lname: [{type: "required", message: "Enter Last Name"}],
    address: [{type: "required", message: "Enter Address"}],
    phone:[
      {type: "required", message:"Enter Phone Number"},
      {type: 'pattern', message: 'Incorrect Phone Number'},
      {type: 'minlength', message: 'Phone Number must be 11 digits'}],
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

  constructor(private formbuilder:FormBuilder, private postPvdr: PostProvider, private alertController: AlertController, 
    private toastController: ToastController) {
    this.setToday();

    this.ValidationFormUser = this.formbuilder.group({
      fname: new FormControl ('', Validators.compose([
        Validators.required
      ])),
      mname: new FormControl(''),
      lname: new FormControl('',Validators.compose([
        Validators.required
      ])),
      address: new FormControl('',Validators.compose([
        Validators.required
      ])),
      phone: new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(11),
        Validators.maxLength(11)
      ])),
      gender: new FormControl('',Validators.compose([
        Validators.required
      ])),
      birthdate: new FormControl('',Validators.compose([])),
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
  
  dateChanged(value: any) {
    const dateOnly = value.split('T')[0];
    const parsedDate = parse(dateOnly, 'yyyy-MM-dd', new Date());
  
    if (isValid(parsedDate)) {
      this.dateValue = format(parsedDate, 'yyyy-MM-dd');
      this.formattedString = format(parsedDate, 'MMM d, yyyy');
    } else {
      this.dateValue = ''; 
      this.formattedString = '';
    }
  
    this.showPicker = false;
  }
  
  emailExistsError: boolean = false;
  phoneError: boolean = false;

  async addTeacher(value: any) {
    const formattedDate = this.dateValue.split('T')[0]; 
    const phoneNumber = this.ValidationFormUser.get('phone')?.value || '';

    if(phoneNumber.length !== 11){
      this.phoneError = true;
      return;
    }

    // this.phoneError = false;
  
    let body = {
      fname: value.fname,
      mname: value.mname,
      lname: value.lname,
      address: value.address,
      phone:value.phone,
      gender: value.gender,
      birthdate: formattedDate,
      gradelevel: value.gradelevel,
      section: value.section,
      email: value.email,
      password: value.password,
      aksi: 'add_student'
    };
  
    console.log('Request Body:', body);

    const emailExists = await this.checkEmailExists(body.email);

    if (emailExists) {
      this.emailExistsError = true;
      return;
    }

    this.emailExistsError = false;

  
    this.postPvdr.postData(body, 'server_api/file_aksi.php').subscribe(
      async (response: any) => {
        console.log('Response:', response);

        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Added Student Successfully',
          buttons: ['OK']
      });
      await alert.present();
      this.ValidationFormUser.reset();
      this.dateValue = format(new Date(), 'yyyy-MM-dd') + 'T09:00:00.000Z';
      this.formattedString = 'Date of Birth';
    },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  async checkEmailExists(email:string):Promise<boolean>{

    const body = {
      email: email,
      aksi:'check_email'
    };

    return new Promise<boolean>((resolve, reject)=>{
      this.postPvdr.postData(body,'server_api/file_aksi.php').subscribe(
        (response:any) =>{
          console.log('Check Email Response:', response);
          const emailExists = response.emailExists === true;
          resolve(emailExists);
        },
        (error: any) => {
          console.error('Check Email Error:', error);
          reject(error);
        }
      );
    });
  }
  
  

  restrictNonNumeric(event: any) {
    const input = event.target;
    const numericValue = input.value.replace(/[^0-9]/g, '');
    
    if (numericValue.length > 11) {
      input.value = numericValue.slice(0, 11);
    } else {
      input.value = numericValue;
    }
    
    this.ValidationFormUser.patchValue({ phone: input.value });
    this.phoneError = false;
  }
  
  

  
  ngOnInit(){
   
  }
}