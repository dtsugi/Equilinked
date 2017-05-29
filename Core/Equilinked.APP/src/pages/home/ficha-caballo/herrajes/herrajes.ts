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
    notificacionList = [];
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
            this.getAllNotificacionesByCaballoId(this.idCaballo, this.tipoAlerta);
        }
    }

    getAllNotificacionesByCaballoId(caballoId: number, tipoAlertasEnum: number) {
        this._commonService.showLoading("Procesando..");
        this._alertaService.getAllSerializedByCaballoId(caballoId, tipoAlertasEnum)
            .subscribe(res => {
                console.log("RES:", res);
                this.notificacionList = res;
                this._commonService.hideLoading();
            }, error => {
                this._commonService.ShowErrorHttp(error, "Error obteniendo las notificaciones");
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
                    tipoAlerta: this.tipoAlerta,
                    isUpdate: true,
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
        this.getAllNotificacionesByCaballoId(this.idCaballo, this.tipoAlerta);
    }
}