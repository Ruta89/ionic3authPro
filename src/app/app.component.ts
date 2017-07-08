import { FirebaseServiceProvider } from './../providers/firebase-service/firebase-service';

import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = this.rootPage;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    firebaseService: FirebaseServiceProvider
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();


      firebaseService.authState.subscribe(user => {
        if (user) {
          this.rootPage = 'TabsPage'
        } else {
          this.rootPage = 'LoginPage'
        }
      });
    });
  }
}

