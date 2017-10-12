import {Component, OnDestroy, OnInit} from "@angular/core";
import {AlertController, Events, ModalController, NavController, NavParams} from "ionic-angular";
import {AlertaService} from "../../../../../services/alerta.service";
import {CommonService} from "../../../../../services/common.service";
import {LanguageService} from '../../../../../services/language.service';
import {RecordatorioService} from "../../../../../services/recordatorio.service";
import {SecurityService} from "../../../../../services/security.service";
import {NotificacionLocalService} from '../../../../../services/notificacion-local.service';
import {Alerta} from "../../../../../model/alerta";
import {UserSessionEntity} from "../../../../../model/userSession";
import {ConstantsConfig, Utils} from "../../../../../app/utils";
import {EquiModalRecordatorio} from "../../../../../utils/equi-modal-recordatorio/equi-modal-recordatorio";
import moment from "moment";

@Component({
  templateUrl: "caballo-alertas-edit.html",
  providers: [LanguageService, AlertaService, CommonService, RecordatorioService, SecurityService]
})
export class CaballoAlertasEditPage implements OnDestroy, OnInit {
  private session: UserSessionEntity;
  private caballo: any;
  private alertaResp: any;
  alerta: Alerta;
  tiposAlerta: Array<any>;
  recordatorios: Array<any>;
  labels: any = {};

  constructor(private alertController: AlertController,
              private alertaService: AlertaService,
              private commonService: CommonService,
              private events: Events,
              private modalController: ModalController,
              public navController: NavController,
              public navParams: NavParams,
              private notificacionLocalService: NotificacionLocalService,
              private recordatorioService: RecordatorioService,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.alerta = new Alerta();
    this.tiposAlerta = new Array<any>();
  }

  ngOnInit(): void {
    this.languageService.loadLabels().then(labels => {
      this.labels = labels
      this.session = this.securityService.getInitialConfigSession();
      this.alerta = this.navParams.get("alerta");
      this.caballo = this.navParams.get("caballo");
      if (!this.alerta) {
        this.alerta = new Alerta();
      } else {
        this.alertaResp = JSON.parse(JSON.stringify(this.alerta));
        let di = Utils.getMomentFromAlertDate(this.alerta.FechaNotificacion);
        this.alerta.FechaNotificacion = di.format("YYYY-MM-DD");
        if (this.alerta.Tipo == ConstantsConfig.ALERTA_TIPO_EVENTOS) {
          let df = Utils.getMomentFromAlertDate(this.alerta.FechaFinal);
          this.alerta.FechaFinal = df.format("YYYY-MM-DD");
          this.alerta.HoraFinal = df.format("HH:mm:ss");
        }
        if (this.alerta.AlertaRecordatorio) {
          this.alerta.AlertaRecordatorio.forEach(a => {
            this.buildLabelRecordatorio(a);
          });
        }
      }
      this.loadPage();//Cargar todo lo que necesita la pantalla
    });
  }

  ngOnDestroy(): void {
  }

  goBack(): void {
    this.navController.pop();
  }

  changeTipoAlerta(evt: any): void {
    this.alerta = new Alerta();
    this.alerta.Propietario_ID = this.session.PropietarioId;
    this.alerta.Tipo = evt;//Asignar el tipo elegido
    this.alerta.AlertaGrupal = false;
    this.alerta.AlertaCaballo = [{Caballo_ID: this.caballo.ID}];
    this.alerta.AlertaGrupo = [];
    this.alerta.FechaNotificacion = moment().format("YYYY-MM-DD");
    this.alerta.HoraNotificacion = moment().format("HH:mm:ss");
    if (this.alerta.Tipo == ConstantsConfig.ALERTA_TIPO_EVENTOS) {
      this.alerta.FechaFinal = moment().format("YYYY-MM-DD");
      this.alerta.HoraFinal = moment().format("HH:mm:ss");
    }
  }

  viewRecordatorios(): void {
    let inputs: Array<any> = this.recordatorios.map(r => {
      return {type: "radio", label: r.Descripcion, value: r}
    });
    this.alertController.create({
      inputs: inputs,
      buttons: [
        {text: this.labels["PANT038_BTN_CAN"], role: "cancel"},
        {text: this.labels["PANT038_BTN_ACE"], handler: this.callbackViewRecordatorios}
      ]
    }).present();
  }

  removeRecordatorio(): void {
    this.alerta.AlertaRecordatorio = new Array<any>();
  }

