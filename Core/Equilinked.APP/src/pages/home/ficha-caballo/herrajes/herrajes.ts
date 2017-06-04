import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams, PopoverController} from 'ionic-angular';
import {Utils, ConstantsConfig} from '../../../../app/utils'
import { CommonService } from '../../../../services/common.service';
import {AlertaService} from '../../../../services/alerta.service';
import {Alerta} from '../../../../model/alerta';
import {NotificacionesExtendedInsertPage} from '../../../notificaciones/notificaciones-extended-insert';

@Component({
    templateUrl: 'herrajes.html',
    providers: [CommonService, AlertaService]
})
export class HerrajesPage {
    idCaballo: number;
    historyNotificacionList = [];
    nextNotificacionList = [];
    tipoAlerta: number = ConstantsConfig.ALERTA_TIPO_HERRAJE;
    isDeleting: boolean = false;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public popoverCtrl: PopoverController,
        private _commonService: CommonService,
        private formBuilder: FormBuilder,
        private _alertaService: AlertaService) {
    }

    ngOnInit() {
        if (this._commonService.IsValidParams(this.navParams, ["idCaballoSelected"])) {
            this.idCaballo = this.navParams.get("idCaballoSelected");
            this.getHistorySerializedByCaballoId(this.idCaballo, this.tipoAlerta);
            this.getNextSerializedByCaballoId(this.idCaballo, this.tipoAlerta);
        }
    }

    getHistorySerializedByCaballoId(caballoId: number, tipoAlertasEnum: number) {
        this._commonService.showLoading("Procesando..");
        this._alertaService.getAllSerializedByCaballoId(caballoId, ConstantsConfig.ALERTA_FILTER_HISTORY, tipoAlertasEnum)
            .subscribe(res => {
                console.log("RES:", res);
                this.historyNotificacionList = res;
                this._commonService.hideLoading();
            }, error => {
                this._commonService.ShowErrorHttp(error, "Error obteniendo el historial de herrajes");
            });
    }

    getNextSerializedByCaballoId(caballoId: number, tipoAlertasEnum: number) {
        this._commonService.showLoading("Procesando..");
        this._alertaService.getAllSerializedByCaballoId(caballoId, ConstantsConfig.ALERTA_FILTER_NEXT, tipoAlertasEnum)
            .subscribe(res => {
                console.log("RES:", res);
                this.nextNotificacionList = res;
                this._commonService.hideLoading();
            }, error => {
                this._commonService.ShowErrorHttp(error, "Error obteniendo los proximos herrajes");
            });
    }

    view(notificacion) {
        /* Flag para determinar que no se este eliminando al mismo tiempo */
        if (!this.isDeleting) {
            notificacion.CaballosList = new Array();
            notificacion.CaballosList.push(this.idCaballo);
            this.navCtrl.push(NotificacionesExtendedInsertPage,
                {
                    alertaEntity: notificacion,
                    isUpdate: true,
                    title: "Editar Herraje",
                    callbackController: this
                });
        }
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
                title: "Nuevo Herraje",
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
                this._commonService.ShowErrorHttp(error, "Error al eliminar la nota");
                this.isDeleting = false;
            });
    }

    reloadController() {
        this.getHistorySerializedByCaballoId(this.idCaballo, this.tipoAlerta);
        this.getNextSerializedByCaballoId(this.idCaballo, this.tipoAlerta);
    }
}