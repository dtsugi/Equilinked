import {Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {NavController, NavParams} from 'ionic-angular';
import {CommonService} from '../../../../services/common.service';
import {AlimentacionService} from '../../../../services/alimentacion.service';
import {Alimentacion} from '../../../../model/alimentacion';
import {LanguageService} from '../../../../services//language.service';

@Component({
  templateUrl: 'alimentacion-edit.html',
  providers: [LanguageService, CommonService, AlimentacionService]
})
export class AlimentacionEditPage {
  labels: any = {};
  form: any;
  alimentacion: Alimentacion;
  nombreCaballo: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _commonService: CommonService,
              private _alimentacionService: AlimentacionService,
              private formBuilder: FormBuilder,
              private languageService: LanguageService) {
    this.nombreCaballo = "";
    languageService.loadLabels().then(labels => this.labels = labels);
  }

  ngOnInit() {
    this.alimentacion = new Alimentacion();
    if (this._commonService.IsValidParams(this.navParams, ["alimentacionEntity", "callbackController"])) {
      this.alimentacion = this.navParams.get("alimentacionEntity");
      this.nombreCaballo = this.navParams.get("nombreCaballo");
    }
    this.initForm();
  }

  initForm() {
    console.log(this.alimentacion);
    this.form = this.formBuilder.group({
      ID: [this.alimentacion.ID],
      Solido: [this.alimentacion.Solido],
      SuplementosDietarios: [this.alimentacion.SuplementosDietarios],
      Pasto: [this.alimentacion.Pasto],
      Caballo_ID: [this.alimentacion.Caballo_ID]
    });
  }

  save() {
    this._commonService.showLoading(this.labels["PANT008_ALT_CARG"]);
    console.log("SAVE:", this.form.value);
    this._alimentacionService.save(this.form.value)
      .subscribe(res => {
        console.log(res);
        this._commonService.hideLoading();
        this._commonService.ShowInfo(this.labels["PANT008_MSG_REGOK"]);
        this.goBack();
      }, error => {
        console.log(error);
        this._commonService.hideLoading();
        this._commonService.ShowInfo(this.labels["PANT008_MSG_ERRMOD"]);
      });
  }

  goBack() {
    let callbackController = this.navParams.get("callbackController");
    callbackController.reloadController();
    this.navCtrl.pop();
  }
}
