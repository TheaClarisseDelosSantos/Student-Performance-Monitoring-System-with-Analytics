import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth, private firestore: AngularFirestore) { }

  loginFireauth(value: any){
    return new Promise<any> ( (resolve, reject)=>{
      firebase.auth().signInWithEmailAndPassword(value.email, value.password).then(
        res => resolve(res))
        .catch(error => reject(error));
    });
  }

  updateUserRole(uid:string, role:string){
    const userRef = this.firestore.collection('users').doc(uid);

    userRef.get().toPromise().then((doc)=>{
      if(doc?.exists){
        userRef.update({role:role}).catch(error => console.error('Error updating user role:', error));
      }else{
        userRef.set({role:role}).catch(error => console.error('Error creating user document:', error));
      }
    }).catch(error => console.error('Error retrieving user document:', error));
  }
}
