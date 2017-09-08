import {Component} from '@angular/core';
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
  }

  ngOnInit() {
    this.alimentacion = new Alimentacion();
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      if (this._commonService.IsValidParams(this.navParams, ["idCaballoSelected", "nombreCaballoSelected"])) {
        this.idCaballo = this.navParams.get("idCaballoSelected");
        this.nombreCaballo = this.navParams.get("nombreCaballoSelected");
        this.getAlimentacionByIdCaballo(this.idCaballo);
      }
    });
  }

  getAlimentacionByIdCaballo(idCaballo) {
    this.edicion = false;
    this._commonService.showLoading(this.labels["PANT008_ALT_CARG"]);
    this._alimentacionService.getByCaballoId(idCaballo)
      .toPromise()
      .then(res => {
        if (res) {
          this._commonService.hideLoading();
          this.alimentacion = res;
        } else {
          this._commonService.ShowInfo(this.labels["PANT008_MSG_NOALI"]);
        }
        this.alimentacion.Caballo_ID = this.idCaballo;
      }).catch(err => {
      this._commonService.ShowErrorHttp(err, this.labels["PANT008_MSG_ERRAL"]);
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
