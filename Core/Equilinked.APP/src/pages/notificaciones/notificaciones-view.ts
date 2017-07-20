import { Component, OnDestroy, OnInit } from '@angular/core';
import { Events, NavController, NavParams, PopoverController } from 'ionic-angular';
import { CommonService } from '../../services/common.service';
import { AlertaService } from '../../services/alerta.service';
import { SecurityService } from '../../services/security.service';
import { Alerta } from '../../model/alerta';
import { UserSessionEntity } from '../../model/userSession';
import { EdicionNotificacionGeneralPage } from "./edicion-notificacion/edicion-notificacion";
import moment from "moment";
import "moment/locale/es";

@Component({
    templateUrl: 'notificaciones-view.html',
    providers: [CommonService, AlertaService, SecurityService]
})

export class NotificacionesViewPage implements OnDestroy, OnInit {

    private alertaId: number;
    private session: UserSessionEntity;

    alertaEntity: any;

    constructor(
        private events: Events,
        public navCtrl: NavController,
        public navParams: NavParams,
        public popoverCtrl: PopoverController,
        private _commonService: CommonService,
        private _alertaService: AlertaService,
        private securityService: SecurityService
    ) {
    }

    ngOnInit(): void {
        console.log("ngOnInit");
        this.session = this.securityService.getInitialConfigSession();
        this.alertaId = this.navParams.get("alertaId");

        this.loadInfoAlerta(true);
        this.addEvents();
    }

    ngOnDestroy(): void {
        this.removeEvents();
    }

    edit(): void {
        console.info(this.alertaEntity);
        let params = {
            alerta: JSON.parse(JSON.stringify(this.alertaEntity))
        };
        this.navCtrl.push(EdicionNotificacionGeneralPage, params);
    }

    private loadInfoAlerta(loading: boolean): void {
        if (loading)
            this._commonService.showLoading("Procesando...");

        this._alertaService.getAlertaById(this.session.PropietarioId, this.alertaId)
            .then(alerta => {
                let d = new Date(alerta.FechaNotificacion);
                alerta.Fecha = moment(d).format("dddd, D [de] MMMM [de] YYYY");
                alerta.Fecha = alerta.Fecha.charAt(0).toUpperCase() + alerta.Fecha.slice(1);
                alerta.Hora = moment(d).format("hh:mm");
                alerta.Meridiano = moment(d).format("a").toUpperCase();
                this.alertaEntity = alerta;
                if (loading)
                    this._commonService.hideLoading();
            }).catch(err => {
                this._commonService.ShowErrorHttp(err, "Ocurrió un error al consultar");
            });
    }

    private addEvents(): void {
        this.events.subscribe("notificacion:refresh", () => {
            this.loadInfoAlerta(false);//carga de nuevo info de alerta
        });
    }

    private removeEvents(): void {
        this.events.unsubscribe("notificacion:refresh");
    }
}

