import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

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
  photovid: string;
  intervalTime: string;
  ISOTime: string;
  TZ: any;
  ShutterTime: string;
  location:number;
  today: string = new Date().toISOString(); // minimum date = current date
  startDate: string;
  min_end_date: string = this.startDate;
  maxDate: string = new Date(new Date().getFullYear(), new Date().getMonth() + 3, new Date().getDate()).toISOString(); // max date = 3 months from today
  feedlog: string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController, 
    public toastCtrl: ToastController) {
      
  }

  timezone=8;

 
addSlot()
{
  console.log(this.photovid);
  
  var vid;
  if(this.photovid=="true"){
    vid=true;
  }else{
    vid=false;
  }
  console.log(vid)
  
  var tempslot = {

    start: this.startDate.substring(0,this.startDate.length -10)+"-"+this.startDate.substring(11,this.startDate.length -1),//remove Z  
    stop: this.endDate.substring(0,this.endDate.length -10)+"-"+this.endDate.substring(11,this.endDate.length -1),//remove Z  
    iso: parseInt(this.ISOTime),
    frequency: parseInt(this.intervalTime),
    shutter_speed: parseInt(this.ShutterTime),
    video: vid,
    
  }

  this.timeslot=JSON.stringify(tempslot)
  this.schedule.push(tempslot);
  this.printedschedule=JSON.stringify(this.schedule);

}

headers = {'Access-Control-Allow-Origin': 'localhost, *', 'Access-Control-Allow-Methods': 'GET, OPTIONS, POST', "Access-Control-Allow-Headers": "Access-Control-*,",}
 
async sendConfig()
{

  var senddtt= new Date()


  var senddt=senddtt.toISOString();

  var a=(senddtt.getHours());
  var b=senddtt.getMinutes();
  var c=senddtt.getSeconds()
  var a1; var b1; var c1;
  if(a<=9){
    a1="0"+a.toString();
  }
  else
  {a1=a.toString()}

  if(b<=9){
    b1="0"+b.toString();
  }
  else
  {b1=b.toString()}

  if(c<=9){
    c1="0"+c.toString();
  }
  else
  {c1=c.toString()}

  


  this.schedule[0].date=senddt.substring(0,10)+" "+a1+":"+b1+":"+c1,


  console.log("DTString: "+this.schedule[0].date+" "+senddtt)
  
  axios({
    method: 'post',
    url: 'http://192.168.5.1:8000/setSchedule',
    //withCredentials: true, // True otherwise I receive another error
    headers: this.headers,
    data: this.schedule,
  }).then(response => {
    console.log('Logout ', response.data.success);
    this.feedlog="Success";
  }).catch(()=>{
    console.log('No Response ');
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
    this.testPic= "data:image/jpeg;base64,"+base64Data;
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
