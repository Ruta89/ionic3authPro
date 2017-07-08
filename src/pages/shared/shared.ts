import { Observable } from 'rxjs/Observable';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-shared',
  templateUrl: 'shared.html',
})
export class SharedPage {
  sharedLists: Observable<any[]>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public firebaseService: FirebaseServiceProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SharedPage');
    this.firebaseService.authState.subscribe(user => {
      if (user) {
        this.sharedLists = this.firebaseService.getSharedLists();
      } else {
        this.sharedLists = null;
      }
    });
  }

  addItemToList(listId, listName) {
    let prompt = this.alertCtrl.create({
      title: 'Create item for "' + listName + '"',
      message: 'Enter a new item',
      inputs: [
        {
          name: 'name',
          placeholder: 'Chleb'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Add item',
          handler: data => {
            this.firebaseService.addListItem(listId, data.name).then(data => {
              this.presentToast('New item added');
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

}
