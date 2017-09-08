import {Component, Input, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Events, NavController} from 'ionic-angular';
import {CommonService} from '../../../../services/common.service';
import {AlertaService} from '../../../../services/alerta.service';
import {AlertaCaballoService} from '../../../../services/alerta.caballo.service';
import {LanguageService} from '../../../../services/language.service';
import {SecurityService} from '../../../../services/security.service';
import {UserSessionEntity} from '../../../../model/userSession';
import {ConstantsConfig} from '../../../../app/utils';
import {EquiCalendar2} from '../../../../utils/equi-calendar2/equi-calendar2';
import moment from 'moment';
import 'moment/locale/es';

@Component({
  selector: 'segment-calendario-caballo',
  templateUrl: 'calendario-caballo.html',
  providers: [AlertaService, AlertaCaballoService, CommonService, LanguageService, SecurityService]
})
export class SegmentCalendarioCaballo implements OnInit, OnDestroy {
  private session: UserSessionEntity;
  @Input("caballo") caballo: any;
  @Input("optionsAlertTypes") optionsAlertTypes: any;
  @Input("calendarOptions") calendarOptions: any;
  @ViewChild(EquiCalendar2) calendar: EquiCalendar2;
  labels: any = {};

  constructor(private alertaService: AlertaService,
              public navController: NavController,
              private commonService: CommonService,
              private events: Events,
              private alertaCaballoService: AlertaCaballoService,
              private securityService: SecurityService,
              private languageService: LanguageService) {
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
    });
    this.addEvents();
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }

  reloadAlerts(): void {
    this.calendar.reloadAlertsCurrentMonth();//Mandamos a ejecutar la consulta de alertas
  }

  reloadAlert(): void {
    this.calendar.reloadCurrentAlert();
  }

  backCalendar(): void {
    this.calendar.back();//vista anterior
  }

  getAlert(): any {
    return this.calendar.getCurrentAlert();
  }

  changeMonth(evt: any): void {
    let alertTypes: Array<number> = this.optionsAlertTypes.alertTypes
      .filter(type => type.id && type.checked)
      .map(type => type.id);
    this.alertaCaballoService.getAlertasByCaballoId(this.session.PropietarioId, this.caballo.ID,
      evt.start, evt.end, alertTypes, null, ConstantsConfig.ALERTA_ORDEN_ASCENDENTE,
      this.optionsAlertTypes.alertTypes[0].checked
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

  viewAlert(evt: any): void {
    this.alertaService.getAlertaById(this.session.PropietarioId, evt.alert.ID)
      .then(alert => {
        if (alert != null) {
          let d = new Date(alert.FechaNotificacion);
          alert.Fecha = moment(d).format("dddd, D [de] MMMM [de] YYYY");
          alert.Fecha = alert.Fecha.charAt(0).toUpperCase() + alert.Fecha.slice(1);
          alert.Hora = moment(d).format("hh:mm");
          alert.Meridiano = moment(d).format("a").toUpperCase();
        }
        this.calendar.setAlert(alert); //Asignamos la alerta para que se visualice en pantalla...
      }).catch(err => {
      console.error(err);
    });
  }

  private addEvents(): void {
    this.events.subscribe("calendario:caballo:notificaciones", () => {
      this.reloadAlerts();//que refresque el mes
    });
    this.events.subscribe("calendario:caballo:notificacion", () => {
      this.reloadAlert();//refrescar el detalle de la alerta
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("calendario:caballo:notificaciones");
    this.events.unsubscribe("calendario:caballo:notificacion");
  }
}
