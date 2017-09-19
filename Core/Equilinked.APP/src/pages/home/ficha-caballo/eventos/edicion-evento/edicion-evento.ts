import {Component, OnInit} from "@angular/core";
import {AlertController, Events, ModalController, NavController, NavParams} from "ionic-angular";
import {AlertaService} from "../../../../../services/alerta.service";
import {CommonService} from "../../../../../services/common.service";
import {LanguageService} from '../../../../../services/language.service';
import {RecordatorioService} from "../../../../../services/recordatorio.service";
import {SecurityService} from "../../../../../services/security.service";
import {UserSessionEntity} from "../../../../../model/userSession";
import {ConstantsConfig} from "../../../../../app/utils";
import {EquiModalRecordatorio} from "../../../../../utils/equi-modal-recordatorio/equi-modal-recordatorio";
import moment from "moment";

@Component({
  templateUrl: "edicion-evento.html",
  providers: [LanguageService, AlertaService, CommonService, RecordatorioService, SecurityService]
})
export class EdicionEventoCaballoPage implements OnInit {
  private session: UserSessionEntity;
  private caballo: any;
  alerta: any;
  recordatorios: Array<any>;
  labels: any = {};

  constructor(private alertController: AlertController,
              private alertaService: AlertaService,
              private events: Events,
              private commonService: CommonService,
              private modalController: ModalController,
              public navController: NavController,
              public navParams: NavParams,
              private recordatorioService: RecordatorioService,
              private securityService: SecurityService,
              private languageService: LanguageService) {
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.caballo = this.navParams.get("caballo");
    this.alerta = this.navParams.get("alerta");
    this.languageService.loadLabels().then(labels => {
      this.labels = labels
      if (!this.alerta) {
        this.alerta = {};
        this.alerta.Tipo = ConstantsConfig.ALERTA_TIPO_EVENTOS;
        this.alerta.Propietario_ID = this.session.PropietarioId;
        this.alerta.AlertaCaballo = [{Caballo_ID: this.caballo.ID}];
        this.alerta.AlertaRecordatorio = [];
        this.alerta.FechaNotificacion = moment().format("YYYY-MM-DD");
        this.alerta.HoraNotificacion = moment().format("HH:mm:ss");
        this.alerta.FechaFinal = moment().format("YYYY-MM-DD");
        this.alerta.HoraFinal = moment().format("HH:mm:ss");
      } else {
        let di = new Date(this.alerta.FechaNotificacion);
        this.alerta.FechaNotificacion = moment(di).format("YYYY-MM-DD");
        if (this.alerta.Tipo == ConstantsConfig.ALERTA_TIPO_EVENTOS) {
          let df = new Date(this.alerta.FechaFinal);
          this.alerta.FechaFinal = moment(df).format("YYYY-MM-DD");
          this.alerta.HoraFinal = moment(df).format("HH:mm:ss");
        }
        if (this.alerta.AlertaRecordatorio) {
          this.alerta.AlertaRecordatorio.forEach(a => {
            this.buildLabelRecordatorio(a);
          });
        }
      }
      this.loadPage();
    });
  }

  cancel(): void {
    this.navController.pop();
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

  save(): void {
    console.log(this.alerta);
    this.alerta.FechaNotificacion = this.alerta.FechaNotificacion + " " + this.alerta.HoraNotificacion;
    this.alerta.FechaFinal = this.alerta.FechaFinal + " " + this.alerta.HoraFinal;
    let promise;
    if (this.alerta.ID) {
      promise = this.alertaService.updateAlerta(this.session.PropietarioId, this.alerta);
    } else {
      promise = this.alertaService.saveAlerta(this.session.PropietarioId, this.alerta);
    }
    this.commonService.showLoading(this.labels["PANT010_ALT_PRO"]);
    promise.then(() => {
      this.commonService.hideLoading();
      this.navController.pop().then(() => {
        this.events.publish("notificacion:evento:caballo:refresh");//el detalle supongo
        this.events.publish("notificaciones:caballo:refresh");//refrescar el calendar o la lista

        this.events.publish("notificaciones:refresh");//para refrescar la lista de alertas de centro notificaciones
        this.events.publish("notificacion:refresh");//para refrescar el detalle de la pantalla centro notificaciones
        this.events.publish("calendario:refresh");//refrescar calendario
        this.events.publish("calendario:alerta:refresh");//refrescar alerta seleccionada calendario
      });
    }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT010_MSG_ERRGUA"]);
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

  private loadPage(): void {
    this.commonService.showLoading(this.labels["PANT010_ALT_PRO"]);
    this.recordatorioService.getAllRecordatorios()
      .then(recordatorios => {
        this.recordatorios = recordatorios;
        this.commonService.hideLoading();
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT010_MSG_ERRCA"]);
    });
  }
}
