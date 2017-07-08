import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  invitations: Observable<any[]>;
  nameForm: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public firebaseServise: FirebaseServiceProvider,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
  ) {
    this.nameForm = formBuilder.group({
      name: ['', Validators.compose([Validators.minLength(1), Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.firebaseServise.authState.subscribe(user => {
      if (user) {
        this.invitations = this.firebaseServise.getUserInvitations();
        this.firebaseServise.getUserData().subscribe(data => {
          let value = data.name;
          this.nameForm.patchValue({ name: value });
        }, err => {
          console.log('err:  ', err);
        });
      }
    });
  }

  acceptInvitation(invitation) {
    this.firebaseServise.acceptInvitation(invitation).then(() => {
      this.presentToast('Accepted');
    }).catch((err) => {
      this.presentToast(err);
    });
  }

  discardInvitation(invitationId) {
    this.firebaseServise.discardInvitation(invitationId).then(() => {
      this.presentToast('Discarded Invitation');
    }).catch((err) => {
      this.presentToast(err);
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  updateUser() {
    this.firebaseServise.updateUserName(this.nameForm.value.name).then(() => {
      this.presentToast('Name changed!');
    });
  }

}
