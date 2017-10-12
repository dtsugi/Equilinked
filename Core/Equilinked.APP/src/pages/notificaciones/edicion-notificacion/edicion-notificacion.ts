import {Component, OnDestroy, OnInit} from "@angular/core";
import {AlertController, Events, ModalController, NavController, NavParams} from "ionic-angular";
import {AlertaService} from "../../../services/alerta.service";
import {CaballoService} from "../../../services/caballo.service";
import {GruposCaballosService} from "../../../services/grupos-caballos.service";
import {CommonService} from "../../../services/common.service";
import {RecordatorioService} from "../../../services/recordatorio.service";
import {SecurityService} from "../../../services/security.service";
import {Alerta} from "../../../model/alerta";
import {UserSessionEntity} from "../../../model/userSession";
import {ConstantsConfig} from "../../../app/utils";
import {EquiModalCaballos} from "../../../utils/equi-modal-caballos/equi-modal-caballos";
import {EquiModalGrupos} from "../../../utils/equi-modal-grupos/equi-modal-grupos";
import {EquiModalRecordatorio} from "../../../utils/equi-modal-recordatorio/equi-modal-recordatorio";
import moment from "moment";
import {LanguageService} from '../../../services/language.service';
import {NotificacionLocalService} from '../../../services/notificacion-local.service';
import {Utils} from '../../../app/utils';

@Component({
  templateUrl: "edicion-notificacion.html",
  providers: [LanguageService, AlertaService, CaballoService, CommonService, GruposCaballosService, RecordatorioService, SecurityService]
})
export class EdicionNotificacionGeneralPage implements OnDestroy, OnInit {
  private session: UserSessionEntity;
  private alertaResp: any;
  alerta: Alerta;
  tiposAlerta: Array<any>;
  recordatorios: Array<any>;
  labels: any = {};

