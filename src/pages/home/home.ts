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

  removeItem(itemId, listId) {
    this.firebaseService.removePartItem(listId, itemId);
  }

  shareList(listId, listName) {
    let prompt = this.alertCtrl.create({
      title: 'Share your list "' + listName + '"',
      message: 'Enter the email of the person you want to share your list with',
      inputs: [
        {
          name: 'email',
          placeholder: 'mail@mail.pl'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Share list',
          handler: data => {
            this.firebaseService.shareList(listId, listName, data.email).then(() => {
              console.log('data email ' + data.email);
              this.presentToast('Invitation sent to:  ' + data.email);
            })
              .catch((err) => {
                console.error(err);
              });
          }
        }
      ]
    });
    prompt.present();
  }

}
