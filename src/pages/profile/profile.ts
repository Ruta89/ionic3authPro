import { Observable } from 'rxjs/Observable';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  invitations: Observable<any[]>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public firebaseServise: FirebaseServiceProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.firebaseServise.authState.subscribe(user => {
      if (user) {
        this.invitations = this.firebaseServise.getUserInvitations();
      }
    });
  }

}
