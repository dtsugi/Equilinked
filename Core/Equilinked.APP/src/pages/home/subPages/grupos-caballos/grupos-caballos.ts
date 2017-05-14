import { Component, OnInit } from "@angular/core";
import { NavController, ToastController } from "ionic-angular";
import { CommonService } from "../../../../services/common.service";
import { GruposCaballosService } from "../../../../services/grupos-caballos.service";
import { SecurityService } from "../../../../services/security.service";
import { AdminGruposCaballosPage } from "../../admin-grupos-caballos/admin-grupos-caballos";
import { UserSessionEntity } from "../../../../model/userSession";
import { GruposCaballosDetailPage } from "./grupos-caballos-detail";

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
        this.getGruposCaballos();
    }

    getGruposCaballos(): void {
        this.commonService.showLoading("Procesando..");
        this.gruposCaballosService.getGruposCaballosByPropietarioId(this.session.PropietarioId)
            .then(grupos => {
                this.gruposRespaldo = grupos;
                this.grupos = grupos;
                this.commonService.hideLoading();
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error al cargar los grupos");
            });
    }

    filter(evt: any): void {
        this.grupos = this.gruposCaballosService.filterGrupoCaballo(evt.target.value, this.gruposRespaldo);
    }

    viewGrupo(grupo: any): void {
        this.navController.push(GruposCaballosDetailPage, { grupo: grupo, gruposCaballosPage: this });
    }

    newGrupo(): void {
        this.navController.push(AdminGruposCaballosPage, { gruposCaballosPage: this });
    }
}