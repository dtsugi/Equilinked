import {Component, OnDestroy, OnInit} from "@angular/core";
import {Events, NavController} from "ionic-angular";
import {CommonService} from "../../../../services/common.service";
import {GruposCaballosService} from "../../../../services/grupos-caballos.service";
import {SecurityService} from "../../../../services/security.service";
import {CreacionGrupoPage} from "./creacion-grupo/creacion-grupo";
import {UserSessionEntity} from "../../../../model/userSession";
import {AdministracionGrupoPage} from "./administracion-grupo/administracion-grupo";
import {LanguageService} from '../../../../services/language.service';

@Component({
  selector: "grupos-caballos",
  templateUrl: "./grupos-caballos.html",
  providers: [CommonService, LanguageService, GruposCaballosService, SecurityService]
})
export class GruposCaballos implements OnDestroy, OnInit {
  grupos: Array<any> = [];
  gruposRespaldo: Array<any> = [];
  session: UserSessionEntity;
  labels: any = {};

  constructor(private events: Events,
              private commonService: CommonService,
              private navController: NavController,
              private gruposCaballosService: GruposCaballosService,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    languageService.loadLabels().then(labels => this.labels = labels);
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.getGruposCaballos(false);
    this.addEvents();
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }

  getGruposCaballos(showLoading: boolean): void {
    if (showLoading)
      this.commonService.showLoading(this.labels['PANT002_ALT_PRO']);
    this.gruposCaballosService.getGruposCaballosByPropietarioId(this.session.PropietarioId)
      .then(grupos => {
        this.gruposRespaldo = grupos;
        this.grupos = grupos;
        if (showLoading)
          this.commonService.hideLoading();
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels['PANT002_MSG_ERRCG']);
    });
  }

  filter(evt: any): void {
    this.grupos = this.gruposCaballosService.filterGruposByName(evt.target.value, this.gruposRespaldo);
  }

  viewGrupo(grupo: any): void {
    this.navController.push(AdministracionGrupoPage, {grupoId: grupo.ID});
  }

  newGrupo(): void {
    this.navController.push(CreacionGrupoPage);
  }

  private addEvents(): void {
    this.events.subscribe("grupos:refresh", () => {
      this.getGruposCaballos(false);
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("grupos:refresh");
  }
}
