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
  isFilter: boolean;

  constructor(private events: Events,
              private commonService: CommonService,
              private navController: NavController,
              private gruposCaballosService: GruposCaballosService,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.loading = true;
    this.isFilter = false;
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
        this.loading = false;
        this.filter(null);//Aplicar filtrado
      }).catch(err => {
      this.loading = false;
      console.error(err);
      this.commonService.ShowInfo(this.labels['PANT002_MSG_ERRCG']);
    });
  }

  filter(evt: any): void {
    this.isFilter = false;
    this.gruposRespaldo.forEach(grupo => {
      grupo.DescripcionFilter = grupo.Descripcion;
      grupo.CaballosFilter = grupo.GrupoCaballo.length + ' ' + this.labels['PANT002_LBL_GUCA'];
    });
    let value: string = evt ? evt.target.value : null;
    if (value) {
      this.grupos = this.gruposRespaldo.filter(grupo => {
        grupo.Caballos = grupo.GrupoCaballo.length + ' ' + this.labels['PANT002_LBL_GUCA'];//leyenda de n caballos
        let indexMatchGrupo = grupo.Descripcion.toUpperCase().indexOf(value.toUpperCase());
        let indexMatchCaballos = grupo.Caballos.toUpperCase().indexOf(value.toUpperCase());
        if (indexMatchGrupo > -1) {
          let textReplace = grupo.Descripcion.substring(indexMatchGrupo, indexMatchGrupo + value.length);
          grupo.DescripcionFilter = grupo.Descripcion.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
        }
        if (indexMatchCaballos > -1) {
          let textReplace = grupo.Caballos.substring(indexMatchCaballos, indexMatchCaballos + value.length);
          grupo.CaballosFilter = grupo.Caballos.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
        }
        this.isFilter = true;
        return indexMatchGrupo > -1 || indexMatchCaballos > -1;
      });
    } else {
      this.grupos = this.gruposRespaldo;
    }
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
