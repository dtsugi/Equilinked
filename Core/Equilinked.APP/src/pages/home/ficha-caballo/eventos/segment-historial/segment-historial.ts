import {Component, Input, OnInit} from '@angular/core';
import {Events, NavController} from 'ionic-angular';
import {CommonService} from '../../../../../services/common.service';
import {AlertaCaballoService} from '../../../../../services/alerta.caballo.service';
import {LanguageService} from '../../../../../services/language.service';
import {SecurityService} from '../../../../../services/security.service';
import {UserSessionEntity} from '../../../../../model/userSession';
import {ConstantsConfig} from "../../../../../app/utils";
import {DetalleEventoCaballoPage} from "../detalle-evento/detalle-evento";
import moment from "moment";
import "moment/locale/es";

@Component({
  selector: 'segment-eventos-his',
  templateUrl: 'segment-historial.html',
  providers: [LanguageService, CommonService, AlertaCaballoService, SecurityService]
})
export class SegmentEventosHistorial implements OnInit {
  private session: UserSessionEntity;
  @Input("caballo") caballo: any;
  eventos: Array<any>;
  loading: boolean;
  labels: any = {};

  constructor(public navController: NavController,
              private commonService: CommonService,
              private alertaCaballoService: AlertaCaballoService,
              private events: Events,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.loading = true;
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      this.loadEventos();
    });
  }

  view(evento: any): void {
    this.navController.push(DetalleEventoCaballoPage, {alertaId: evento.ID});
  }

  delete(evento: any): void {
    this.commonService.showLoading(this.labels["PANT007_ALT_CARG"]);
    this.alertaCaballoService.deleteAlertasCaballosByIds(this.session.PropietarioId, this.caballo.ID, [evento.ID])
      .then(() => {
        this.events.publish("notificaciones:refresh");
        this.commonService.hideLoading();
        this.loadEventos();
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT007_MSG_ERRELI"]);
    });
  }

  loadEventos(): void {
    this.loading = true;
    let fecha: string = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    this.alertaCaballoService.getAlertasByCaballoId(this.session.PropietarioId, this.caballo.ID, null, fecha,
      [ConstantsConfig.ALERTA_TIPO_EVENTOS], null, ConstantsConfig.ALERTA_ORDEN_DESCENDENTE
    ).then(alertas => {
      alertas.forEach(a => {
        a.Fecha = moment(new Date(a.FechaNotificacion)).format("DD/MM/YY");
      });
      this.eventos = alertas;
      this.loading = false;
    }).catch(err => {
      console.error(err);
      this.commonService.ShowInfo(this.labels["PANT007_MSG_ERRALT"]);
      this.loading = false;
    });
  }
}
