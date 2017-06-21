import { Component, OnInit } from "@angular/core";
import { Events, NavController, NavParams, PopoverController, ToastController } from "ionic-angular";
import { CommonService } from "../../../../../services/common.service";
import { GruposCaballosService } from "../../../../../services/grupos-caballos.service";
import { SecurityService } from "../../../../../services/security.service";
import { UserSessionEntity } from "../../../../../model/userSession";
import { GruposCaballos } from "../grupos-caballos";
import { OpcionesFichaGrupo } from "./opciones-ficha/opciones-ficha";

@Component({
    templateUrl: "./administracion-grupo.html",
    providers: [CommonService, GruposCaballosService, SecurityService]
})
export class AdministracionGrupoPage implements OnInit {

    private gruposCaballos: GruposCaballos;
    private grupoId: number;
    private session: UserSessionEntity;

    grupo: any;
    segmentSelection: string;

    constructor(
        private commonService: CommonService,
        private events: Events,
        private navController: NavController,
        private navParams: NavParams,
        private popoverController: PopoverController,
        private toastController: ToastController,
        private gruposCaballosService: GruposCaballosService,
        private securityService: SecurityService
    ) {
        this.grupo = {};
        this.segmentSelection = "ficha";
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.gruposCaballos = this.navParams.get("gruposCaballosPage");
        this.grupoId = this.navParams.get("grupoId");
        this.getInfoGrupo(true);
        this.registredEvents();
    }

    showOptionsFicha(ev: any): void {
        let popover = this.popoverController.create(OpcionesFichaGrupo, {
            navCtrlGrupo: this.navController,
            grupo: JSON.parse(JSON.stringify(this.grupo))
        });
        popover.present({
            ev: ev
        });
    }

    private getInfoGrupo(showLoading: boolean): void {
        if (showLoading)
            this.commonService.showLoading("Procesando...");
        this.gruposCaballosService.getGrupoById(this.grupoId)
            .then(grupo => {
                this.grupo = grupo;
                if (showLoading)
                    this.commonService.hideLoading();
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error al cargar el grupo");
            });
    }

    private registredEvents(): void {
        this.events.subscribe("grupo:updated", () => {
            this.getInfoGrupo(false);
            this.gruposCaballos.getGruposCaballos(false);
        });
        this.events.subscribe("grupo:deleted", () => {
            this.gruposCaballos.getGruposCaballos(false);
        });
    }
}