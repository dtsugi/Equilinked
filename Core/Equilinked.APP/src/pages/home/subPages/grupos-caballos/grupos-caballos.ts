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
  loading: boolean;
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
    this.loading = true;
    languageService.loadLabels().then(labels => this.labels = labels);
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.getGruposCaballos();
    this.addEvents();
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }

  getGruposCaballos(): void {
    this.loading = true;
    this.gruposCaballosService.getGruposCaballosByPropietarioId(this.session.PropietarioId)
      .then(grupos => {
        this.gruposRespaldo = grupos;
        this.grupos = grupos;
        this.loading = false;
      }).catch(err => {
      this.loading = false;
      console.error(err);
      this.commonService.ShowInfo(this.labels['PANT002_MSG_ERRCG']);
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
      this.getGruposCaballos();
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("grupos:refresh");
  }
}
