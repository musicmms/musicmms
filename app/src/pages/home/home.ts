import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SMS } from '@ionic-native/sms';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  songName: any;
  constructor(public navCtrl: NavController, private sms: SMS) {


  }
  sendMusic() {
    console.log(this.songName)
    var options = {
      replaceLineBreaks: false, // true to replace \n by a new line, false by default

    }
    this.sms.send('4086769926', this.songName, options)
      .then(() => {
        alert("success");
      }, () => {
        alert("failed");
      });
  }

}
