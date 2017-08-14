import {Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {NavController, NavParams, PopoverController} from 'ionic-angular';
import {CommonService} from '../../../../services/common.service';
import {AlimentacionService} from '../../../../services/alimentacion.service';
import {Alimentacion} from '../../../../model/alimentacion';
import {PopoverAlimentacionPage} from './pop-over/pop-over-alimentacion';
import {AlimentacionEditPage} from './alimentacion-edit';
import {LanguageService} from '../../../../services//language.service';

@Component({
  templateUrl: 'alimentacion.html',
  providers: [LanguageService, CommonService, AlimentacionService]
})
export class AlimentacionPage {
  labels: any = {};
  idCaballo: number;
  nombreCaballo: string = "";
  alimentacion: Alimentacion;
  edicion: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public popoverCtrl: PopoverController,
              private _commonService: CommonService,
              private _alimentacionService: AlimentacionService,
              private languageService: LanguageService) {
    this.edicion = true;
    languageService.loadLabels().then(labels => this.labels = labels);
  }

  ngOnInit() {
    this.alimentacion = new Alimentacion();
    if (this._commonService.IsValidParams(this.navParams, ["idCaballoSelected", "nombreCaballoSelected"])) {
      this.idCaballo = this.navParams.get("idCaballoSelected");
      this.nombreCaballo = this.navParams.get("nombreCaballoSelected");
      console.log(this.idCaballo);
      this.getAlimentacionByIdCaballo(this.idCaballo);
    }
  }

  getAlimentacionByIdCaballo(idCaballo) {
    this.edicion = false;
    this._commonService.showLoading(this.labels["PANT008_ALT_CARG"]);
    this._alimentacionService.getByCaballoId(idCaballo)
      .subscribe(res => {
        this._commonService.hideLoading();
        if (res) {
          this.alimentacion = res;
        } else {
          this._commonService.ShowInfo(this.labels["PANT008_MSG_NOALI"]);
        }
        this.alimentacion.Caballo_ID = this.idCaballo;
      }, error => {
        this._commonService.ShowErrorHttp(error, this.labels["PANT008_MSG_ERRAL"]);
      });
  }

  presentPopover(ev) {
    let popover = this.popoverCtrl.create(PopoverAlimentacionPage, {
      alimentacionEntity: this.alimentacion,
      callbackController: this
    });
    popover.present({
      ev: ev
    });
  }

  edit() {
    this.navCtrl.push(AlimentacionEditPage, {
      alimentacionEntity: this.alimentacion,
      nombreCaballo: this.nombreCaballo,
      callbackController: this
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  reloadController() {
    this.getAlimentacionByIdCaballo(this.idCaballo);
  }
}
