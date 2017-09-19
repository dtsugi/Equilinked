import {Component} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AlertController, ModalController, NavController, NavParams, Events} from 'ionic-angular';
import {CommonService} from '../../services/common.service';
import {AlertaService} from '../../services/alerta.service';
import {CaballoService} from '../../services/caballo.service';
import {SecurityService} from '../../services/security.service';
import {RecordatorioService} from '../../services/recordatorio.service';
import {AlertaCaballoService} from '../../services/alerta.caballo.service';
import {Alerta} from '../../model/alerta';
import {UserSessionEntity} from '../../model/userSession';
import {EquiModalRecordatorio} from "../../utils/equi-modal-recordatorio/equi-modal-recordatorio";
import moment from "moment";
import {LanguageService} from '../../services/language.service';

@Component({
  templateUrl: 'notificaciones-insert.html',
  providers: [LanguageService, CommonService, AlertaService, CaballoService, SecurityService, AlertaCaballoService, RecordatorioService]
})
export class NotificacionesInsertPage {
  labels: any = {};
  alerta: Alerta;
  formNotificaciones: any;
  session: UserSessionEntity;
  tiposAlerta: Array<any>;
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
    languageService.loadLabels().then(labels => this.labels = labels);
  }

  ngOnInit() {
    this.alerta = new Alerta();
    this.session = this._securityService.getInitialConfigSession();
    this.getRecordatorios();
    if (this._commonService.IsValidParams(this.navParams, ["alertaEntity"])) {
      this.alerta = this.navParams.get("alertaEntity");
      this.alerta.FechaNotificacion = moment(this.alerta.FechaNotificacion).format("YYYY-MM-DD");
      if (this.alerta.ID) {
        if (this.alerta.AlertaRecordatorio) {
          this.alerta.AlertaRecordatorio.forEach(a => {
            this.buildLabelRecordatorio(a);
          });
        }
      }
    }
    this.initForm();
  }

  goBack(): void {
    this.navCtrl.pop();
  }

  initForm() {
    this.formNotificaciones = this.formBuilder.group({
      Titulo: [this.alerta.Titulo, Validators.required],
      FechaNotificacion: [this.alerta.FechaNotificacion, Validators.required],
      HoraNotificacion: [this.alerta.HoraNotificacion, Validators.required],
      Activa: [this.alerta.Activa],
      Descripcion: [this.alerta.Descripcion, Validators.required],
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

  saveNotificacion() {
    this._commonService.showLoading(this.labels["PANT010_ALT_PRO"]);
    this.buildAlerta(this.alerta, this.formNotificaciones.value);
    let promise;
    if (this.alerta.ID) {
      promise = this._alertaService.updateAlerta(this.session.PropietarioId, this.alerta);
    } else {
      promise = this._alertaService.saveAlerta(this.session.PropietarioId, this.alerta);
    }
    promise.then(() => {
      this._commonService.hideLoading();
      this.events.publish("notificaciones:notas:caballo:refresh");
      this.events.publish("notificacion:nota:caballo:refresh");
      this.events.publish("notificacion:refresh");//para refrescar el detalle de la pantalla alertas
      this.events.publish("notificaciones:refresh");//refrescar
      this.events.publish("calendario:alerta:refresh");//refrescar alerta seleccionada en calendario
      this.events.publish("calendario:refresh");//refrescar alertas calendario
      this.navCtrl.pop();
    }).catch(ex => {
      this._commonService.ShowErrorHttp(ex, this.labels["PANT010_MSG_ERRGUA"]);
    });
  }

  private getRecordatorios(): void {
    this._commonService.showLoading(this.labels["PANT010_ALT_PRO"]);
    this.recordatorioService.getAllRecordatorios()
      .then(recordatorios => {
        this.recordatorios = recordatorios;
        this._commonService.hideLoading();
      }).catch(err => {
      this._commonService.ShowErrorHttp(err, this.labels["PANT010_MSG_ERRCA"]);
    });
  }

  private buildAlerta(alerta: Alerta, formValues: any): void {
    alerta.Titulo = formValues["Titulo"];
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

