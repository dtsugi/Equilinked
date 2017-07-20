import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Utils } from '../../app/utils'
import { CommonService } from '../../services/common.service';
import { AlertaService } from '../../services/alerta.service';
import { CaballoService } from '../../services/caballo.service';
import { SecurityService } from '../../services/security.service';
import { AlertaCaballoService } from '../../services/alerta.caballo.service';
import { Alerta } from '../../model/alerta';
import { UserSessionEntity } from '../../model/userSession';
import { NotificacionesPage } from './notificaciones';
import { NotificacionesViewPage } from './notificaciones-view';
import moment from "moment";

@Component({
    templateUrl: 'notificaciones-insert.html',
    providers: [CommonService, AlertaService, CaballoService, SecurityService, AlertaCaballoService]
})

export class NotificacionesInsertPage {
    alertaEntity: Alerta;
    isUpdate: boolean = false;
    isFromNotas: boolean = false;
    disableFromNotas: boolean = false;
    showId: boolean = false;
    selectCaballos = [];
    tiposAlertaList = [];
    formNotificaciones: any;
    session: UserSessionEntity;

    constructor(
        private events: Events,
        public navCtrl: NavController,
        public navParams: NavParams,
        private formBuilder: FormBuilder,
        private _commonService: CommonService,
        private _alertaService: AlertaService,
        private _caballoService: CaballoService,
        private _securityService: SecurityService,
        private _alertaCaballoService: AlertaCaballoService) {
    }

    ngOnInit() {
        this.alertaEntity = new Alerta();
        this.session = this._securityService.getInitialConfigSession();
        if (this._commonService.IsValidParams(this.navParams, ["alertaEntity", "isFromNotas", "isUpdate", "callbackController"])) {
            this.alertaEntity = this.navParams.get("alertaEntity");
            this.alertaEntity.FechaNotificacion = moment(this.alertaEntity.FechaNotificacion).format("YYYY-MM-DD");
            this.isFromNotas = this.navParams.get("isFromNotas");
            this.isUpdate = this.navParams.get("isUpdate");
            if (this.alertaEntity.ID > 0) {
                console.log("ID:", this.alertaEntity.ID);
                this.getAllCaballosRelacionados(this.alertaEntity.ID);
            }
            this.disableFromNotas = this.isFromNotas;
            if (!this.isUpdate) {
                this.alertaEntity.FechaNotificacion = Utils.getDateNow().ToString();
            }
        }

        this.getTiposAlerta();
        this.getAllCaballo();
        this.initForm();
    }

    goBack(): void {
        this.navCtrl.pop();
    }

    initForm() {
        console.log("ALERTA:", this.alertaEntity);
        this.formNotificaciones = this.formBuilder.group({
            Propietario_ID: [this.alertaEntity.Propietario_ID],
            Id: [this.alertaEntity.ID],
            Titulo: [this.alertaEntity.Titulo, Validators.required],
            FechaNotificacion: [this.alertaEntity.FechaNotificacion, Validators.required],
            HoraNotificacion: [this.alertaEntity.HoraNotificacion, Validators.required],
            Tipo: [this.alertaEntity.Tipo, Validators.required],
            Activa: [this.alertaEntity.Activa],
            Descripcion: [this.alertaEntity.Descripcion, Validators.required],
            CaballosList: [(this.alertaEntity.CaballosList)],
            AlertaGrupal: [false]
        });
    }

    getAllCaballo() {
        this._caballoService.getAllComboBoxByPropietarioId(this.session.PropietarioId)
            .subscribe(res => {
                console.log(res);
                this.selectCaballos = res;
                this.reloadForm();
            }, error => {
                console.log(error);
                this._commonService.ShowErrorHttp(error, "Error cargando los caballos");
            });
    }

    getTiposAlerta() {
        this._alertaService.getAllTiposAlerta()
            .subscribe(res => {
                console.log(res);
                this.tiposAlertaList = res;
                this.reloadForm();
            }, error => {
                console.log(error);
                this._commonService.ShowErrorHttp(error, "Error cargando los tipos de alertas");
            });
    }

    saveNotificacion() {
        if (this.isUpdate) {
            this._commonService.showLoading("Modificando..");
        } else {
            this._commonService.showLoading("Guardando..");
        }
        let alerta: any = this.formNotificaciones.value;
        alerta.FechaNotificacion = alerta.FechaNotificacion + " " + alerta.HoraNotificacion + ":00";
        console.log(this.formNotificaciones.value);
        this._alertaService.save(this.formNotificaciones.value)
            .subscribe(res => {
                console.log(res);
                this._commonService.hideLoading();
                this.events.publish("notificaciones:notas:caballo:refresh");
                if (this.alertaEntity.ID != null && this.alertaEntity.ID > 0) {
                    this.events.publish("notificacion:nota:caballo:refresh");
                }
                this.navCtrl.pop().then(() => {
                    this._commonService.ShowInfo("El registro se modifico exitosamente");
                });
            }, error => {
                console.log(error);
                this._commonService.hideLoading();
                this._commonService.ShowInfo("Error al modificar el registro");
            });
    }

    getAllCaballosRelacionados(alertaId: number) {
        this._alertaCaballoService.getAllCaballoIdByAlertaId(alertaId)
            .subscribe(res => {
                console.log(res);
                this.alertaEntity.CaballosList = res;
                this.reloadForm();
            }, error => {
                console.log(error);
                this._commonService.ShowErrorHttp(error, "Error cargando los caballos relacionados a la notificacion");
            });
    }

    reloadForm() {
        this.initForm();
    }

    updateCallbackController() {
        let callbackController = this.navParams.get("callbackController");
        callbackController.reloadController();
    }
}

