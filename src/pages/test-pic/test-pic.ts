import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
const axios = require('axios');

/**
 * Generated class for the TestPicPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test-pic',
  templateUrl: 'test-pic.html',
})
export class TestPicPage {

  // cors = cors({origin: true});
  text: string = "";
  posts: any[] = [];
  pageSize: number = 10;
  cursor: any;//documentSnapshot- holds value of pageSizeth post
  infiniteEvent: any;
  image: string;
  retrieved_images: string[] = [];
  retrieved_image: string;
  all_locations: any;
  endDate: string;
  startTime: any;
  endTime: any = new Date();
  screenlog: any;
  testPic: any;
  testPicvar= 1;
  timeslot: string;
  schedule: any = [];
  printedschedule: any;
  photovid: string;
  intervalTime: string;
  ISOTime: any=0;
  TZ: any;
  light: any=0;
  ShutterTime: any=0;
  location: number;
  today: string = new Date().toISOString(); // minimum date = current date
  startDate: string;
  min_end_date: string = this.startDate;
  maxDate: string = new Date(new Date().getFullYear(), new Date().getMonth() + 3, new Date().getDate()).toISOString(); // max date = 3 months from today
  feedlog: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
  ) {

  }

  timezone = 8;

  ionViewDidLoad(){
    this.testPicvar=1;
   setTimeout( () => {
      this.testPicvar=0;
    }, 1000);
  }

  headers = { 'Access-Control-Allow-Origin': 'localhost, *', 'Access-Control-Allow-Methods': 'GET, OPTIONS, POST', "Access-Control-Allow-Headers": "Access-Control-*,", }

  params: any;

  closetestimg(){
    this.testPicvar=0;
  }
  async testPhoto() {
    try {
      let params={
        iso: parseInt(this.ISOTime),
        shutter: parseInt(this.ShutterTime),
        light: parseInt(this.light),
      }
      //const response = await axios.get('http://169.254.52.217:8000/testPhoto', Headers, {});
      const response = await axios({
        method: 'get',
        url: 'http://192.168.5.1:8000/testPhoto',
        headers: this.headers,
        data: params,
        timeout: 5000,
      })
      var base64Data = response.data;
      this.testPicvar=1;
      
      this.testPic = "data:image/jpeg;base64," + base64Data;


      console.log(response);
    } catch (error) {
      console.error(error);
      
      // Please check if you are connected to the OOCAM through Wi-Fi!
      if(error=="Error: timeout of 5000ms exceeded"){
        error=error+"."+'\n' +"Check if you are connected to the OOCAM via Wi-Fi!"
      }
      if(error="Error: Request failed with status code 500"){
        error=error+"."+'\n' +"Please restart the camera and try again or contact us!"
      }
      this.alertCtrl.create({title: "Test Photo Error", message:error}).present();
    }

  }

  async testPhotoFull() {
    //SET Schedule for 20 secs from now, test pic and wait 

  }

  remitem(tempslot) {

    this.schedule.forEach((element, index) => {
      if (element = tempslot) {
        this.schedule.splice(index, 1);
      }
    });
  }


}
