import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MusicPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-music',
  templateUrl: 'music.html',
})
export class MusicPage {
  song: string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.song = navParams.get('song')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MusicPage');
  }

}