  constructor(private alertController: AlertController,
              private alertaService: AlertaService,
              private events: Events,
              private caballoService: CaballoService,
              private commonService: CommonService,
              private gruposCaballosService: GruposCaballosService,
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
        {text: this.labels["PANT023_BTN_CAN"], role: "cancel"},
        {text: this.labels["PANT023_BTN_ACE"], handler: this.callbackViewRecordatorios}
      ]
    }).present(); //abrete ZeZaMoOo!!
  }

  removeRecordatorio(): void {
    this.alerta.AlertaRecordatorio = new Array<any>();
  }

  addCaballos(): void {
    let self = this;
    let params: any = {
      caballosInput: this.alerta.AlertaCaballo.map(ac => {
        return {ID: ac.Caballo_ID};
      }),
      functionFilter: function (parameters) {
        return self.caballoService
          .getAllSerializedByPropietarioId(self.session.PropietarioId, parameters)
          .toPromise();
      }
    };
    let modal = this.modalController.create(EquiModalCaballos, params);
    modal.onDidDismiss(this.callbackAddCaballos);
    modal.present(); //Abrir!
  }

  addGrupos(): void {
    let params: any = {
      gruposInput: this.alerta.AlertaGrupo.map(ag => {
        return {ID: ag.Grupo_ID};
      }),
      funcionGrupos: this.gruposCaballosService
        .getAllGruposByPropietarioId(this.session.PropietarioId)
    };
    let modal = this.modalController.create(EquiModalGrupos, params);
    modal.onDidDismiss(this.callbackAddGrupos);
    modal.present();
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
        this.alerta.Titulo = this.labels["PANT023_LBL_VIDEN"];
        break;
      case ConstantsConfig.ALERTA_TIPO_HERRAJE:
        this.alerta.Titulo = this.labels["PANT023_LBL_VIHE"];
        break;
      case ConstantsConfig.ALERTA_TIPO_DESPARACITACION:
        this.alerta.Titulo = this.labels["PANT023_LBL_VIDESP"];
        break;
    }
    let promise;
    if (this.alerta.ID) {
      promise = this.alertaService.updateAlerta(this.session.PropietarioId, this.alerta);
    } else {
      promise = this.alertaService.saveAlerta(this.session.PropietarioId, this.alerta);
    }
    this.commonService.showLoading(this.labels["PANT023_ALT_PRO"]);
    promise.then((idnotificacion) => {
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
        console.log("En caso de guardar el valor retornado es: " + idnotificacion);
        this.commonService.hideLoading();
        this.navController.pop().then(() => {
          this.events.publish("notificacion:refresh");//para refrescar el detalle de la pantalla alertas
          this.events.publish("notificaciones:refresh");//refrescar
          this.events.publish("calendario:alerta:refresh");//refrescar alerta seleccionada en calendario
          this.events.publish("calendario:refresh");//refrescar alertas calendario
        });
      } catch (err) {
        console.log("Error al guardar notificacion local:" + JSON.stringify(err));
        this.commonService.ShowErrorHttp(err, this.labels["PANT023_MSG_ERRGU"]);
      }
    }).catch(err => {
      console.log("Error al guardar en api:" + JSON.stringify(err));
      this.commonService.ShowErrorHttp(err, this.labels["PANT023_MSG_ERRGU"]);
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
    //recordatorio.UnidadTiempo = null;
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
  callbackAddGrupos = (grupoos) => {
    let mapAlertaGrupo: Map<number, any> = new Map<number, any>();
    for (let ag of this.alerta.AlertaGrupo) {
      mapAlertaGrupo.set(ag.Grupo_ID, ag);
    }
    if (grupoos) { //Actualizo los grupos seleccionados a la alerta
      let alertaGrupo: any;
      let gruposIds: Array<number> = new Array<number>();
      this.alerta.AlertaGrupo = new Array<any>();
      grupoos.forEach(g => {
        alertaGrupo = mapAlertaGrupo.has(g.ID) ? mapAlertaGrupo.get(g.ID) : {Grupo_ID: g.ID};
        this.alerta.AlertaGrupo.push(alertaGrupo);
        if (!mapAlertaGrupo.has(g.ID)) {
          gruposIds.push(g.ID);
        }
      });
      //Ahora hay que asignar a la selección los caballos de los grupos que han sido seleccioandos
      if (gruposIds.length > 0) {
        this.gruposCaballosService.getCaballosByGruposIds(this.session.PropietarioId, gruposIds, null)
          .then(caballos => { //Ahora hay que agregar los caballos que no están
            let idsCaballos: Array<any> = this.alerta.AlertaCaballo.map(ag => ag.Caballo_ID);
            let nuevosCaballos: Array<any> = caballos.filter(c => idsCaballos.indexOf(c.ID) == -1)
              .map(c => {
                return {Caballo_ID: c.ID};
              });
            if (nuevosCaballos.length > 0) {
              this.alerta.AlertaCaballo.push.apply(this.alerta.AlertaCaballo, nuevosCaballos);//Agrega a la lista existen los nuevos caballos
            }
          }).catch(err => {
          this.commonService.ShowErrorHttp(err, this.labels["PANT023_MSG_ERR"]);
        });
      }
    }
  }

  private loadPage(): void {
    this.commonService.showLoading(this.labels["PANT023_ALT_PRO"]);
    this.loadTiposAlerta().then(tiposAlerta => {
      this.tiposAlerta = tiposAlerta;
      return this.recordatorioService.getAllRecordatorios();
    }).then(recordatorios => {
      this.recordatorios = recordatorios;
      this.commonService.hideLoading();
    }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT023_MSG_ERR"]);
    });
  }

  private loadTiposAlerta(): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      let tiposAlerta: Array<any> = [
        {tipo: ConstantsConfig.ALERTA_TIPO_EVENTOS, descripcion: this.labels["PANT023_LBL_TEV"]},
        {tipo: ConstantsConfig.ALERTA_TIPO_HERRAJE, descripcion: this.labels["PANT023_LBL_THE"]},
        {tipo: ConstantsConfig.ALERTA_TIPO_DESPARACITACION, descripcion: this.labels["PANT023_LBL_TDES"]},
        {tipo: ConstantsConfig.ALERTA_TIPO_DENTISTA, descripcion: this.labels["PANT023_LBL_TDEN"]},
        {tipo: ConstantsConfig.ALERTA_TIPO_NOTASVARIAS, descripcion: this.labels["PANT023_LBL_TNO"]}
      ]
      resolve(tiposAlerta);
    });
  }
}
