import { Component, OnInit } from '@angular/core';
import { parseISO, parse, format, isValid } from 'date-fns';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray, Form} from '@angular/forms';
import { PostProvider } from '../../providers/post-provider';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.page.html',
  styleUrls: ['./add-teacher.page.scss'],
})
export class AddTeacherPage{

  ValidationFormUser: FormGroup;
  emailExistsError: boolean = false;
  phoneError: boolean = false;
  subjects: string[] = [];
  gradeLevels: string[] = [];
  gradeLevelss: string[] = [];
  assignments: FormArray;
  sections: string[] = [];
  sectionId: string = '';
  sectionIds: number[] = [];


  fname : string = "";
  mname : string = "";
  lname : string = "";
  address : string = "";
  phone : string = "";
  gender : string = "";
  birthdate:string= "";
  gradelevel : string = "";
  gradelevel1 : string = "";
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
    gradelevel1:[{type:"required", message:"Choose Grade Level"}],
    section:[{type:"required", message:"Choose section"}],
    email:[
      {type:"required", message:"Enter Email Address"},
      {type:"pattern", message:"Incorrect Email Address"}
    ],  
    password: [
      {type: "required", message:"Password required"},
      {type: "minLength", message:"Password must be atleast 5 characters"}
    ],
    
    
  }
  selectedMode = 'date';
  showPicker = false;
  dateValue = format(new Date(),'yyyy-MM-dd') + 'T09:00:00.000Z';
  formattedString = '';

  

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
      gradelevel: new FormControl('',Validators.compose([
        Validators.required
      ])),
      section: new FormControl('',Validators.compose([
        Validators.required
      ])),
      birthdate: new FormControl('',Validators.compose([])),
      email: new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('',Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])),
      assignments: this.formbuilder.array([]),
    });
    this.assignments = this.ValidationFormUser.get('assignments') as FormArray;
  }

  
  getTGradeLevels(){
    const body = {aksi : 'get_grade_levels_sections'};

    this.postPvdr.postData(body, 'server_api/file_aksi.php').subscribe(
      (response: any) => {
        console.log('Grade Levels & Sections Response:', response);
        this.gradeLevelss = response.gradeLevelss;
      },
      (error: any) => {
        console.error('Grade Levels Error:',error);
      }
    );
  }

  getGradeLevels(){
    const body = {aksi : 'get_grade_levels'};

    this.postPvdr.postData(body, 'server_api/file_aksi.php').subscribe(
      (response: any) => {
        console.log('Grade Levels Response:', response);
        this.gradeLevels = response.gradeLevels;
      },
      (error: any) => {
        console.error('Grade Levels Error:',error);
      }
    );
  }

  getSections(gradeLevel: string) {
    const body = { aksi: 'get_sections', gradeLevel: gradeLevel };
  
    this.postPvdr.postData(body, 'server_api/file_aksi.php').subscribe(
      (response: any) => {
        console.log('Sections Response:', response);
        this.sections = response.sections;
        this.sectionIds = response.sectionIds; // Assign the section IDs
      },
      (error: any) => {
        console.error('Sections Error:', error);
      }
    );
  }
  

  getSubjects(){
    const body = {aksi : 'get_subjects'};

    this.postPvdr.postData(body, 'server_api/file_aksi.php').subscribe(
      (response: any) => {
        console.log('Subjects Response:', response);
        this.subjects = response.subjects;
      },
      (error: any) => {
        console.error('Subjects Error:',error);
      }
    );
  }

  addSubject(){
    const assignment = this.formbuilder.group({
      gradelevel:['',Validators.required],
      subjects: new FormControl([], Validators.required),
    });
    this.assignments.push(assignment);
  }

  removeAssignment(index: number){
    this.assignments.removeAt(index);
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
  
  capitalizeFirstLetter(event: any, controlName: string): void {
    const input = event.target;
    const value = input.value;
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    this.ValidationFormUser.get(controlName)?.setValue(capitalizedValue, { emitEvent: false });
  }
  
  
  async addTeacher(value: any) {
    const formattedDate = this.dateValue.split('T')[0]; 
    const phoneNumber = this.ValidationFormUser.get('phone')?.value || '';

    if(phoneNumber.length !== 11){
      this.phoneError = true;
      return;
    }

    // this.phoneError = false;
    const sectionIndex = this.sections.indexOf(value.section);
    const sectionId = this.sectionIds[sectionIndex];
  
    let body = {
      fname: value.fname,
      mname: value.mname,
      lname: value.lname,
      address: value.address,
      phone:value.phone,
      gender: value.gender,
      gradelevel: value.gradelevel,
      section: value.section,
      sectionId: sectionId,
      birthdate: formattedDate,
      email: value.email,
      password: value.password,
      assignments:value.assignments,
      aksi: 'add_teacher',
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
        if(response.success){
          const alert = await this.alertController.create({
            header: 'Success',
            message: 'Added Teacher Successfully',
            buttons: ['OK']
        });
          await alert.present();
          this.ValidationFormUser.reset();
          this.dateValue = format(new Date(), 'yyyy-MM-dd') + 'T09:00:00.000Z';
          this.formattedString = 'Date of Birth';
        }else{
          console.log(response.msg);
        }
    },
      (error) =>{
        console.log(error);
      }
    );
  }

  async checkEmailExists(email:string):Promise<boolean>{

    const body = {
      email: email,
      aksi:'check_teacher_email'
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
    this.getTGradeLevels();
    this.getGradeLevels();
    
    this.getSubjects();
    this.addSubject();

    
  }
}