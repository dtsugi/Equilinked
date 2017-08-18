import {Component, OnInit, OnDestroy} from '@angular/core';
import {Events, NavController, NavParams} from 'ionic-angular';
import {ConstantsConfig} from '../../../../app/utils'
import {CommonService} from '../../../../services/common.service';
import {AlertaService} from '../../../../services/alerta.service';
import {AlertaCaballoService} from '../../../../services/alerta.caballo.service';
import {Alerta} from '../../../../model/alerta';
import {UserSessionEntity} from '../../../../model/userSession';
import {SecurityService} from '../../../../services/security.service';
import {NotificacionNotaDetalle} from "../../../notificaciones/notificacion-nota-detalle/notificacion-nota-detalle";
import {NotificacionesInsertPage} from '../../../notificaciones/notificaciones-insert';
import moment from "moment";
import "moment/locale/es";
import {LanguageService} from '../../../../services/language.service';

@Component({
  templateUrl: 'notas.html',
  providers: [LanguageService, CommonService, AlertaService, AlertaCaballoService, SecurityService]
})
export class NotasPage implements OnInit, OnDestroy {
  private session: UserSessionEntity;
  private notificacionesResp: Array<any>;
  labels: any = {};
  idCaballo: number;
  nombreCaballo: string = "";
  notificacionList;
  tipoAlerta: number = 5;
  isDeleting: boolean = false;
  loading: boolean;

  constructor(private events: Events,
              public navCtrl: NavController,
              public navParams: NavParams,
              private _commonService: CommonService,
              private alertaCaballoService: AlertaCaballoService,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.loading = true;
    languageService.loadLabels().then(labels => this.labels = labels);
  }

  ngOnInit() {
    this.session = this.securityService.getInitialConfigSession();
    if (this._commonService.IsValidParams(this.navParams, ["idCaballoSelected", "nombreCaballoSelected"])) {
      this.idCaballo = this.navParams.get("idCaballoSelected");
      this.nombreCaballo = this.navParams.get("nombreCaballoSelected");
      this.getAllNotificacionesByCaballoId();
    }
    this.addEvents();
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }

  filter(evt: any): void {
    let value: string = evt.target.value;
    if (value && value !== null) {
      this.notificacionList = this.notificacionesResp.filter(nota => {
        return nota.Titulo.toUpperCase().indexOf(value.toUpperCase()) > -1
          || nota.Descripcion.toUpperCase().indexOf(value.toUpperCase()) > -1
      });
    } else {
      this.notificacionList = this.notificacionesResp;
    }
  }

  getAllNotificacionesByCaballoId() {
    let fecha: string = moment().format("YYYY-MM-DD");
    this.loading = true;
    this.alertaCaballoService.getAlertasByCaballoId(
      this.session.PropietarioId, this.idCaballo, fecha, this.tipoAlerta,
      ConstantsConfig.ALERTA_FILTER_ALL, null, ConstantsConfig.ALERTA_ORDEN_DESCENDENTE
    ).then(res => {
      this.notificacionList = res.map(alerta => {
        alerta.Fecha = moment(new Date(alerta.FechaNotificacion)).format("DD/MM/YY");
        return alerta;
      });
      this.notificacionesResp = this.notificacionList;
      this.loading = false;
    }).catch(error => {
      console.error(error);
      this._commonService.ShowInfo(this.labels["PANT007_MSG_ERRALT"]);
      this.loading = false;
    });
  }

  goViewNotificacion(notificacion) {
    /* Flag para determinar que no se este eliminando al mismo tiempo */
    if (!this.isDeleting) {
      this.navCtrl.push(NotificacionNotaDetalle, {alertaId: notificacion.ID});
    }
  }

  goInsertNotificacion() {
    let notificacion: Alerta = new Alerta();
    notificacion.Tipo = this.tipoAlerta;
    notificacion.Propietario_ID = this.session.PropietarioId;
    notificacion.AlertaCaballo = [{Caballo_ID: this.idCaballo}];
    this.navCtrl.push(NotificacionesInsertPage, {alertaEntity: notificacion});
  }

  deleteNotification(notificacion: Alerta) {
    this._commonService.showLoading(this.labels["PANT007_ALT_CARG"]);
    this.alertaCaballoService.deleteAlertasCaballosByIds(this.session.PropietarioId, this.idCaballo, [notificacion.ID])
      .then(() => {
        this._commonService.hideLoading();
        this.events.publish("notificaciones:refresh");//Actualimamos area de ontificaciones
        this.getAllNotificacionesByCaballoId();
      }).catch(err => {
      this._commonService.ShowErrorHttp(err, this.labels["PANT007_MSG_ERRELI"]);
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  private addEvents(): void {
    this.events.subscribe("notificaciones:notas:caballo:refresh", () => {
      this.getAllNotificacionesByCaballoId();
    });
  }

  private removeEvents(): void {
    this.events.subscribe("notificaciones:notas:caballo:refresh");
  }
}
