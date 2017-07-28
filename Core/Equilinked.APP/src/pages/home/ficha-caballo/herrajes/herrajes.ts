import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Events, NavController, NavParams, PopoverController } from 'ionic-angular';
import { Utils, ConstantsConfig } from '../../../../app/utils'
import { CommonService } from '../../../../services/common.service';
import { AlertaService } from '../../../../services/alerta.service';
import { AlertaCaballoService } from '../../../../services/alerta.caballo.service';
import { Alerta } from '../../../../model/alerta';
import { UserSessionEntity } from '../../../../model/userSession';
import { SecurityService } from '../../../../services/security.service';
import { NotificacionesExtendedInsertPage } from '../../../notificaciones/notificaciones-extended-insert';
import { NotificacionGeneralDetalle } from "../../../notificaciones/notificacion-general-detalle/notificacion-general-detalle";
import moment from "moment";
import "moment/locale/es";
import { LanguageService } from '../../../../services/language.service';

@Component({
    templateUrl: 'herrajes.html',
    providers: [LanguageService, CommonService, AlertaService, AlertaCaballoService, SecurityService]
})
export class HerrajesPage implements OnInit, OnDestroy {

    private session: UserSessionEntity;

    labels: any = {};
    idCaballo: number;
    nombreCaballo: string = "";
    historyNotificacionList;
    nextNotificacionList;
    tipoAlerta: number = ConstantsConfig.ALERTA_TIPO_HERRAJE;
    isDeleting: boolean = false;

    constructor(
        private events: Events,
        public navCtrl: NavController,
        public navParams: NavParams,
        public popoverCtrl: PopoverController,
        private _commonService: CommonService,
        private formBuilder: FormBuilder,
        private _alertaService: AlertaService,
        private alertaCaballoService: AlertaCaballoService,
        private securityService: SecurityService,
        private languageService: LanguageService
    ) {
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.languageService.loadLabels().then(labels => {
            this.labels = labels;
            if (this._commonService.IsValidParams(this.navParams, ["idCaballoSelected", "nombreCaballoSelected"])) {
                this.idCaballo = this.navParams.get("idCaballoSelected");
                this.nombreCaballo = this.navParams.get("nombreCaballoSelected");
                this.getAlertasByCaballo(true);
            }
            this.addEvents();
        });

    }

    ngOnDestroy(): void {
        this.removeEvents();
    }

    private getAlertasByCaballo(loading: boolean): void {
        let fecha: string = moment().format("YYYY-MM-DD");
        if (loading)
            this._commonService.showLoading(this.labels["PANT007_ALT_CARG"]);

        this.alertaCaballoService.getAlertasByCaballoId(
            this.session.PropietarioId, this.idCaballo, fecha, this.tipoAlerta,
            ConstantsConfig.ALERTA_FILTER_HISTORY, null, ConstantsConfig.ALERTA_ORDEN_DESCENDENTE
        ).then(res => {
            this.historyNotificacionList = res.map(alerta => {
                let d = new Date(alerta.FechaNotificacion);
                alerta.Fecha = moment(d).format("DD/MM/YY");
                return alerta;
            });
            return this.alertaCaballoService
                .getAlertasByCaballoId(this.session.PropietarioId, this.idCaballo, fecha, this.tipoAlerta,
                ConstantsConfig.ALERTA_FILTER_NEXT, 3, ConstantsConfig.ALERTA_ORDEN_ASCENDENTE);
        }).then(res => {
            this.nextNotificacionList = res.map(alerta => {
                let d = new Date(alerta.FechaNotificacion);
                alerta.Fecha = moment(d).format("D [de] MMMM [de] YYYY");
                alerta.Hora = moment(d).format("hh:mm a");
                return alerta;
            });

            if (loading)
                this._commonService.hideLoading();
        }).catch(err => {
            this._commonService.ShowErrorHttp(err, this.labels["PANT007_MSG_ERRALT"]);
        });
    }

    view(notificacion) {
        let params: any = {
            alertaId: notificacion.ID,
            caballoId: this.idCaballo
        };

        this.navCtrl.push(NotificacionGeneralDetalle, params);
    }

    edit(notificacion) {
        this._commonService.showLoading(this.labels["PANT007_ALT_CARG"]);
        this._alertaService.getAlertaById(this.session.PropietarioId, notificacion.ID)
            .then(alerta => {
                this._commonService.hideLoading();
                this.navCtrl.push(NotificacionesExtendedInsertPage, { alertaEntity: alerta });
            }).catch(err => {
                console.error(err);
            });
    }

    insert() {
        let notificacion: Alerta = new Alerta();
        notificacion.Tipo = this.tipoAlerta;
        notificacion.Propietario_ID = this.session.PropietarioId;
        notificacion.Titulo = this.labels["PANT007_LBL_VIHER"];
        notificacion.AlertaCaballo = [{ Caballo_ID: this.idCaballo }];

        this.navCtrl.push(NotificacionesExtendedInsertPage,
            {
                alertaEntity: notificacion,
                isUpdate: false,
                title: "Nuevo Herraje",
                callbackController: this
            });
    }

    delete(notificacion: Alerta) {
        this._commonService.showLoading(this.labels["PANT007_ALT_CARG"]);
        this.alertaCaballoService.deleteAlertasCaballosByIds(this.session.PropietarioId, this.idCaballo, [notificacion.ID])
            .then(() => {
                this._commonService.hideLoading();
                this.events.publish("notificaciones:refresh");//Actualimamos area de ontificaciones
                this.getAlertasByCaballo(true);
            }).catch(err => {
                this._commonService.ShowErrorHttp(err, this.labels["PANT007_MSG_ERRELI"]);
            });
    }

    reloadController() {
        this.getAlertasByCaballo(true);
    }

    goBack() {
        this.navCtrl.pop();
    }

    private addEvents(): void {
        this.events.subscribe("notificaciones:caballo:refresh", () => {
            this.getAlertasByCaballo(false);
        });
    }

    private removeEvents(): void {
        this.events.unsubscribe("notificaciones:caballo:refresh");
    }
}