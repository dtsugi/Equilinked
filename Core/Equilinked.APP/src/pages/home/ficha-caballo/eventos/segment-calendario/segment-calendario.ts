import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Events, NavController} from 'ionic-angular';
import {CommonService} from '../../../../../services/common.service';
import {AlertaCaballoService} from '../../../../../services/alerta.caballo.service';
import {LanguageService} from '../../../../../services/language.service';
import {SecurityService} from '../../../../../services/security.service';
import {UserSessionEntity} from '../../../../../model/userSession';
import {ConstantsConfig} from "../../../../../app/utils";
import {EquiCalendar2} from "../../../../../utils/equi-calendar2/equi-calendar2";
import {DetalleEventoCaballoPage} from "../detalle-evento/detalle-evento";
import moment from "moment";
import "moment/locale/es";

@Component({
  selector: 'segment-calendario-eventos',
  templateUrl: 'segment-calendario.html',
  providers: [AlertaCaballoService, CommonService, LanguageService, SecurityService]
})
export class SegmentCalendarioEventos implements OnInit {
  private session: UserSessionEntity;
  @Input("caballo") caballo: any;
  @ViewChild(EquiCalendar2) calendar: EquiCalendar2;
  calendarOptions: any;
  eventos: Array<any>;
  labels: any = {};

  constructor(public navController: NavController,
              private commonService: CommonService,
              private events: Events,
              private alertaCaballoService: AlertaCaballoService,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.calendarOptions = {step: 1, isAlertGroup: false}; //este objeto se le pasa al calendar
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
    });
  }

  loadEventos(): void {
    this.calendar.reloadAlertsCurrentMonth();
  }

  view(evt: any): void {
    if (evt.alert) {
      this.navController.push(DetalleEventoCaballoPage, {alertaId: evt.alert.ID});
    }
  }

  getEventsByCaballo(evt: any): void {
    this.alertaCaballoService.getAlertasByCaballoId(this.session.PropietarioId, this.caballo.ID, evt.start, evt.end,
      [ConstantsConfig.ALERTA_TIPO_EVENTOS], null, ConstantsConfig.ALERTA_ORDEN_DESCENDENTE
    ).then(alertas => {
      alertas.forEach(alerta => {
        let d = new Date(alerta.FechaNotificacion);
        alerta.Hora = moment(d).format("hh:mm A").toUpperCase();
      });
      this.calendar.setAlerts(alertas);
    }).catch(err => {
      console.error(err);
      this.commonService.ShowInfo(this.labels["PANT007_MSG_ERRALT"]);
    });
  }
}
