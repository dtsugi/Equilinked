import { Component, OnDestroy, OnInit } from "@angular/core";
import { Events, NavController, ToastController } from "ionic-angular";
import { CommonService } from "../../../../services/common.service";
import { GruposCaballosService } from "../../../../services/grupos-caballos.service";
import { SecurityService } from "../../../../services/security.service";
import { CreacionGrupoPage } from "./creacion-grupo/creacion-grupo";
import { UserSessionEntity } from "../../../../model/userSession";
import { AdministracionGrupoPage } from "./administracion-grupo/administracion-grupo";

@Component({
    selector: "grupos-caballos",
    templateUrl: "./grupos-caballos.html",
    providers: [CommonService, GruposCaballosService, SecurityService]
})
export class GruposCaballos implements OnDestroy, OnInit {

    grupos: Array<any> = [];
    gruposRespaldo: Array<any> = [];
    session: UserSessionEntity;

    constructor(
        private events: Events,
        private commonService: CommonService,
        private navController: NavController,
        private toastController: ToastController,
        private gruposCaballosService: GruposCaballosService,
        private securityService: SecurityService) {
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.getGruposCaballos(true);
        this.registredEvents();
    }

    ngOnDestroy(): void {
        this.unregistredEvents();
    }

    getGruposCaballos(showLoading: boolean): void {
        if (showLoading)
            this.commonService.showLoading("Procesando..");
        this.gruposCaballosService.getGruposCaballosByPropietarioId(this.session.PropietarioId)
            .then(grupos => {
                this.gruposRespaldo = grupos;
                this.grupos = grupos;
                if (showLoading)
                    this.commonService.hideLoading();
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error al cargar los grupos");
            });
    }

    filter(evt: any): void {
        this.grupos = this.gruposCaballosService.filterGruposByName(evt.target.value, this.gruposRespaldo);
    }

    viewGrupo(grupo: any): void {
        this.navController.push(AdministracionGrupoPage, { grupoId: grupo.ID });
    }

    newGrupo(): void {
        this.navController.push(CreacionGrupoPage);
    }

    private registredEvents(): void {
        this.events.subscribe("grupos:refresh", () => {
            this.getGruposCaballos(false);
        });
    }

    private unregistredEvents(): void {
        this.events.unsubscribe("grupos:refresh");
    }
}