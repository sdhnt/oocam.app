import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import firebase from 'firebase';
import moment, { duration } from 'moment';
import { isDifferent } from '@angular/core/src/render3/util';
import { LoginPage } from '../login/login';
import { ReceiverPage } from '../receiver/receiver'
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { Geolocation } from '@ionic-native/geolocation';
import geolib from 'geolib';
import { resolve } from 'url';
import { log } from 'util';
import { P } from '@angular/core/src/render3';
import { SlideshowComponent } from 'ng-simple-slideshow/src/app/modules/slideshow/slideshow.component';
// import {cors} from 'cors';

// const cors = require('cors')({origin: true});
const axios = require('axios');

@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {
  // cors = cors({origin: true});
  text: string="";
  posts: any[]=[];
  pageSize: number= 10;
  cursor: any;//documentSnapshot- holds value of pageSizeth post
  infiniteEvent: any;
  image: string; 
  retrieved_images: string[]=[];
  retrieved_image: string;
  all_locations: any;
  endDate: string;
  startTime: any;
  endTime: any;
  testPic: any;
  timeslot: string;
  schedule: any = [];
  printedschedule: any;
  photovid: boolean;
  intervalTime: number;
  ISOTime: number;
  TZ: any;
  ShutterTime: number;
  location:number;
  today: string = new Date().toISOString(); // minimum date = current date
  startDate: string = new Date().toISOString();
  min_end_date: string = this.startDate;
  maxDate: string = new Date(new Date().getFullYear(), new Date().getMonth() + 3, new Date().getDate()).toISOString(); // max date = 3 months from today
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController, 
    public toastCtrl: ToastController, private camera: Camera, private imagePicker: ImagePicker, private geolocation: Geolocation) {
      
  }

 
addSlot()
{

  var tempslot = {


    // startDate : this.startDate,
    // endDate : this.endDate,
    // startTime : this.startTime,
    // endTime : this.endDate,
    start: this.startDate,
    stop: this.startTime,
    iso: this.ISOTime,
    frequency: this.intervalTime,
    shutter_speed: this.ShutterTime,
    video: this.photovid,

  }

  this.timeslot=JSON.stringify(tempslot)

  this.schedule.push(tempslot);
  this.printedschedule=JSON.stringify(this.schedule);

}

async sendConfig()
{
  var headers = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD', "Access-Control-Allow-Headers": "Access-Control-*, Origin, X-Requested-With, Content-Type, Accept",}
 
  axios.post('http://localhost:8000/setSchedule/', this.schedule, headers)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

  
async viewConfig() {
  try {
  
    const response = await axios.get('http://localhost:8000/viewConfig/', {//RETURN JSON ARRAY OF SLOTS
     
    });
    this.schedule=response;
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}  

async testPhoto(){
  try {
  
    const response = await axios.get('http://localhost:8000/testPhoto/', {//RETURN JSON ARRAY OF SLOTS
    });
    this.testPic=response;
    console.log(response);
  } catch (error) {
    console.error(error);
  }

}





editConfig(){

  
}



}
