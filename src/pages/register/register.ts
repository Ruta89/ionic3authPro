
import { EmailValidator } from './../../validators/email';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  public signupForm: FormGroup;
  loading: Loading;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public firebaseService: FirebaseServiceProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {

    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      name: ['', Validators.compose([Validators.minLength(1), Validators.required])],
    });

  }

  signupUser() {
    if (this.signupForm.valid) {
      this.loading = this.loadingCtrl.create();
      this.loading.present();

      this.firebaseService.signUp(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.name)
        .then(() => {
          this.loading.dismiss().then(() => {
            this.navCtrl.setRoot('LoginPage');
          });
        }, error => {
          this.loading.dismiss().then(() => {
            let alert = this.alertCtrl.create({
              title: 'Error',
              message: error.message,
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          });
        });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

}
