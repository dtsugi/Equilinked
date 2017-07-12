import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Events, NavController, NavParams, PopoverController } from 'ionic-angular';
import { Utils, ConstantsConfig } from '../../../../app/utils'
import { CommonService } from '../../../../services/common.service';
import { AlertaService } from '../../../../services/alerta.service';
import { Alerta } from '../../../../model/alerta';
import { NotificacionesExtendedInsertPage } from '../../../notificaciones/notificaciones-extended-insert';
import { NotificacionGeneralDetalle } from "../../../notificaciones/notificacion-general-detalle/notificacion-general-detalle";
import moment from "moment";
import "moment/locale/es";

@Component({
    templateUrl: 'desparasitacion.html',
    providers: [CommonService, AlertaService]
})
export class DesparasitacionPage implements OnInit, OnDestroy {
    idCaballo: number;
    nombreCaballo: string = "";
    historyNotificacionList = [];
    nextNotificacionList = [];
    tipoAlerta: number = ConstantsConfig.ALERTA_TIPO_DESPARACITACION;
    isDeleting: boolean = false;

    constructor(
        private events: Events,
        public navCtrl: NavController,
        public navParams: NavParams,
        public popoverCtrl: PopoverController,
        private _commonService: CommonService,
        private formBuilder: FormBuilder,
        private _alertaService: AlertaService) {
    }

    ngOnInit(): void {
        if (this._commonService.IsValidParams(this.navParams, ["idCaballoSelected", "nombreCaballoSelected"])) {
            this.idCaballo = this.navParams.get("idCaballoSelected");
            this.nombreCaballo = this.navParams.get("nombreCaballoSelected");
            this.getAlertasByCaballo(true);
        }
        this.addEvents();
    }

    ngOnDestroy(): void {
        this.removeEvents();
    }

    private getAlertasByCaballo(loading: boolean): void {
        if (loading)
            this._commonService.showLoading("Procesando..");

        this._alertaService.getAllSerializedByCaballoId(this.idCaballo, ConstantsConfig.ALERTA_FILTER_HISTORY, this.tipoAlerta)
            .toPromise()
            .then(res => {
                this.historyNotificacionList = res.map(alerta => {
                    alerta.Fecha = moment(alerta.FechaNotificacion).format("DD/MM/YY");
                    return alerta;
                });
                return this._alertaService
                    .getAllSerializedByCaballoId(this.idCaballo, ConstantsConfig.ALERTA_FILTER_NEXT, this.tipoAlerta)
                    .toPromise();
            }).then(res => {
                this.nextNotificacionList = res.map(alerta => {
                    alerta.Fecha = moment(alerta.FechaNotificacion).format("D [de] MMMM [de] YYYY");
                    alerta.Hora = moment(alerta.HoraNotificacion, "HH:mm").format("hh:mm a");
                    return alerta;
                });

                if (loading)
                    this._commonService.hideLoading();
            }).catch(err => {
                this._commonService.ShowErrorHttp(err, "Error obteniendo la información");
            });
    }


    edit(notificacion) {
        /* Flag para determinar que no se este eliminando al mismo tiempo */
        if (!this.isDeleting) {
            notificacion.CaballosList = new Array();
            notificacion.CaballosList.push(this.idCaballo);
            this.navCtrl.push(NotificacionesExtendedInsertPage,
                {
                    alertaEntity: notificacion,
                    isUpdate: true,
                    title: "Editar desparasitacion",
                    callbackController: this
                });
        }
    }

    view(notificacion) {
        let params: any = {
            alertaId: notificacion.ID,
            caballoId: this.idCaballo
        };

        this.navCtrl.push(NotificacionGeneralDetalle, params);
    }

    insert() {
        let notificacion: Alerta = new Alerta();
        notificacion.Tipo = this.tipoAlerta;
        notificacion.CaballosList = new Array();
        notificacion.CaballosList.push(this.idCaballo);
        this.navCtrl.push(NotificacionesExtendedInsertPage,
            {
                alertaEntity: notificacion,
                isUpdate: false,
                title: "Nueva desparasitacion",
                callbackController: this
            });
    }

    delete(notificacion: Alerta) {
        this.isDeleting = true;
        this._commonService.showLoading("Eliminando..");
        this._alertaService.delete(notificacion.ID)
            .subscribe(res => {
                this._commonService.hideLoading();
                console.log(res);
                this.reloadController();
                this.isDeleting = false;
            }, error => {
                this._commonService.ShowErrorHttp(error, "Error al eliminar la desparasitacion");
                this.isDeleting = false;
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