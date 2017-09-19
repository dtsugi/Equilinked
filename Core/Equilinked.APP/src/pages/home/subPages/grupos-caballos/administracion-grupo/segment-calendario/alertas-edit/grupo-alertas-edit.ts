import {Component, OnDestroy, OnInit} from "@angular/core";
import {AlertController, Events, ModalController, NavController, NavParams} from "ionic-angular";
import {AlertaService} from "../../../../../../../services/alerta.service";
import {GruposCaballosService} from "../../../../../../../services/grupos-caballos.service";
import {CommonService} from "../../../../../../../services/common.service";
import {LanguageService} from '../../../../../../../services/language.service';
import {RecordatorioService} from "../../../../../../../services/recordatorio.service";
import {SecurityService} from "../../../../../../../services/security.service";
import {Alerta} from "../../../../../../../model/alerta";
import {UserSessionEntity} from "../../../../../../../model/userSession";
import {ConstantsConfig} from "../../../../../../../app/utils";
import {EquiModalCaballos} from "../../../../../../../utils/equi-modal-caballos/equi-modal-caballos";
import {EquiModalRecordatorio} from "../../../../../../../utils/equi-modal-recordatorio/equi-modal-recordatorio";
import moment from "moment";

@Component({
  templateUrl: "grupo-alertas-edit.html",
  providers: [LanguageService, AlertaService, CommonService, GruposCaballosService, RecordatorioService, SecurityService]
})
export class GrupoAlertasEditPage implements OnDestroy, OnInit {
  private session: UserSessionEntity;
  private grupo: any;
  alerta: Alerta;
  tiposAlerta: Array<any>;
  recordatorios: Array<any>;
  labels: any = {};

