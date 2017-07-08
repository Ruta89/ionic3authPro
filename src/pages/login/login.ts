
import { EmailValidator } from './../../validators/email';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm: FormGroup;
  loading: Loading;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public firebaseService: FirebaseServiceProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {

    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });

  }

  loginUser() {
    if (this.loginForm.valid) {
      this.loading = this.loadingCtrl.create();
      this.loading.present();

      this.firebaseService.loginUser(this.loginForm.value.email, this.loginForm.value.password)
        .then((data) => {
          //console.log('mydata: ', data);
          this.loading.dismiss().then(() => {
            //this.navCtrl.setRoot('TabsPage');
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

  gotoSignup() {
    this.navCtrl.push('RegisterPage');
  }

  resetPassword() {
    let prompt = this.alertCtrl.create({
      title: 'Reset Password',
      message: 'Enter your email below',
      inputs: [
        {
          name: 'email',
          placeholder: 'arek@op.pl'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Reset',
          handler: data => {
            this.firebaseService.resetPassword(data.email).then(data => {
              this.showBasicAlert('Success', 'Check your email for further instructions.');
            })
              .catch(err => {
                this.showBasicAlert('Error', err.message);
              });
          }
        }
      ]
    });
    prompt.present();
  }

  showBasicAlert(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }


}
