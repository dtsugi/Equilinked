import { Component, OnDestroy, OnInit } from '@angular/core';
import { Events, NavController, AlertController } from 'ionic-angular';
import { CommonService } from '../../services/common.service';
import { NotificacionesEditPage } from "./notificaciones-edit/notificaciones-edit"
import { NotificacionesViewPage } from './notificaciones-view';
import { AlertaService } from '../../services/alerta.service';
import { SecurityService } from '../../services/security.service';
import { Alerta, DateObject } from '../../model/alerta';
import { UserSessionEntity } from '../../model/userSession';
import { Utils } from '../../app/utils';
import { ConstantsConfig } from "../../app/utils";
import { EdicionNotificacionGeneralPage } from "./edicion-notificacion/edicion-notificacion";
import moment from "moment";
import "moment/locale/es";

@Component({
    selector: 'page-notificaciones',
    templateUrl: 'notificaciones.html',
    providers: [CommonService, AlertaService, SecurityService]
})
export class NotificacionesPage implements OnInit, OnDestroy {

    private session: UserSessionEntity;
    private notificacionesProximasResp: Array<any>;

    dateMillis: number;
    selectedTab: string;
    today: string;
    notificacionesHoy: Array<any>;
    notificacionesProximas: Array<any>;

    constructor(
        private events: Events,
        public navCtrl: NavController,
        public alertController: AlertController,
        private _commonService: CommonService,
        private _alertaService: AlertaService,
        private _securityService: SecurityService
    ) {
        this.notificacionesHoy = new Array<any>();
        this.notificacionesProximas = new Array<any>();
    }

    ngOnInit(): void {
        this.session = this._securityService.getInitialConfigSession();
        this.selectedTab = "hoy";
        this.loadNotificaciones();
        this.addEvents();
    }

    ngOnDestroy(): void {
        this.removeEvents();
    }

    loadNotificaciones(): void {
        this.dateMillis = new Date().getTime();
        if (this.selectedTab === "hoy") {
            this.loadNotificacionesToday();
        } else {
            this.loadNextNotificaciones();
        }
    }

    filter(evt: any): void {
        let textFilter: string = evt.target.value;
        if (textFilter) {
            let value = textFilter.toUpperCase();
            let mapDates: Map<string, any> = new Map<string, any>();
            debugger;
            this.notificacionesProximasResp.forEach(pn => {
                if (pn.FechaCorta.toUpperCase().indexOf(value) > -1
                    || pn.Dia.toUpperCase().indexOf(value) > -1) { //El dia corresponde al texto buscado?
                    mapDates.set(pn.Fecha, pn);
                } else {
                    pn.Notificaciones.forEach(n => {
                        if (n.Hora.toUpperCase().indexOf(value) > -1
                            || (n.Ubicacion != null && n.Ubicacion.toUpperCase().indexOf(value) > -1)
                            || (n.Titulo != null && n.Titulo.toUpperCase().indexOf(value) > -1)) { //Alguna parte dela notificacion corresponde al texto buscado?

                            if (!mapDates.has(pn.Fecha)) {
                                let notificacionDia = {
                                    Fecha: pn.Fecha,
                                    Dia: pn.Dia,
                                    FechaCorta: pn.FechaCorta,
                                    Notificaciones: []
                                };
                                mapDates.set(pn.Fecha, notificacionDia);
                            }
                            mapDates.get(pn.Fecha).Notificaciones.push(n);
                        }
                    });
                }
            });
            this.notificacionesProximas = Array.from(mapDates.values());
        } else {
            this.notificacionesProximas = this.notificacionesProximasResp;
        }

    }

    newNotification(): void {
        this.navCtrl.push(EdicionNotificacionGeneralPage);
    }

    viewNotification(notificacion: any): void {
        console.log(notificacion);
        this.navCtrl.push(NotificacionesViewPage, { alertaId: notificacion.ID });
    }

    private loadNotificacionesToday(): void {
        let today = moment();
        this.today = today.format("dddd, D [de] MMMM [de] YYYY");
        this.today = this.today.charAt(0).toUpperCase() + this.today.slice(1);

        this._commonService.showLoading("Procesando...");
        this._alertaService.getAlertasByPropietario(this.session.PropietarioId, today.format("YYYY-MM-DD"),
            ConstantsConfig.ALERTA_TIPO_TODAS, ConstantsConfig.ALERTA_FILTER_TODAY)
            .then(alertas => {
                this.notificacionesHoy = alertas.map(a => {
                    let d = new Date(a.FechaNotificacion);
                    a.Expired = d.getTime() <= this.dateMillis;
                    a.Hora = moment(d).format("hh:mm A").toUpperCase();
                    return a;
                });
                this._commonService.hideLoading();
            }).catch(err => {
                this._commonService.ShowErrorHttp(err, "Ocurrió un error al consultar");
            });
    }

    private loadNextNotificaciones(): void {
        let today = moment();
        this._commonService.showLoading("Procesando...");
        this._alertaService.getAlertasByPropietario(this.session.PropietarioId, today.format("YYYY-MM-DD"),
            ConstantsConfig.ALERTA_TIPO_TODAS, ConstantsConfig.ALERTA_FILTER_AFTER_TODAY)
            .then(alertas => {
                let mapDates: Map<string, any> = new Map<string, any>();
                let day: any;
                alertas.forEach(nn => {
                    let d = new Date(nn.FechaNotificacion);
                    nn.Hora = moment(d).format("hh:mm A").toUpperCase();
                    let date: string = moment(d).format("dddd-DD MMMM");
                    if (!mapDates.has(date)) {
                        let partsDate: any = date.split("-");
                        day = {
                            Fecha: date,
                            Dia: partsDate[0].charAt(0).toUpperCase() + partsDate[0].slice(1),
                            FechaCorta: partsDate[1].toUpperCase().substring(0, 6),
                            Notificaciones: []
                        };
                        mapDates.set(date, day);
                    }
                    day = mapDates.get(date);
                    day.Notificaciones.push(nn);
                });

                this.notificacionesProximas = Array.from<any>(mapDates.values());
                this.notificacionesProximasResp = this.notificacionesProximas;
                this._commonService.hideLoading();
            }).catch(err => {
                this._commonService.ShowErrorHttp(err, "Ocurrió un error al consultar");
            });
    }

    private addEvents(): void {
        this.events.subscribe("notificaciones:refresh", () => {
            this.loadNotificaciones();
        });
    }

    private removeEvents(): void {
        this.events.unsubscribe("notificaciones:refresh");
    }
}
