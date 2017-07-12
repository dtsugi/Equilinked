import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavController, NavParams, Events } from "ionic-angular";
import { Utils, ConstantsConfig } from "../../../app/utils";
import { CommonService } from "../../../services/common.service";
import { AlertaService } from "../../../services/alerta.service";
import { Alerta } from "../../../model/alerta";
import { NotificacionesExtendedInsertPage } from "../notificaciones-extended-insert";
import moment from "moment";
import "moment/locale/es";

@Component({
    templateUrl: "notificacion-general-detalle.html",
    providers: [AlertaService, CommonService]
})

export class NotificacionGeneralDetalle implements OnDestroy, OnInit {

    alertaEntity: Alerta;
    private alertaId: number;
    private caballoId: number;
    private tipoAlerta: number;

    constructor(
        private alertaService: AlertaService,
        private events: Events,
        public navCtrl: NavController,
        public navParams: NavParams,
        private commonService: CommonService
    ) {
        this.alertaEntity = new Alerta();
    }

    ngOnInit(): void {
        this.alertaId = this.navParams.get("alertaId");
        this.caballoId = this.navParams.get("caballoId");
        this.getInfoAlerta(true);
        this.addEvents(); //Registrar eventos
    }

    ngOnDestroy(): void {
        this.removeEvents(); //Dar de baja eventos!
    }

    goBack(): void {
        this.navCtrl.pop();
    }

    edit(): void {
        this.alertaEntity.CaballosList = new Array();
        this.alertaEntity.CaballosList.push(this.caballoId);
        let params: any = {
            alertaEntity: this.alertaEntity,
            isUpdate: true,
            callbackController: this
        };
        this.navCtrl.push(NotificacionesExtendedInsertPage, params);
    }

    private getInfoAlerta(loading: boolean): void {
        if (loading)
            this.commonService.showLoading("Procesando...");

        this.alertaService.getById(this.alertaId)
            .toPromise()
            .then(alerta => {
                if (alerta != null) {
                    alerta.Fecha = moment(alerta.FechaNotificacion).format("dddd, D [de] MMMM [de] YYYY");
                    alerta.Fecha = alerta.Fecha.charAt(0).toUpperCase() + alerta.Fecha.slice(1);
                    alerta.Hora = moment(alerta.HoraNotificacion, "HH:mm").format("hh:mm");
                    alerta.Meridiano = moment(alerta.HoraNotificacion, "HH:mm").format("a").toUpperCase();
                }
                this.alertaEntity = alerta;

                if (loading)
                    this.commonService.hideLoading();
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error obteniendo la información");
            });
    }

    private addEvents(): void {
        this.events.subscribe("notificacion:caballo:refresh", () => {
            this.getInfoAlerta(false);
        });
    }

    private removeEvents(): void {
        this.events.unsubscribe("notificacion:caballo:refresh");
    }
}

