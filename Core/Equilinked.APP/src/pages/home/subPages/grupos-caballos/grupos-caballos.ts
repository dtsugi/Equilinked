import { Component, OnInit } from "@angular/core";
import { NavController, ToastController } from "ionic-angular";
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
export class GruposCaballos implements OnInit {

    grupos: Array<any> = [];
    gruposRespaldo: Array<any> = [];
    session: UserSessionEntity;

    constructor(private commonService: CommonService,
        private navController: NavController,
        private toastController: ToastController,
        private gruposCaballosService: GruposCaballosService,
        private securityService: SecurityService) {
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.getGruposCaballos(true);
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
        this.grupos = this.gruposCaballosService.filterGrupoCaballo(evt.target.value, this.gruposRespaldo);
    }

    viewGrupo(grupo: any): void {
        console.info(grupo);
        this.navController.push(AdministracionGrupoPage, { grupoId: grupo.ID, gruposCaballosPage: this });
    }

    newGrupo(): void {
        this.navController.push(CreacionGrupoPage, { gruposCaballosPage: this });
    }
}