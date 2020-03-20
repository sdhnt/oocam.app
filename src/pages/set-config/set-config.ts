import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';

/**
 * Generated class for the SetConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
// const cors = require('cors')({origin: true});
const axios = require('axios');

@IonicPage()
@Component({
  selector: 'page-set-config',
  templateUrl: 'set-config.html',
})
export class SetConfigPage {





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
  light: string;
  timeslot: string;
  schedule: any = [];
  printedschedule: any;
  photovid: string;
  intervalTime: string;
  ISOTime: string;
  TZ: any;
  ShutterTime: string;
  location: number;
  today: string = new Date().toISOString(); // minimum date = current date
  startDate: string;
  min_end_date: string = this.startDate;
  maxDate: string = new Date(new Date().getFullYear(), new Date().getMonth() + 3, new Date().getDate()).toISOString(); // max date = 3 months from today
  feedlog: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
  ) {

  }

  timezone = 8;

  ionViewDidLoad(){
    this.testPicvar=1;
   setTimeout( () => {
      this.testPicvar=0;
    }, 2000);
  }


  addSlot() {
    if (this.startDate == null || this.endDate == null) {
      this.alertCtrl.create({
        title: "Error",
        message: "Need to Specify Start and End Time",
        buttons: [{
          text: 'OK',
          role: 'cancel'
        },
        ]
      }).present()
      return;
    }
    if (this.startDate >= this.endDate) {
      this.alertCtrl.create({
        title: "Error",
        message: "End time must be greater than start time"
      }).present()
      return;
    }

    var vid;
    if (this.photovid == "true") {
      vid = true;
      this.ISOTime="0";
      this.ShutterTime="0";
      this.intervalTime="1";
    } else { //its a photo
      vid = false;
      if (this.photovid == null) {
        this.alertCtrl.create({
          title: "Error",
          message: "Either Photo or video mode must be selected"
        }).present()
        return;
      }
    }
    //console.log(vid)

    if (this.photovid == "false") {
      if (this.ISOTime == undefined || this.ShutterTime == undefined || this.intervalTime == undefined) {

        this.alertCtrl.create({
          title: "Error",
          message: "Please fill in all the fields (ISO, Shutter, Interval)"
        }).present()
        return;
      }
    }
    var tempslot = {
      start: this.startDate.substring(0, this.startDate.length - 10) + "-" + this.startDate.substring(11, this.startDate.length - 1),//remove Z  
      stop: this.endDate.substring(0, this.endDate.length - 10) + "-" + this.endDate.substring(11, this.endDate.length - 1),//remove Z  
      iso: parseInt(this.ISOTime),
      frequency: parseInt(this.intervalTime),
      shutter_speed: parseInt(this.ShutterTime),
      video: vid,
      light: parseInt(this.light),
    }
    console.log(tempslot)

    var flag = 0;

    this.schedule.forEach(element => {
      if ((element.stop > tempslot.start && element.start > tempslot.start) || (element.start < tempslot.start && element.stop < tempslot.start)) {
        console.log('no conflict')

      } else {

        this.alertCtrl.create({
          title: "Error",
          message: "Time-Slot Conflict with: (" + element.start + "-" + element.stop + ")",
          buttons: [{
            text: 'OK',
            role: 'cancel'
          },
          ]
        }).present()
        flag = 1;
      }

    });
    if (flag == 0) {
      this.timeslot = JSON.stringify(tempslot)
      this.schedule.push(tempslot);
      this.printedschedule = JSON.stringify(this.schedule);
    }

  }

  headers = { 'Access-Control-Allow-Origin': 'localhost, *', 'Access-Control-Allow-Methods': 'GET, OPTIONS, POST', "Access-Control-Allow-Headers": "Access-Control-*,", }

  
  async sendConfig() {

    if(this.schedule.length<=0){
      this.alertCtrl.create({
        title: "Error",
        message: "Needs to have atleast 1 slot in the schedule"
      }).present()
      return;
    }

    var senddtt = new Date()


    var senddt = senddtt.toISOString();

    var a = (senddtt.getHours());
    var b = senddtt.getMinutes();
    var c = senddtt.getSeconds()
    var a1; var b1; var c1;
    if (a <= 9) {
      a1 = "0" + a.toString();
    }
    else { a1 = a.toString() }

    if (b <= 9) {
      b1 = "0" + b.toString();
    }
    else { b1 = b.toString() }

    if (c <= 9) {
      c1 = "0" + c.toString();
    }
    else { c1 = c.toString() }




    this.schedule[0].date = senddt.substring(0, 10) + " " + a1 + ":" + b1 + ":" + c1,


      console.log("DTString: " + this.schedule[0].date + " " + senddtt)

    axios({
      method: 'post',
      url: 'http://192.168.5.1:8000/setSchedule',
      //withCredentials: true, // True otherwise I receive another error
      headers: this.headers,
      data: this.schedule,
    }).then(response => {
      console.log('Logout ', response.data.success);
      this.feedlog = "Success";
      this.alertCtrl.create({title: "Success", message:"Schedule Successfully Set!"}).present()
    }).catch((error) => {
      //"No Response. Please check if you are connected to the OOCAM through Wi-Fi!"
      console.log(error)
      if(error="Error: Network Error"){
        error=error+". Please check if you are connected to the OOCAM through Wi-Fi!";
      }
      if(error="Error: Request failed with status code 500"){
        error=error+"."+'\n' +"Please restart the camera and try again or contact us!"
      }
      this.alertCtrl.create({title: "Error", message:error,}).present()
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
        timeout: 5000,
      })

      var temp= response.data;
    
      if (temp.error != null) {
        this.alertCtrl.create({title: "Result", message:"No Config Exists. Please set a configuration first."}).present();
      }
      else{
        this.schedule=response.data;
      }
      //console.log(response);
    } catch (error) {

      if(error=="Error: timeout of 5000ms exceeded"){
        error=error+"."+'\n' +"Check if you are connected to the OOCAM via Wi-Fi!"
      }
      if(error="Error: Request failed with status code 500"){
        error=error+"."+'\n' +"Please restart the camera and try again or contact us!"
      }
      this.alertCtrl.create({title: "View Config Error", message:error}).present();
  
    }
  }

  closetestimg(){
    this.testPicvar=0;
  }

  async testPhoto() {
    try {

      //const response = await axios.get('http://169.254.52.217:8000/testPhoto', Headers, {});
      const response = await axios({
        method: 'get',
        url: 'http://192.168.5.1:8000/testPhoto',
        headers: this.headers,
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

  remitem(tempslot) {

    this.schedule.forEach((element, index) => {
      if (element = tempslot) {
        this.schedule.splice(index, 1);
      }
    });
  }





}





