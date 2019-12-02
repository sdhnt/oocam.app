import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, Header } from 'ionic-angular';
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
  endTime: any = new Date();
  screenlog:any;
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
  startDate: string;
  min_end_date: string = this.startDate;
  maxDate: string = new Date(new Date().getFullYear(), new Date().getMonth() + 3, new Date().getDate()).toISOString(); // max date = 3 months from today
  feedlog: string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController, 
    public toastCtrl: ToastController, private camera: Camera, private imagePicker: ImagePicker, private geolocation: Geolocation) {
      
  }

 
addSlot()
{

  var tempslot = {

    start: this.startDate.substring(0,this.startDate.length -10)+"-"+this.startDate.substring(11,this.startDate.length -1),//remove Z  
    stop: this.endDate.substring(0,this.endDate.length -10)+"-"+this.endDate.substring(11,this.endDate.length -1),//remove Z  
    iso: this.ISOTime,
    frequency: this.intervalTime,
    shutter_speed: this.ShutterTime,
    video: this.photovid,
  }

  this.timeslot=JSON.stringify(tempslot)
  this.schedule.push(tempslot);
  this.printedschedule=JSON.stringify(this.schedule);

}
headers = {'Access-Control-Allow-Origin': 'localhost, *', 'Access-Control-Allow-Methods': 'GET, OPTIONS, POST', "Access-Control-Allow-Headers": "Access-Control-*,",}
 
async sendConfig()
{
  
  axios({
    method: 'post',
    url: 'http://192.168.5.1:8000/setSchedule',
    //withCredentials: true, // True otherwise I receive another error
    headers: this.headers,
    data: this.schedule,
  }).then(response => {
    console.log('Logout ', response);
  })
  
  // axios.post('http://169.254.52.217:8000/setSchedule/', this.schedule, headers)
  // .then(function (response) {
  //   console.log(response);
  // })
  // .catch(function (error) {
  //   console.log(error);
  // });
}

async viewConfig() {
  try {
  
    //const response = await axios.get('http://169.254.52.217:8000/viewConfig', {});
    const response = await axios({
      method: 'get',
      url: 'http://192.168.5.1:8000/viewConfig',
      headers: this.headers,
    })
      
    this.schedule=response.data;
    if(this.schedule.error!=null)
    {
      this.feedlog="No Config Exists. Please set a configuration first.";
    }
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}  

async testPhoto(){
  try {
  
    //const response = await axios.get('http://169.254.52.217:8000/testPhoto', Headers, {});
    const response = await axios({
      method: 'get',
      url: 'http://192.168.5.1:8000/testPhoto',
      headers: this.headers,
    })
    var base64Data=response.data;
    //console.log(base64Data)
    

    // const bytes: string = atob(base64Data);
    //   const byteNumbers = new Array(bytes.length);
    //   for (let i = 0; i < bytes.length; i++) {
    //     byteNumbers[i] = bytes.charCodeAt(i);
    //   }
    //   const byteArray = new Uint8Array(byteNumbers);

    //   const blob: Blob = new Blob([byteArray], { type: 'image/png' });

    //   this.testPic= blob;
    // var b64 = window.btoa(unescape(encodeURIComponent(base64Data)))
    // console.log(b64);
    // this.testPic=b64;

  

    console.log(response);
  } catch (error) {
    console.error(error); 
  }

}
  




editConfig(){

  
}



}
