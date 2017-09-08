import {Component, OnDestroy, OnInit} from "@angular/core";
import {Events, NavController, NavParams, PopoverController} from "ionic-angular";
import {DomSanitizer} from '@angular/platform-browser';
import {AdminEstablosPage} from "./admin-establo";
import {EdicionEstabloCaballosPage} from "./edicion-caballos";
import {EstablosService} from "../../../../services/establos.service";
import {CommonService} from "../../../../services/common.service";
import {LanguageService} from '../../../../services/language.service';
import {AppConfig} from "../../../../app/app.config";
import {EquiOpcionesTelefonoPopover} from "../../../../utils/equi-opciones-telefono/equi-opciones-telefono-popover";

@Component({
  templateUrl: "./info-establo.html",
  providers: [LanguageService, CommonService, EstablosService],
  styles: [`
    .icon-hidden {
      visibility: hidden;
    }
  `]
})
export class InfoEstabloPage implements OnDestroy, OnInit {
  URL_API_GOOGLE: string = AppConfig.API_GOOGLE_URL;
  KEY_GOOGLE: string = AppConfig.API_KEY_GOOGLE;
  private establoId: number;
  establo: any;
  labels: any = {};

  constructor(private events: Events,
              private commonService: CommonService,
              private domSanitizer: DomSanitizer,
              private establosService: EstablosService,
              private navController: NavController,
              private navParams: NavParams,
              private popoverController: PopoverController,
              private languageService: LanguageService) {
  }

  ngOnInit(): void {
    this.establoId = this.navParams.get("establoId");
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      this.getInfoEstablo(true);
    });
    this.addEvents();
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }

  openOptionsTelephone(ev, number: string): void {
    this.popoverController.create(EquiOpcionesTelefonoPopover, {telephone: number})
      .present({
        ev: ev
      });
  }

  getInfoEstablo(showLoading: boolean): void {
    if (showLoading) {
      this.commonService.showLoading(this.labels["PANT033_ALT_PRO"]);
    }
    this.establosService.getEstabloById(this.establoId)
      .then(establo => {
        this.establo = establo;
        if (showLoading) {
          this.commonService.hideLoading();
        }
      }).catch(err => {
      console.error(err);
      this.commonService.ShowErrorHttp(err, this.labels["PANT033_MSG_ERR"]);
    });
  }

  edit(): void {
    let params: any = {
      establo: JSON.parse(JSON.stringify(this.establo)),
      showConfirmSave: false
    };
    this.navController.push(AdminEstablosPage, params);
  }

  viewCaballos(): void {
    let params: any = {
      establo: JSON.parse(JSON.stringify(this.establo))
    };
    this.navController.push(EdicionEstabloCaballosPage, params);
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  private addEvents(): void {
    this.events.subscribe("establo:refresh", () => {
      this.getInfoEstablo(false);
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("establo:refresh");
  }
}
