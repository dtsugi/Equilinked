import { Component, OnInit, OnDestroy } from "@angular/core";
import { Events, NavController, NavParams, PopoverController, ToastController } from "ionic-angular";
import { CommonService } from "../../../../../services/common.service";
import { GruposCaballosService } from "../../../../../services/grupos-caballos.service";
import { SecurityService } from "../../../../../services/security.service";
import { UserSessionEntity } from "../../../../../model/userSession";
import { GruposCaballos } from "../grupos-caballos";
import { OpcionesFichaGrupo } from "./opciones-ficha/opciones-ficha";
import { LanguageService } from '../../../../../services/language.service';

@Component({
    templateUrl: "./administracion-grupo.html",
    providers: [LanguageService, CommonService, GruposCaballosService, SecurityService]
})
export class AdministracionGrupoPage implements OnInit, OnDestroy {

    private grupoId: number;
    private session: UserSessionEntity;

    labels: any = {};
    grupo: any;
    segmentSelection: string;
    parametrosCaballos: any;

    constructor(
        private commonService: CommonService,
        private events: Events,
        private navController: NavController,
        private navParams: NavParams,
        private popoverController: PopoverController,
        private toastController: ToastController,
        private gruposCaballosService: GruposCaballosService,
        private securityService: SecurityService,
        private languageService: LanguageService
    ) {
        languageService.loadLabels().then(labels => this.labels = labels);
        this.grupo = {};
        this.segmentSelection = "ficha";
        this.parametrosCaballos = { modoEdicion: false, getCountSelected: null, grupoDefault: false };
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.grupoId = this.navParams.get("grupoId");
        this.getInfoGrupo(true);
        this.addEvents();
    }

    ngOnDestroy(): void {
        this.removeEvents();
    }

    goBack(): void {
        this.navController.pop();
    }

    /*Muestra las opciones cuando se encuentra activa "FICHA"*/
    showOptionsFicha(ev: any): void {
        let popover = this.popoverController.create(OpcionesFichaGrupo, {
            navCtrlGrupo: this.navController,
            grupo: JSON.parse(JSON.stringify(this.grupo))
        });
        popover.present({
            ev: ev
        });
    }

    /*Activa la seleccion de cabalos para eliminacion en "CABALLOS" */
    enabledDeleteCaballos(): void {
        this.parametrosCaballos.modoEdicion = true;
        this.events.publish("caballos-grupo:eliminacion:enabled");
    }

    /*Desactiva la seleccion de cabalos para eliminacion en "CABALLOS" */
    disabledDeleteCaballos(): void {
        this.parametrosCaballos.modoEdicion = false;
    }

    /*Solicitar confirmacion de eliminacion en "CABALLOS"*/
    delete(): void {
        this.events.publish("caballos-grupo:eliminacion:confirmed");
    }

    private getInfoGrupo(showLoading: boolean): void {
        if (showLoading)
            this.commonService.showLoading(this.labels["PANT013_ALT_PRO"]);
        this.gruposCaballosService.getGrupoById(this.grupoId)
            .then(grupo => {
                this.grupo = grupo;
                this.parametrosCaballos.grupoDefault = grupo.GrupoDefault;
                if (showLoading)
                    this.commonService.hideLoading();
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, this.labels["PANT013_MSG_ERRCG"]);
            });
    }

    private addEvents(): void {
        this.events.subscribe("grupo:refresh", () => {
            this.getInfoGrupo(false);
        });
    }

    private removeEvents(): void {
        this.events.unsubscribe("grupo:refresh");
    }
}