import {Component, OnInit} from "@angular/core";
import {Events, NavController, NavParams} from "ionic-angular";
import {CommonService} from "../../../../services/common.service";
import {CaballoService} from "../../../../services/caballo.service";
import {LanguageService} from '../../../../services/language.service';

@Component({
  templateUrl: "./cambio-nombre.html",
  providers: [LanguageService, CaballoService, CommonService]
})
export class CambioNombreCaballoPage implements OnInit {
  private caballo: any;
  labels: any = {};

  constructor(private caballoService: CaballoService,
              private commonService: CommonService,
              private events: Events,
              private navController: NavController,
              private navParams: NavParams,
              private languageService: LanguageService) {
    languageService.loadLabels().then(labels => this.labels = labels);
  }

  ngOnInit(): void {
    this.caballo = this.navParams.get("caballo");
  }

  goBack(): void {
    this.navController.pop();
  }

  save(): void {
    this.commonService.showLoading(this.labels["PANT005_ALT_CAR"]);
    this.caballoService.save(this.caballo)
      .toPromise()
      .then(resp => {
        this.commonService.hideLoading();
        this.events.publish("caballo-ficha:refresh");//Ficha del caballo con opciones
        this.events.publish("caballos:refresh");//Lista de caballos del home
        this.events.publish("caballos-grupo:refresh");//Lista de caballos del grupo
        this.events.publish("grupo-caballos-sin-ubicacion:refresh");//Cuando viene de la lista de caballos sin ubicacion
        this.events.publish("establo-caballos:refresh");//Lista de caballos de establo (cuando se viene de establo)
        this.navController.pop().then(() => {
          this.commonService.ShowInfo(this.labels["PANT005_MSG_MOD"]);
        });
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT005_MSG_ERRMO"]);
    });
  }
}
