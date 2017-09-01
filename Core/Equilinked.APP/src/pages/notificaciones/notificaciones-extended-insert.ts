import {Component} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AlertController, ModalController, NavController, NavParams, Events} from 'ionic-angular';
import {ConstantsConfig} from '../../app/utils'
import {CommonService} from '../../services/common.service';
import {AlertaService} from '../../services/alerta.service';
import {SecurityService} from '../../services/security.service';
import {RecordatorioService} from '../../services/recordatorio.service';
import {Alerta} from '../../model/alerta';
import {UserSessionEntity} from '../../model/userSession';
import {EquiModalRecordatorio} from "../../utils/equi-modal-recordatorio/equi-modal-recordatorio";
import moment from "moment";
import {LanguageService} from '../../services/language.service';

@Component({
  templateUrl: 'notificaciones-extended-insert.html',
  providers: [LanguageService, CommonService, AlertaService, RecordatorioService, SecurityService]
})
export class NotificacionesExtendedInsertPage {
  private session: UserSessionEntity;
  private tipoAlerta: number;
  labels: any = {};
  alerta: Alerta;
  form: any;
  profesionalLabel: string;
  recordatorios: Array<any>;

  constructor(private alertController: AlertController,
              private events: Events,
              private modalController: ModalController,
              public navCtrl: NavController,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private _commonService: CommonService,
              private _alertaService: AlertaService,
              private _securityService: SecurityService,
              private recordatorioService: RecordatorioService,
              private languageService: LanguageService) {
  }

  ngOnInit() {
    this.alerta = new Alerta();
    this.session = this._securityService.getInitialConfigSession();
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      if (this._commonService.IsValidParams(this.navParams, ["alertaEntity"])) {
        this.alerta = this.navParams.get("alertaEntity");
        this.alerta.FechaNotificacion = moment(this.alerta.FechaNotificacion).format("YYYY-MM-DD");
        this.tipoAlerta = this.alerta.Tipo;
        if (this.alerta.ID) {
          if (this.alerta.AlertaRecordatorio) {
            this.alerta.AlertaRecordatorio.forEach(a => {
              this.buildLabelRecordatorio(a);
            });
          }
        }
        this.initializeView(this.tipoAlerta);
      }
      this.initForm();
    });
  }

  initializeView(tipoAlerta: number) {
    switch (tipoAlerta) {
      case ConstantsConfig.ALERTA_TIPO_HERRAJE:
        this.profesionalLabel = this.labels["PANT010_TXT_NOHE"];
        break;
      case ConstantsConfig.ALERTA_TIPO_DENTISTA:
        this.profesionalLabel = this.labels["PANT010_TXT_NODE"];
        break;
      case ConstantsConfig.ALERTA_TIPO_DESPARACITACION:
        this.profesionalLabel = this.labels["PANT010_TXT_NODES"];
        break;
    }
    this._commonService.showLoading(this.labels["PANT010_ALT_PRO"]);
    this.recordatorioService.getAllRecordatorios()
      .then(recordatorios => {
        this.recordatorios = recordatorios;
        this._commonService.hideLoading();
      }).catch(err => {
      this._commonService.ShowErrorHttp(err, this.labels["PANT010_MSG_ERRCA"]);
    });
  }

  initForm() {
    console.log("ALERTA:", this.alerta);
    this.form = this.formBuilder.group({
      FechaNotificacion: [this.alerta.FechaNotificacion, Validators.required],
      HoraNotificacion: [this.alerta.HoraNotificacion, Validators.required],
      Descripcion: [this.alerta.Descripcion, Validators.required],
      NombreProfesional: [this.alerta.NombreProfesional, Validators.required],
      Activa: [this.alerta.Activa]
    });
  }

  viewRecordatorios(): void {
    let inputs: Array<any> = this.recordatorios.map(r => {
      return {type: "radio", label: r.Descripcion, value: r}
    });
    this.alertController.create({
      inputs: inputs,
      buttons: [
        {text: this.labels["PANT010_BTN_CAN"], role: "cancel"},
        {text: this.labels["PANT010_BTN_ACE"], handler: this.callbackViewRecordatorios}
      ]
    }).present();
  }

  removeRecordatorio(): void {
    this.alerta.AlertaRecordatorio = new Array<any>();
  }

  save() {
    this._commonService.showLoading(this.labels["PANT010_ALT_PRO"]);
    this.buildAlerta(this.alerta, this.form.value);
    let promise;
    if (this.alerta.ID) {
      promise = this._alertaService.updateAlerta(this.session.PropietarioId, this.alerta);
    } else {
      promise = this._alertaService.saveAlerta(this.session.PropietarioId, this.alerta);
    }
    promise.then(() => {
      this._commonService.hideLoading();
      this.navCtrl.pop().then(() => {
        this.events.publish("notificaciones:refresh");
        this.events.publish("notificaciones:caballo:refresh"); //Refrescamos lista de notificaciones
        if (this.alerta.ID != null && this.alerta.ID > 0) {
          this.events.publish("notificacion:caballo:refresh");//refrescamos solo la del detalle!
        }
      });
    }).catch(error => {
      this._commonService.ShowErrorHttp(error, this.labels["PANT010_MSG_ERRGUA"]);
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  private buildAlerta(alerta: Alerta, formValues: any): void {
    alerta.FechaNotificacion = formValues["FechaNotificacion"];
    alerta.HoraNotificacion = formValues["HoraNotificacion"];
    alerta.Descripcion = formValues["Descripcion"];
    alerta.NombreProfesional = formValues["NombreProfesional"];
    alerta.Activa = formValues["Activa"];
    alerta.FechaNotificacion = alerta.FechaNotificacion + " " + alerta.HoraNotificacion;
  }

  callbackViewRecordatorios = (data) => {
    let recordatorio: any;
    if (data.UnidadTiempo) {
      recordatorio = {
        ValorTiempo: data.ValorTiempo,
        UnidadTiempo_ID: data.UnidadTiempo_ID,
        UnidadTiempo: data.UnidadTiempo
      };
      this.addRecordatorio(recordatorio);
    } else {
      let params: any = {
        funcionUnidadesTiempo: this.recordatorioService.getAllUnidadesTiempo()
      };
      let modal = this.modalController.create(EquiModalRecordatorio, params);
      modal.onDidDismiss(recordatorioPersonalizado => {
        if (recordatorioPersonalizado) {
          this.addRecordatorio(recordatorioPersonalizado);//lo agregamos a la alerta
        }
      });
      modal.present(); //Abrir!
    }
  }

  private addRecordatorio(recordatorio: any): void {
    this.buildLabelRecordatorio(recordatorio);
    this.alerta.AlertaRecordatorio.push(recordatorio);
  }

  private buildLabelRecordatorio(recordatorio: any): void {
    recordatorio.Descripcion = recordatorio.ValorTiempo + " " + recordatorio.UnidadTiempo.Descripcion;
    recordatorio.UnidadTiempo = null;
  }
}

