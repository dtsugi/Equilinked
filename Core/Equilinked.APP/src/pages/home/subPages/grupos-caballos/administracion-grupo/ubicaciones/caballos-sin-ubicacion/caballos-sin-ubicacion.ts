import {Component, OnDestroy, OnInit} from "@angular/core";
import {Events, NavController, NavParams} from "ionic-angular";
import {CommonService} from "../../../../../../../services/common.service";
import {GruposCaballosService} from "../../../../../../../services/grupos-caballos.service";
import {SecurityService} from "../../../../../../../services/security.service";
import {UserSessionEntity} from "../../../../../../../model/userSession";
import {FichaCaballoPage} from "../../../../../ficha-caballo/ficha-caballo-home";
import {LanguageService} from '../../../../../../../services/language.service';

@Component({
  templateUrl: "./caballos-sin-ubicacion.html",
  providers: [CommonService, GruposCaballosService, LanguageService, SecurityService]
})
export class CaballosSinUbicacionPage implements OnDestroy, OnInit {
  private REFRESH_EVENT: string = "grupo-caballos-sin-ubicacion:refresh";
  private session: UserSessionEntity;
  private grupo: any;
  caballosRespaldo: Array<any>;
  caballos: Array<any>;
  labels: any = {};
  loading: boolean;

  constructor(private commonService: CommonService,
              private events: Events,
              private gruposCaballosService: GruposCaballosService,
              private navController: NavController,
              private navParams: NavParams,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.loading = true;
    this.caballos = new Array<any>();
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.grupo = this.navParams.get("grupo");
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      this.getCaballosSinUbicacion();
    });
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

  private getCaballosSinUbicacion(): void {
    this.loading = true;
    this.gruposCaballosService.getCaballosByGrupoAndStatusEstablo(this.session.PropietarioId, this.grupo.ID, false)
      .then(caballos => {
        this.caballos = caballos;
        this.caballosRespaldo = caballos;
        this.loading = false;
      }).catch(err => {
      console.error(err);
      this.loading = false;
      this.commonService.ShowInfo(this.labels["PANT017_MSG_ERRCA"]);
    });
  }

  private addEvents(): void {
    this.events.subscribe(this.REFRESH_EVENT, () => {
      this.getCaballosSinUbicacion();
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe(this.REFRESH_EVENT);
  }
}
