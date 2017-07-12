import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Utils, ConstantsConfig } from '../../app/utils'
import { CommonService } from '../../services/common.service';
import { AlertaService } from '../../services/alerta.service';
import { SecurityService } from '../../services/security.service';
import { Alerta } from '../../model/alerta';
import { UserSessionEntity } from '../../model/userSession';

@Component({
    templateUrl: 'notificaciones-extended-insert.html',
    providers: [CommonService, AlertaService, SecurityService]
})

export class NotificacionesExtendedInsertPage {
    alertaEntity: Alerta;
    showId: boolean = false;
    form: any;
    session: UserSessionEntity;
    tipoAlerta: number;
    isUpdate: boolean;
    profesionalLabel: string;
    btnSubmitText: string;

    constructor(
        private events: Events,
        public navCtrl: NavController,
        public navParams: NavParams,
        private formBuilder: FormBuilder,
        private _commonService: CommonService,
        private _alertaService: AlertaService,
        private _securityService: SecurityService) {
    }

    ngOnInit() {
        this.alertaEntity = new Alerta();
        this.session = this._securityService.getInitialConfigSession();
        if (this._commonService.IsValidParams(this.navParams, ["alertaEntity", "isUpdate", "callbackController"])) {
            this.alertaEntity = this.navParams.get("alertaEntity");
            console.log(this.alertaEntity);
            this.tipoAlerta = this.alertaEntity.Tipo;
            console.log("TIPO ALERTA:", this.tipoAlerta);
            this.isUpdate = this.navParams.get("isUpdate");
            if (this.isUpdate) {
                this.btnSubmitText = "Modificar";
            } else {
                this.btnSubmitText = "Guardar";
                this.alertaEntity.FechaNotificacion = Utils.getDateNow().ToString();
            }
            this.initializeView(this.tipoAlerta);
        }
        this.initForm();
    }

    initializeView(tipoAlerta: number) {
        switch (tipoAlerta) {
            case ConstantsConfig.ALERTA_TIPO_HERRAJE:
                this.profesionalLabel = "Herrero";
                break;
            case ConstantsConfig.ALERTA_TIPO_DENTISTA:
                this.profesionalLabel = "Dentista";
                break;
            case ConstantsConfig.ALERTA_TIPO_DESPARACITACION:
                this.profesionalLabel = "Aplicante";
                break;
        }
    }
    initForm() {
        console.log("ALERTA:", this.alertaEntity);
        this.form = this.formBuilder.group({
            Id: [this.alertaEntity.ID],
            Titulo: [this.alertaEntity.Titulo],
            FechaNotificacion: [this.alertaEntity.FechaNotificacion, Validators.required],
            HoraNotificacion: [this.alertaEntity.HoraNotificacion, Validators.required],
            Tipo: [this.alertaEntity.Tipo],
            Activa: [this.alertaEntity.Activa],
            Descripcion: [this.alertaEntity.Descripcion, Validators.required],
            CaballosList: [(this.alertaEntity.CaballosList)],
            NombreProfesional: [this.alertaEntity.NombreProfesional, Validators.required],
            AlertaGrupal: [false]
        });
    }

    save() {
        this._commonService.showLoading("Guardando..");
        console.log(this.form.value);
        this._alertaService.save(this.form.value)
            .subscribe(res => {
                console.log(res);
                this._commonService.hideLoading();
                this.events.publish("notificaciones:caballo:refresh"); //Refrescamos lista de notificaciones
                if (this.alertaEntity.ID != null && this.alertaEntity.ID > 0) {
                    this.events.publish("notificacion:caballo:refresh");//refrescamos solo la del detalle!
                }
                this.navCtrl.pop().then(() => {
                    this._commonService.ShowInfo("El registro se modifico exitosamente");
                });
            }, error => {
                console.log(error);
                this._commonService.ShowErrorHttp(error, "Error al modificar el registro");
            });
    }

    reloadForm() {
        this.initForm();
    }

    updateCallbackController() {
        let callbackController = this.navParams.get("callbackController");
        callbackController.reloadController();
    }

    goBack() {
        this.navCtrl.pop();
    }
}

