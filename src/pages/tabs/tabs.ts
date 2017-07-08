import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab1 = 'HomePage';
  tab2 = 'SharedPage';
  tab3 = 'ProfilePage';
  invitationCount = 0;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public firebaseServise: FirebaseServiceProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
    this.firebaseServise.authState.subscribe(user => {
      if (user) {
        this.firebaseServise.getUserInvitations().subscribe(data => {
          this.invitationCount = data.length;
        });
      }
    });
  }

}
