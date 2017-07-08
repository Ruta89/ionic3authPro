import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedPage } from './shared';

@NgModule({
  declarations: [
    SharedPage,
  ],
  imports: [
    IonicPageModule.forChild(SharedPage),
  ],
  exports: [
    SharedPage
  ]
})
export class SharedPageModule {}
