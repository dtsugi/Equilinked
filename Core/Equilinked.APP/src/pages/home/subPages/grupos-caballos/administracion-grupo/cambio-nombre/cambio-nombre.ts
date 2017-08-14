import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {Events, NavController, NavParams, ToastController} from "ionic-angular";
import {CommonService} from "../../../../../../services/common.service";
import {GruposCaballosService} from "../../../../../../services/grupos-caballos.service";
import {LanguageService} from '../../../../../../services/language.service';

@Component({
  templateUrl: "./cambio-nombre.html",
  providers: [LanguageService, CommonService, GruposCaballosService]
})
export class CambioNombrePage implements OnInit {
  private grupo: any;
  labels: any = {};

  constructor(private commonService: CommonService,
              private events: Events,
              private gruposCaballosService: GruposCaballosService,
              private navController: NavController,
              private navParams: NavParams,
              private languageService: LanguageService) {
    languageService.loadLabels().then(labels => this.labels = labels);
  }

  ngOnInit(): void {
    this.grupo = this.navParams.get("grupo");
  }

  goBack(): void {
    this.navController.pop();
  }

  save(): void {
    this.commonService.showLoading(this.labels["PANT014_ALT_PRO"]);
    this.gruposCaballosService.updateGrupo(this.grupo)
      .then(resp => {
        this.events.publish("grupo:refresh"); //Refresco la pantalla de grupo seleccionado
        this.events.publish("grupos:refresh"); //Refresco la lista de grupos existentes
        this.commonService.hideLoading();
        this.navController.pop();
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT014_MSG_ERRNO"]);
    });
  }
}
