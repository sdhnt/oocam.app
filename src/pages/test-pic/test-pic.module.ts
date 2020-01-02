import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestPicPage } from './test-pic';

@NgModule({
  declarations: [
    TestPicPage,
  ],
  imports: [
    IonicPageModule.forChild(TestPicPage),
  ],
})
export class TestPicPageModule {}
