import {Component} from "@angular/core";
import {AlertController, Events, NavParams, NavController, ViewController} from "ionic-angular";
import {CommonService} from "../../../../../../services/common.service";
import {GruposCaballosService} from "../../../../../../services/grupos-caballos.service";
import {CambioNombrePage} from "../cambio-nombre/cambio-nombre";
import {LanguageService} from '../../../../../../services/language.service';

@Component({
  templateUrl: "opciones-ficha.html",
  providers: [LanguageService, CommonService, GruposCaballosService]
})
export class OpcionesFichaGrupo {
  private navCtrlGrupo: NavController;
  private grupo: any;
  labels: any = {};

  constructor(private alertController: AlertController,
              private events: Events,
              private gruposCaballosService: GruposCaballosService,
              private navParams: NavParams,
              private commonService: CommonService,
              private viewController: ViewController,
              private languageService: LanguageService) {
    languageService.loadLabels().then(labels => this.labels = labels);
    this.grupo = {};
  }

  ngOnInit() {
    this.navCtrlGrupo = this.navParams.get("navCtrlGrupo");
    this.grupo = this.navParams.get("grupo");
  }

  editName(): void {
    this.viewController.dismiss();
    this.navCtrlGrupo.push(CambioNombrePage, {grupo: this.grupo});
  }

  deleteGrupoHandler = () => {
    this.commonService.showLoading(this.labels["PANT013_ALT_PRO"]);
    this.gruposCaballosService.deleteGrupoById(this.grupo.ID)
      .then(res => {
        this.events.publish("grupos:refresh");
        this.commonService.hideLoading();
        this.navCtrlGrupo.pop();
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT013_MSG_ERRELG"]);
    });
  }

  delete() {
    this.viewController.dismiss();
    let alert = this.alertController.create({
      subTitle: this.labels["PANT013_ALT_MSGELG"],
      buttons: [
        {
          text: this.labels["PANT013_BTN_CAN"],
          role: "cancel"
        },
        {
          text: this.labels["PANT013_BTN_ACEP"],
          handler: this.deleteGrupoHandler
        }
      ]
    });
    alert.present();
  }
}