  /*Se requiere un ajuste posterior para menejar correctamente la hora */
  save(): void {
    console.log(this.alerta);
    this.alerta.FechaNotificacion = this.alerta.FechaNotificacion + " " + this.alerta.HoraNotificacion;
    if (this.alerta.Tipo == ConstantsConfig.ALERTA_TIPO_EVENTOS) {
      this.alerta.FechaFinal = this.alerta.FechaFinal + " " + this.alerta.HoraFinal;
    }
    switch (this.alerta.Tipo) { //El titulo por el momento fijo
      case ConstantsConfig.ALERTA_TIPO_DENTISTA:
        this.alerta.Titulo = this.labels["PANT038_LBL_VIDEN"];
        break;
      case ConstantsConfig.ALERTA_TIPO_HERRAJE:
        this.alerta.Titulo = this.labels["PANT038_LBL_VIHE"];
        break;
      case ConstantsConfig.ALERTA_TIPO_DESPARACITACION:
        this.alerta.Titulo = this.labels["PANT038_LBL_VIDESP"];
        break;
    }
    let promise;
    if (this.alerta.ID) {
      promise = this.alertaService.updateAlerta(this.session.PropietarioId, this.alerta);
    } else {
      promise = this.alertaService.saveAlerta(this.session.PropietarioId, this.alerta);
    }
    this.commonService.showLoading(this.labels["PANT038_ALT_PRO"]);
    promise.then((idnotificacion) => {
      console.log("En caso de guardar el valor retornado es: " + idnotificacion);
      let alertaAct = null, alertaAnt = null;
      if (this.alerta.ID) {
        alertaAct = this.alerta;
        alertaAnt = this.alertaResp;
      } else {
        this.alerta.ID = idnotificacion;
        alertaAct = this.alerta;
      }
      try {
        this.notificacionLocalService.saveLocalNotificacionAlert(alertaAct, alertaAnt);
        this.commonService.hideLoading();
        this.navController.pop().then(() => {
          this.events.publish("calendario:caballo:notificaciones");//refrescar notificaciones de caballo
          this.events.publish("calendario:caballo:notificacion");//refrescar detalle de notificacion del caballo
          this.events.publish("notificaciones:refresh");//para refrescar la lista de alertas de centro notificaciones
          this.events.publish("notificacion:refresh");//para refrescar el detalle de la pantalla centro notificaciones
          this.events.publish("calendario:refresh");//refrescar calendario
          this.events.publish("calendario:alerta:refresh");//refrescar alerta seleccionada calendario
        });
      } catch (err) {
        console.log("Error al guardar notificacion local:" + JSON.stringify(err));
        this.commonService.ShowErrorHttp(err, this.labels["PANT038_MSG_ERRGU"]);
      }
    }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT038_MSG_ERRGU"]);
    });
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
      modal.present();
    }
  }

  private addRecordatorio(recordatorio: any): void {
    this.buildLabelRecordatorio(recordatorio);
    this.alerta.AlertaRecordatorio.push(recordatorio);
  }

  private buildLabelRecordatorio(recordatorio: any): void {
    recordatorio.Descripcion = recordatorio.ValorTiempo + " " + recordatorio.UnidadTiempo.Descripcion;
    //recordatorio.UnidadTiempo = null;
  }

  private loadPage(): void {
    this.commonService.showLoading(this.labels["PANT038_ALT_PRO"]);
    this.loadTiposAlerta().then(tiposAlerta => {
      this.tiposAlerta = tiposAlerta;
      return this.recordatorioService.getAllRecordatorios();
    }).then(recordatorios => {
      this.recordatorios = recordatorios;
      this.commonService.hideLoading();
    }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT038_MSG_ERR"]);
    });
  }

  private loadTiposAlerta(): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      let tiposAlerta: Array<any> = [
        {tipo: ConstantsConfig.ALERTA_TIPO_EVENTOS, descripcion: this.labels["PANT038_LBL_TEV"]},
        {tipo: ConstantsConfig.ALERTA_TIPO_HERRAJE, descripcion: this.labels["PANT038_LBL_THE"]},
        {tipo: ConstantsConfig.ALERTA_TIPO_DESPARACITACION, descripcion: this.labels["PANT038_LBL_TDES"]},
        {tipo: ConstantsConfig.ALERTA_TIPO_DENTISTA, descripcion: this.labels["PANT038_LBL_TDEN"]},
        {tipo: ConstantsConfig.ALERTA_TIPO_NOTASVARIAS, descripcion: this.labels["PANT038_LBL_TNO"]}
      ]
      resolve(tiposAlerta);
    });
  }
}
