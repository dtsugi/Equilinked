import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { CommonService } from '../../services/common.service';
import { AlertaService } from '../../services/alerta.service';
import { CaballoService } from '../../services/caballo.service';
import { Alerta } from '../../model/alerta';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificacionesPage } from './notificaciones';
import { NotificacionesViewPage } from './notificaciones-view';
import {Utils} from '../../app/utils'

@Component({
    templateUrl: 'notificaciones-insert.html',
    providers: [CommonService, AlertaService, CaballoService]
})

export class NotificacionesInsertPage {
    alertaEntity: Alerta;
    isUpdate: boolean = false;
    showId: boolean = false;
    caballosList = [];
    tiposAlertaList = [];
    formNotificaciones: any;
    idPropietario: number = 2;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private _commonService: CommonService,
        private _alertaService: AlertaService,
        private _caballoService: CaballoService,
        private formBuilder: FormBuilder,
        public toastCtrl: ToastController) {
    }

    ngOnInit() {
        this.alertaEntity = this.navParams.data.alerta;
        if (this.alertaEntity != undefined) {
            this.isUpdate = true;
        }
        else {
            this.isUpdate = false;
            this.alertaEntity = new Alerta();
            this.alertaEntity.FechaNotificacion = Utils.getDateNow().ToString();
        }
        this.getTiposAlerta();
        this.getAllCaballo();
        this.initForm();
    }

    initForm() {
        console.log(this.alertaEntity, this.alertaEntity.Caballo);
        this.formNotificaciones = this.formBuilder.group({
            Id: [this.alertaEntity.ID],
            Titulo: [this.alertaEntity.Titulo, Validators.required],
            FechaNotificacion: [this.alertaEntity.FechaNotificacion, Validators.required],
            HoraNotificacion: [this.alertaEntity.HoraNotificacion, Validators.required],
            TipoNotificacion: [this.alertaEntity.TipoAlerta, Validators.required],
            Activa: [this.alertaEntity.Activa],
            Descripcion: [this.alertaEntity.Descripcion, Validators.required],
            // Caballo: [(this.alertaEntity.Caballo != null ? this.alertaEntity.Caballo.ID : null), Validators.required]
            CaballoId: [(this.alertaEntity.CaballoId)]
        });
    }

    getAllCaballo() {
        // this._caballoService.getAllByPropietarioId(this.idPropietario)
        //     .subscribe(res => {
        //         console.log(res);
        //         this.caballoList = res;
        //     });
    }

    getTiposAlerta() {
        // this._alertaService.getTipoAlerta()
        //     .subscribe(res => {
        //         console.log(res);
        //         this.tiposAlertaList = res;
        //     }, error => {
        //         this._commonService.ShowErrorHttp(error, "Error al obtener los tipos de notificaciones");
        //     });
    }

    saveNotificacion() {
        if (!this.isUpdate) {
            this._commonService.showLoading("Guardando..");
        } else {
            this._commonService.showLoading("Modificando..");
        }
        console.log(this.formNotificaciones.value);
        this._alertaService.save(this.formNotificaciones.value)
            .subscribe(res => {
                console.log(res);
                this._commonService.hideLoading();
                this._commonService.ShowToast(this.toastCtrl, this._commonService.TOAST_POSITION.bottom, "El registro se modifico exitosamente", 2000);
                if (this.isUpdate) {
                    this.navCtrl.pop();
                    // this.navCtrl.popTo(NotificacionesViewPage, 
                    // { notificacionSelected: this.formNotificaciones.value },
                    // null,NotificacionesViewPage.apply(this,'myCallbackFunction'));                    
                } else {
                    this.navCtrl.push(NotificacionesPage);
                }
            }, error => {
                console.log(error);
                this._commonService.hideLoading();
                this._commonService.ShowToast(this.toastCtrl, this._commonService.TOAST_POSITION.bottom, "Error al modificar el registro", 2000);
            });
    }
}

