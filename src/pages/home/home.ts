import { Observable } from 'rxjs/Observable';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  partLists: Observable<any[]>;
  editMode: boolean = true;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public firebaseService: FirebaseServiceProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) {
  }

  logOut() {
    this.firebaseService.logoutUser();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.firebaseService.authState.subscribe(user => {
      if (user) {
        this.partLists = this.firebaseService.getUserLists();
      } else {
        this.partLists = null;
      }
    });
  }

  newList() {
    let prompt = this.alertCtrl.create({
      title: 'Create new parts list',
      message: 'Enter a name for your part list',
      inputs: [
        {
          name: 'name',
          placeholder: 'zywnosc'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Create List',
          handler: data => {
            this.firebaseService.createNewList(data.name).then(data => {
              this.presentToast('New list created');
            })
              .catch(err => {

              });
          }
        }
      ]
    });
    prompt.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  removeList(id) {
    this.firebaseService.removeList(id);
  }

}
