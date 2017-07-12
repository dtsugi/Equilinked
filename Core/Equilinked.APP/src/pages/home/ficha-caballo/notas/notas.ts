import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Events, NavController, NavParams, PopoverController } from 'ionic-angular';
import { Utils, ConstantsConfig } from '../../../../app/utils'
import { CommonService } from '../../../../services/common.service';
import { AlertaService } from '../../../../services/alerta.service';
import { Alerta } from '../../../../model/alerta';
import { NotificacionNotaDetalle } from "../../../notificaciones/notificacion-nota-detalle/notificacion-nota-detalle";
import { NotificacionesInsertPage } from '../../../notificaciones/notificaciones-insert';

@Component({
    templateUrl: 'notas.html',
    providers: [CommonService, AlertaService]
})
export class NotasPage implements OnInit, OnDestroy {

    idCaballo: number;
    nombreCaballo: string = "";
    notificacionList = [];
    tipoAlerta: number = 5;
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

    ngOnInit() {
        if (this._commonService.IsValidParams(this.navParams, ["idCaballoSelected", "nombreCaballoSelected"])) {
            this.idCaballo = this.navParams.get("idCaballoSelected");
            this.nombreCaballo = this.navParams.get("nombreCaballoSelected");
            this.getAllNotificacionesByCaballoId(true);
        }
        this.addEvents();
    }

    ngOnDestroy(): void {
        this.removeEvents();
    }

    getAllNotificacionesByCaballoId(loading: boolean) {
        if (loading)
            this._commonService.showLoading("Procesando..");

        this._alertaService.getAllSerializedByCaballoId(this.idCaballo, ConstantsConfig.ALERTA_FILTER_ALL, this.tipoAlerta)
            .subscribe(res => {
                console.log("RES:", res);
                this.notificacionList = res;

                if (loading)
                    this._commonService.hideLoading();
            }, error => {
                this._commonService.ShowErrorHttp(error, "Error obteniendo las notificaciones");
            });
    }

    goViewNotificacion(notificacion) {
        /* Flag para determinar que no se este eliminando al mismo tiempo */
        if (!this.isDeleting) {
            this.navCtrl.push(NotificacionNotaDetalle,
                {
                    alertaId: notificacion.ID
                });
        }
    }

    goInsertNotificacion() {
        let notificacion: Alerta = new Alerta();
        notificacion.Tipo = this.tipoAlerta;
        notificacion.CaballosList = new Array();
        notificacion.CaballosList.push(this.idCaballo);
        this.navCtrl.push(NotificacionesInsertPage,
            {
                alertaEntity: notificacion,
                isFromNotas: true,
                isUpdate: false,
                callbackController: this
            });
    }

    deleteNotification(notificacion: Alerta) {
        this.isDeleting = true;
        this._commonService.showLoading("Eliminando..");
        this._alertaService.delete(notificacion.ID)
            .subscribe(res => {
                this._commonService.hideLoading();
                console.log(res);
                this.getAllNotificacionesByCaballoId(true);

                this.isDeleting = false;
            }, error => {
                this._commonService.ShowErrorHttp(error, "Error al eliminar la nota");
                this.isDeleting = false;
            });
    }

    goBack() {
        this.navCtrl.pop();
    }

    private addEvents(): void {
        this.events.subscribe("notificaciones:notas:caballo:refresh", () => {
            this.getAllNotificacionesByCaballoId(false);
        });
    }

    private removeEvents(): void {
        this.events.subscribe("notificaciones:notas:caballo:refresh");
    }
}