  constructor(private alertController: AlertController,
              private alertaService: AlertaService,
              private events: Events,
              private commonService: CommonService,
              private gruposCaballosService: GruposCaballosService,
              private modalController: ModalController,
              public navController: NavController,
              public navParams: NavParams,
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
      this.grupo = this.navParams.get("grupo");
      if (!this.alerta) {
        this.alerta = new Alerta();
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
    this.alerta.AlertaGrupal = true;
    this.alerta.AlertaGrupo = [{Grupo_ID: this.grupo.ID}];
    this.alerta.AlertaCaballo = [];
    this.alerta.FechaNotificacion = moment().format("YYYY-MM-DD");
    this.alerta.HoraNotificacion = moment().format("HH:mm:ss");
    if (this.alerta.Tipo == ConstantsConfig.ALERTA_TIPO_EVENTOS) {
      this.alerta.FechaFinal = moment().format("YYYY-MM-DD");
      this.alerta.HoraFinal = moment().format("HH:mm:ss");
    }
    this.setCaballosToAlerta();//le asignamos los caballos
  }

  viewRecordatorios(): void {
    let inputs: Array<any> = this.recordatorios.map(r => {
      return {type: "radio", label: r.Descripcion, value: r}
    });
    this.alertController.create({
      inputs: inputs,
      buttons: [
        {text: this.labels["PANT037_BTN_CAN"], role: "cancel"},
        {text: this.labels["PANT037_BTN_ACE"], handler: this.callbackViewRecordatorios}
      ]
    }).present(); //abrete ZeZaMoOo!!
  }

  removeRecordatorio(): void {
    this.alerta.AlertaRecordatorio = new Array<any>();
  }

  addCaballos(): void {
    let params: any = {
      caballosInput: this.alerta.AlertaCaballo.map(ac => {
        return {ID: ac.Caballo_ID};
      }),
      funcionCaballos: this.gruposCaballosService.getCaballosByGruposIds(this.session.PropietarioId, [this.grupo.ID])
    };
    let modal = this.modalController.create(EquiModalCaballos, params);
    modal.onDidDismiss(this.callbackAddCaballos);
    modal.present(); //Abrir!
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
        this.alerta.Titulo = this.labels["PANT037_LBL_VIDEN"];
        break;
      case ConstantsConfig.ALERTA_TIPO_HERRAJE:
        this.alerta.Titulo = this.labels["PANT037_LBL_VIHE"];
        break;
      case ConstantsConfig.ALERTA_TIPO_DESPARACITACION:
        this.alerta.Titulo = this.labels["PANT037_LBL_VIDESP"];
        break;
    }
    let promise;
    if (this.alerta.ID) {
      promise = this.alertaService.updateAlerta(this.session.PropietarioId, this.alerta);
    } else {
      promise = this.alertaService.saveAlerta(this.session.PropietarioId, this.alerta);
    }
    this.commonService.showLoading(this.labels["PANT037_ALT_PRO"]);
    promise.then(() => {
      this.commonService.hideLoading();
      this.navController.pop().then(() => {
        this.events.publish("calendario:grupo:notificaciones");//refrescar notificaciones de calendario grupal
        this.events.publish("calendario:grupo:notificacion");//refrescar detalle de notificacion del calendario grupal
        this.events.publish("notificaciones:refresh");//para refrescar la lista de alertas de centro notificaciones
        this.events.publish("notificacion:refresh");//para refrescar el detalle de la pantalla centro notificaciones
        this.events.publish("calendario:refresh");//refrescar calendario
        this.events.publish("calendario:alerta:refresh");//refrescar alerta seleccionada calendario
      });
    }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT037_MSG_ERRGU"]);
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

  private setCaballosToAlerta(): void {
    this.gruposCaballosService.getCaballosByGruposIds(this.session.PropietarioId, [this.grupo.ID])
      .then(caballos => { //Ahora hay que agregar los caballos que no están
        if (caballos) {
          caballos.forEach(caballo => {
            this.alerta.AlertaCaballo.push({Caballo_ID: caballo.ID});
          });
        }
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT037_MSG_ERR"]);
    });
  }

  callbackAddCaballos = (caballos) => {
    let alertaCaballo: any;
    let mapAlertaCaballo: Map<number, any> = new Map<number, any>();
    for (let ac of this.alerta.AlertaCaballo) {
      mapAlertaCaballo.set(ac.Caballo_ID, ac);
    }
    if (caballos) {
      this.alerta.AlertaCaballo = new Array<any>();
      for (let c of caballos) {
        alertaCaballo = mapAlertaCaballo.has(c.ID) ? mapAlertaCaballo.get(c.ID) : {Caballo_ID: c.ID};
        this.alerta.AlertaCaballo.push(alertaCaballo);
      }
    }
  }

  private loadPage(): void {
    this.commonService.showLoading(this.labels["PANT037_ALT_PRO"]);
    this.loadTiposAlerta().then(tiposAlerta => {
      this.tiposAlerta = tiposAlerta;
      return this.recordatorioService.getAllRecordatorios();
    }).then(recordatorios => {
      this.recordatorios = recordatorios;
      this.commonService.hideLoading();
    }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT037_MSG_ERR"]);
    });
  }

  private loadTiposAlerta(): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      let tiposAlerta: Array<any> = [
        {tipo: ConstantsConfig.ALERTA_TIPO_EVENTOS, descripcion: this.labels["PANT037_LBL_TEV"]},
        {tipo: ConstantsConfig.ALERTA_TIPO_HERRAJE, descripcion: this.labels["PANT037_LBL_THE"]},
        {tipo: ConstantsConfig.ALERTA_TIPO_DESPARACITACION, descripcion: this.labels["PANT037_LBL_TDES"]},
        {tipo: ConstantsConfig.ALERTA_TIPO_DENTISTA, descripcion: this.labels["PANT037_LBL_TDEN"]},
        {tipo: ConstantsConfig.ALERTA_TIPO_NOTASVARIAS, descripcion: this.labels["PANT037_LBL_TNO"]}
      ]
      resolve(tiposAlerta);
    });
  }
}
