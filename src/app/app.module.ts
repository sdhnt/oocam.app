import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { FeedPage } from '../pages/feed/feed';
import { SetConfigPage } from '../pages/set-config/set-config';
import { ViewConfigPage } from '../pages/view-config/view-config';
import { TestPicPage } from '../pages/test-pic/test-pic';
import { TestPicPageModule } from '../pages/test-pic/test-pic.module';
import { ViewConfigPageModule } from '../pages/view-config/view-config.module';
import { SetConfigPageModule } from '../pages/set-config/set-config.module';


// import firebase from 'firebase';
// import { ReceiverPage } from '../pages/receiver/receiver';
// var config = {
//     apiKey: "AIzaSyADjIbI3_GRS4eRHGVGFsT2hrkKvH9K06M",
//     authDomain: "trialapp-1cb3d.firebaseapp.com",
//     databaseURL: "https://trialapp-1cb3d.firebaseio.com",
//     projectId: "trialapp-1cb3d",
//     storageBucket: "trialapp-1cb3d.appspot.com",
//     messagingSenderId: "591467524421"
//   };
// firebase.initializeApp(config);
// firebase.firestore().settings({
// timestampsInSnapshots: true
// });

@NgModule({
  declarations: [
    MyApp,
    FeedPage,
    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    SetConfigPageModule,
    ViewConfigPageModule,
    TestPicPageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FeedPage,
    SetConfigPage,
    ViewConfigPage,
    TestPicPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
