import {Component, OnDestroy, OnInit} from "@angular/core";
import {Events, NavController} from "ionic-angular";
import {CommonService} from "../../../../../../../services/common.service";
import {CaballoService} from "../../../../../../../services/caballo.service";
import {SecurityService} from "../../../../../../../services/security.service";
import {UserSessionEntity} from "../../../../../../../model/userSession";
import {FichaCaballoPage} from "../../../../../ficha-caballo/ficha-caballo-home";
import {LanguageService} from '../../../../../../../services/language.service';

@Component({
  templateUrl: "./caballos-sin-ubicacion.html",
  providers: [LanguageService, CaballoService, CommonService, SecurityService]
})
export class CaballosSinUbicacionPage implements OnDestroy, OnInit {
  private REFRESH_EVENT: string = "grupo-caballos-sin-ubicacion:refresh";
  private session: UserSessionEntity;
  caballosRespaldo: Array<any>;
  caballos: Array<any>;
  labels: any = {};

  constructor(private caballoService: CaballoService,
              private commonService: CommonService,
              private events: Events,
              private navController: NavController,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.caballos = new Array<any>();
    languageService.loadLabels().then(labels => this.labels = labels);
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.getCaballosSinUbicacion(true);
    this.addEvents();
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }

  goBack(): void {
    this.navController.pop();
  }

  filter(evt: any): void {
    let value: string = evt.target.value;
    if (value && value != null) {
      this.caballos = this.caballosRespaldo.filter(caballo => {
        return caballo.Nombre.toUpperCase().indexOf(value.toUpperCase()) > -1;
      });
    } else {
      this.caballos = this.caballosRespaldo;
    }
  }

  view(caballo: any): void {
    this.navController.push(FichaCaballoPage, {
      caballoSelected: caballo
    });
  }

  private getCaballosSinUbicacion(loading: boolean): void {
    if (loading)
      this.commonService.showLoading(this.labels["PANT017_ALT_PRO"]);
    this.caballoService.getCaballosPorEstadoAsociacionEstablo(this.session.PropietarioId, false)
      .then(caballos => {
        this.caballos = caballos;
        this.caballosRespaldo = caballos;
        if (loading)
          this.commonService.hideLoading();
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT017_MSG_ERRCA"]);
    });
  }

  private addEvents(): void {
    this.events.subscribe(this.REFRESH_EVENT, () => {
      this.getCaballosSinUbicacion(false);
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe(this.REFRESH_EVENT);
  }
}
