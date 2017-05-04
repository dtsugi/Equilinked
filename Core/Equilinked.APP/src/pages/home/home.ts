import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  menuSelected: string;

  constructor(public navCtrl: NavController) {
    this.menuSelected = 'caballos_ind';
  }

  menuChange(event) {
    this.menuSelected = event.value;
  }
  
}
