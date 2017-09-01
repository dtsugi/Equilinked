import {Component, Input, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Events, NavController} from 'ionic-angular';
import {CommonService} from '../../../../../../services/common.service';
import {AlertaService} from '../../../../../../services/alerta.service';
import {AlertaGrupoService} from '../../../../../../services/alerta-grupo.service';
import {LanguageService} from '../../../../../../services/language.service';
import {SecurityService} from '../../../../../../services/security.service';
import {UserSessionEntity} from '../../../../../../model/userSession';
import {ConstantsConfig} from "../../../../../../app/utils";
import {EquiCalendar2} from "../../../../../../utils/equi-calendar2/equi-calendar2";
import moment from "moment";
import "moment/locale/es";

@Component({
  selector: 'segment-calendario-grupo',
  templateUrl: 'calendario-grupo.html',
  providers: [AlertaService, AlertaGrupoService, CommonService, LanguageService, SecurityService]
})
export class SegmentCalendarioGrupo implements OnInit, OnDestroy {
  private session: UserSessionEntity;
  @Input("grupo") grupo: any;
  @Input("optionsAlertTypes") optionsAlertTypes: any;
  @Input("calendarOptions") calendarOptions: any;
  @ViewChild(EquiCalendar2) calendar: EquiCalendar2;
  eventos: Array<any>;
  labels: any = {};

  constructor(private alertaService: AlertaService,
              public navController: NavController,
              private commonService: CommonService,
              private events: Events,
              private alertaGrupoService: AlertaGrupoService,
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
    this.alertaGrupoService.getAlertasByGrupoId(this.session.PropietarioId, this.grupo.ID,
      evt.start, evt.end, alertTypes, null, ConstantsConfig.ALERTA_ORDEN_ASCENDENTE
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
    this.events.subscribe("calendario:grupo:notificaciones", () => {
      this.reloadAlerts();//que refresque el mes
    });
    this.events.subscribe("calendario:grupo:notificacion", () => {
      this.reloadAlert();//refrescar el detalle de la alerta
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("calendario:grupo:notificaciones");
    this.events.unsubscribe("calendario:grupo:notificacion");
  }
}
