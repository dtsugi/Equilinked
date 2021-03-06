import {Component, OnDestroy, OnInit} from "@angular/core";
import {Events, ModalController, NavController, NavParams, Platform, PopoverController} from "ionic-angular";
import {DomSanitizer} from '@angular/platform-browser';
import {EstablosService} from "../../../../services/establos.service";
import {CommonService} from "../../../../services/common.service";
import {OpcionesUbicacionModal} from "./opciones-ubicacion/opciones-ubicacion";
import {LanguageService} from '../../../../services/language.service';
import {AppConfig} from "../../../../app/app.config";
import {EquiOpcionesTelefonoPopover} from "../../../../utils/equi-opciones-telefono/equi-opciones-telefono-popover";

@Component({
  templateUrl: "./ubicacion.html",
  providers: [LanguageService, CommonService, EstablosService]
})
export class UbicacionCaballoPage implements OnDestroy, OnInit {
  URL_API_GOOGLE: string = AppConfig.API_GOOGLE_URL;
  KEY_GOOGLE: string = AppConfig.API_KEY_GOOGLE;
  private caballo;
  grupo: any;
  establo: any;
  labels: any = {};

  constructor(private events: Events,
              private commonService: CommonService,
              private domSanitizer: DomSanitizer,
              private establosService: EstablosService,
              private modalController: ModalController,
              private navController: NavController,
              private navParams: NavParams,
              private languageService: LanguageService,
              private platform: Platform,
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
    this.popoverController.create(EquiOpcionesTelefonoPopover, {telephone: number})
      .present({
        ev: ev
      });
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
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
