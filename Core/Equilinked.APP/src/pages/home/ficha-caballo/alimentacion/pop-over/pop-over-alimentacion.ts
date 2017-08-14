import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {CommonService} from '../../../../../services/common.service';
import {AlimentacionEditPage} from '../alimentacion-edit';

@Component({
  templateUrl: 'pop-over-alimentacion.html',
  selector: 'pop-over-alimentacion',
  providers: [CommonService]
})
export class PopoverAlimentacionPage {
  alimentacion;
  callbackController;

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
  }

  ngOnInit() {
    if (this.navParams.data) {
      this.alimentacion = this.navParams.get("alimentacionEntity");
      this.callbackController = this.navParams.get("callbackController");
    }
  }

  editAlimentacion() {
    this.navCtrl.push(AlimentacionEditPage, {
      alimentacionEntity: this.alimentacion,
      callbackController: this.callbackController
    });
  }
}
