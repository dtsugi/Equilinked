import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavController, NavParams, Events } from "ionic-angular";
import { Utils, ConstantsConfig } from "../../../app/utils";
import { CommonService } from "../../../services/common.service";
import { AlertaService } from "../../../services/alerta.service";
import { Alerta } from "../../../model/alerta";
import { NotificacionesInsertPage } from "../notificaciones-insert";
import moment from "moment";
import "moment/locale/es";

@Component({
    templateUrl: "notificacion-nota-detalle.html",
    providers: [AlertaService, CommonService]
})

export class NotificacionNotaDetalle implements OnDestroy, OnInit {

    alertaEntity: Alerta;
    private alertaId: number;
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
        let params: any = {
            alertaEntity: this.alertaEntity,
            isFromNotas: true,
            isUpdate: true,
            callbackController: this
        };
        this.navCtrl.push(NotificacionesInsertPage, params);
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
        this.events.subscribe("notificacion:nota:caballo:refresh", () => {
            this.getInfoAlerta(false);
        });
    }

    private removeEvents(): void {
        this.events.unsubscribe("notificacion:nota:caballo:refresh");
    }
}

