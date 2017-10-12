import {Component, OnInit, OnDestroy} from '@angular/core';
import {Events, NavController, NavParams} from 'ionic-angular';
import {ConstantsConfig, Utils} from '../../../../app/utils'
import {CommonService} from '../../../../services/common.service';
import {AlertaService} from '../../../../services/alerta.service';
import {Alerta} from '../../../../model/alerta';
import {AlertaCaballoService} from '../../../../services/alerta.caballo.service';
import {UserSessionEntity} from '../../../../model/userSession';
import {SecurityService} from '../../../../services/security.service';
import {NotificacionLocalService} from '../../../../services/notificacion-local.service';
import {NotificacionesExtendedInsertPage} from '../../../notificaciones/notificaciones-extended-insert';
import {NotificacionGeneralDetalle} from "../../../notificaciones/notificacion-general-detalle/notificacion-general-detalle";
import moment from "moment";
import "moment/locale/es";
import {LanguageService} from '../../../../services/language.service';

@Component({
  templateUrl: 'desparasitacion.html',
  providers: [LanguageService, CommonService, AlertaCaballoService, AlertaService, SecurityService]
})
export class DesparasitacionPage implements OnInit, OnDestroy {
  private session: UserSessionEntity;
  labels: any = {};
  idCaballo: number;
  nombreCaballo: string = "";
  historyNotificacionList;
  nextNotificacionList;
  tipoAlerta: number = ConstantsConfig.ALERTA_TIPO_DESPARACITACION;
  loadingNext: boolean;
  loadingHistory: boolean;

  constructor(private events: Events,
              public navCtrl: NavController,
              public navParams: NavParams,
              private notificacionLocalService: NotificacionLocalService,
              private _commonService: CommonService,
              private _alertaService: AlertaService,
              private alertaCaballoService: AlertaCaballoService,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.loadingNext = true;
    this.loadingHistory = true;
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      if (this._commonService.IsValidParams(this.navParams, ["idCaballoSelected", "nombreCaballoSelected"])) {
        this.idCaballo = this.navParams.get("idCaballoSelected");
        this.nombreCaballo = this.navParams.get("nombreCaballoSelected");
        this.getAlertasByCaballo();
      }
      this.addEvents();
    });
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }

  private getAlertasByCaballo(): void {
    let fecha: string = moment().format("YYYY-MM-DD HH:mm:ss");
    this.loadingNext = true;
    this.loadingHistory = true;
    this.alertaCaballoService.getAlertasByCaballoId(
      this.session.PropietarioId, this.idCaballo, null, fecha,
      [this.tipoAlerta], null, ConstantsConfig.ALERTA_ORDEN_DESCENDENTE
    ).then(res => {
      this.historyNotificacionList = res.map(alerta => {
        let d = Utils.getMomentFromAlertDate(alerta.FechaNotificacion);
        alerta.Fecha = d.format("DD/MM/YY");
        return alerta;
      });
      this.loadingHistory = false;
      return this.alertaCaballoService
        .getAlertasByCaballoId(this.session.PropietarioId, this.idCaballo, fecha, null,
          [this.tipoAlerta], 3, ConstantsConfig.ALERTA_ORDEN_ASCENDENTE);
    }).then(res => {
      this.nextNotificacionList = res.map((alerta: any) => {
        let d = Utils.getMomentFromAlertDate(alerta.FechaNotificacion);
        alerta.Fecha = d.format("D [de] MMMM [de] YYYY");
        alerta.Hora = d.format("hh:mm a");
        return alerta;
      });
      this.loadingNext = false;
    }).catch(err => {
      console.error(err);
      this._commonService.ShowInfo(this.labels["PANT007_MSG_ERRALT"]);
      this.loadingHistory = false;
      this.loadingNext = false;
    });
  }

  edit(notificacion) {
    this._commonService.showLoading(this.labels["PANT007_ALT_CARG"]);
    this._alertaService.getAlertaById(this.session.PropietarioId, notificacion.ID)
      .then(alerta => {
        this._commonService.hideLoading();
        this.navCtrl.push(NotificacionesExtendedInsertPage, {alertaEntity: alerta});
      }).catch(err => {
      console.error(err);
    });
  }

  view(notificacion) {
    let params: any = {
      alertaId: notificacion.ID,
      caballoId: this.idCaballo
    };
    this.navCtrl.push(NotificacionGeneralDetalle, params);
  }

  insert() {
    let notificacion: Alerta = new Alerta();
    notificacion.Tipo = this.tipoAlerta;
    notificacion.Propietario_ID = this.session.PropietarioId;
    notificacion.Titulo = this.labels["PANT007_LBL_VIDESP"];
    notificacion.AlertaCaballo = [{Caballo_ID: this.idCaballo}];
    this.navCtrl.push(NotificacionesExtendedInsertPage,
      {
        alertaEntity: notificacion,
        isUpdate: false,
        title: "Nueva desparasitacion",
        callbackController: this
      });
  }

  delete(notificacion: Alerta) {
    this._commonService.showLoading(this.labels["PANT007_ALT_CARG"]);
    this.alertaCaballoService.deleteAlertasCaballosByIds(this.session.PropietarioId, this.idCaballo, [notificacion.ID])
      .then(() => {
        this._commonService.hideLoading();
        this.events.publish("notificaciones:refresh");//Actualimamos area de ontificaciones
        this.events.publish("calendario:refresh");//refrescar alertas calendario
        this.getAlertasByCaballo();
        try {
          this.notificacionLocalService.deleteLocalNotificationAlert([notificacion.ID]);
        } catch (err) {
          console.log("Error al eliminar not local");
          console.log(JSON.stringify(err));
        }
      }).catch(err => {
      this._commonService.ShowErrorHttp(err, this.labels["PANT007_MSG_ERRELI"]);
    });
  }

  reloadController() {
    this.getAlertasByCaballo();
  }

  goBack() {
    this.navCtrl.pop();
  }

  private addEvents(): void {
    this.events.subscribe("notificaciones:caballo:refresh", () => {
      this.getAlertasByCaballo();
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("notificaciones:caballo:refresh");
  }
}
