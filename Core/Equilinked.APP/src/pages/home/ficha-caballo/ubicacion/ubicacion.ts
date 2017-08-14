import {Component, OnDestroy, OnInit} from "@angular/core";
import {Events, ModalController, NavController, NavParams, PopoverController} from "ionic-angular";
import {EstablosService} from "../../../../services/establos.service";
import {CommonService} from "../../../../services/common.service";
import {OpcionesUbicacionModal} from "./opciones-ubicacion/opciones-ubicacion";
import {LanguageService} from '../../../../services/language.service';
import {AppConfig} from "../../../../app/app.config";
import {OpcionesTelefonoPopover} from "./opciones-telefono/opciones-telefono";

@Component({
  templateUrl: "./ubicacion.html",
  providers: [LanguageService, CommonService, EstablosService]
})
export class UbicacionCaballoPage implements OnDestroy, OnInit {
  KEY_GOOGLE: string = AppConfig.API_KEY_GOOGLE;
  private caballo;
  grupo: any;
  establo: any;
  labels: any = {};

  constructor(private events: Events,
              private commonService: CommonService,
              private establosService: EstablosService,
              private modalController: ModalController,
              private navController: NavController,
              private navParams: NavParams,
              private languageService: LanguageService,
              private popoverController: PopoverController) {
    languageService.loadLabels().then(labels => this.labels = labels);
  }

  ngOnInit(): void {
    this.caballo = this.navParams.get("caballo");
    this.getInfoEstablo(true);
    this.addEvents();
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }

  edit(): void {
    let params: any = {establo: JSON.parse(JSON.stringify(this.establo)), navCtrl: this.navController};
    this.modalController.create(OpcionesUbicacionModal, params).present();
  }

  openOptions(ev, number: string): void {
    this.popoverController.create(OpcionesTelefonoPopover, {telephone: number})
      .present({
        ev: ev
      });
  }

  private getInfoEstablo(showLoading: boolean): void {
    if (showLoading) {
      this.commonService.showLoading(this.labels["PANT011_ALT_PRO"]);
    }
    this.establosService.getEstabloById(this.caballo.Establo_ID)
      .then(establo => {
        this.establo = establo;
        if (showLoading) {
          this.commonService.hideLoading();
        }
      }).catch(err => {
      console.error(err);
      this.commonService.ShowErrorHttp(err, this.labels["PANT011_MSG_ERRCA"]);
    });
  }

  private addEvents(): void {
    this.events.subscribe("caballo-ubicacion:refresh", () => {
      this.getInfoEstablo(false);
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("caballo-ubicacion:refresh");
  }
}
