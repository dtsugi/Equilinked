import {Component, OnInit, OnDestroy, ViewChild} from "@angular/core";
import {Events, NavController, PopoverController} from "ionic-angular";
import {AlertaService} from '../../services/alerta.service';
import {CommonService} from '../../services/common.service';
import {LanguageService} from '../../services/language.service';
import {SecurityService} from "../../services/security.service";
import {UserSessionEntity} from '../../model/userSession';
import {EquiPopoverFiltroCalendario} from '../../utils/equi-popover-filtro-calendario/equi-popover-filtro-calendario';
import {EquiCalendar2} from '../../utils/equi-calendar2/equi-calendar2';
import {EdicionNotificacionGeneralPage} from '../../pages/notificaciones/edicion-notificacion/edicion-notificacion';
import {ConstantsConfig} from "../../app/utils";
import moment from "moment";
import "moment/locale/es";
import {Utils} from '../../app/utils';

@Component({
  templateUrl: "calendario.html",
  providers: [AlertaService, CommonService, LanguageService, SecurityService]
})
export class CalendarioPage implements OnInit, OnDestroy {
  private HEIGHT_FOR_REMOVE: number = 56 + 64;//98barra 64superior barra inferior
  public CALENDAR_STEP_YEAR: number = ConstantsConfig.CALENDAR_STEP_YEAR;
  public CALENDAR_STEP_MONTH: number = ConstantsConfig.CALENDAR_STEP_MONTH;
  public CALENDAR_STEP_WEEK: number = ConstantsConfig.CALENDAR_STEP_WEEK;
  public CALENDAR_STEP_ALERT: number = ConstantsConfig.CALENDAR_STEP_ALERT;
  private session: UserSessionEntity;
  public labels: any;
  public calendarOptions: any;
  public optionsTypeAlerts: any;
  public selectedYear: string;
  @ViewChild(EquiCalendar2) calendar: EquiCalendar2;

  constructor(private alertaService: AlertaService,
              private commonService: CommonService,
              private events: Events,
              private languageService: LanguageService,
              private navController: NavController,
              private popoverController: PopoverController,
              private securityService: SecurityService) {
    this.labels = {};
    this.selectedYear = new Date().getFullYear().toString();
  }

  ngOnInit(): void {
    this.adjustHeightSlides();
    this.session = this.securityService.getInitialConfigSession();
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      this.loadAlertTypes();
      this.calendarOptions = {step: this.CALENDAR_STEP_YEAR, isAlertGroup: true};
    });
    this.addEvents();
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }

  backCalendar(): void {
    this.calendar.back();
  }

  newAlert(): void {
    this.navController.push(EdicionNotificacionGeneralPage);
  }

  editAlert(): void {
    let alert: any = this.calendar.getCurrentAlert();
    let params = {
      alerta: JSON.parse(JSON.stringify(alert))
    };
    this.navController.push(EdicionNotificacionGeneralPage, params);
  }

  showFilterAlertTypes(evt: any): void {
    let popover = this.popoverController.create(EquiPopoverFiltroCalendario, {
      options: this.optionsTypeAlerts
    });
    popover.onDidDismiss(() => {
      this.loadAlerts();
    });
    popover.present({
      ev: evt
    });
  }

  changeMonth(evt: any): void {
    let alertTypes: Array<number> = this.optionsTypeAlerts.alertTypes
      .filter(type => type.id && type.checked)
      .map(type => type.id);
    this.alertaService.getAlertasByPropietario(this.session.PropietarioId, evt.start, evt.end,
      alertTypes, null, ConstantsConfig.ALERTA_ORDEN_ASCENDENTE, false)
      .then(alertas => {
        alertas.forEach(alerta => {
          let d = Utils.getMomentFromAlertDate(alerta.FechaNotificacion);
          alerta.Hora = d.format("hh:mm A").toUpperCase();
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
          let d = Utils.getMomentFromAlertDate(alert.FechaNotificacion);
          alert.Fecha = d.format("dddd, D [de] MMMM [de] YYYY");
          alert.Fecha = alert.Fecha.charAt(0).toUpperCase() + alert.Fecha.slice(1);
          alert.Hora = d.format("hh:mm");
          alert.Meridiano = d.format("a").toUpperCase();
        }
        this.calendar.setAlert(alert);
      }).catch(err => {
      console.error(err);
    });
  }

  public changeYear(evt: any): void {
    console.info("El año que llego fue;" + evt.year);
    this.selectedYear = evt.year;
    let alertTypes: Array<number> = this.optionsTypeAlerts.alertTypes
      .filter(type => type.id && type.checked)
      .map(type => type.id);
    this.alertaService.getAlertasByPropietario(this.session.PropietarioId, evt.start, evt.end,
      alertTypes, null, ConstantsConfig.ALERTA_ORDEN_ASCENDENTE, false)
      .then(alertas => {
        alertas.forEach(alerta => {
          let d = Utils.getMomentFromAlertDate(alerta.FechaNotificacion);
          alerta.Hora = d.format("hh:mm A").toUpperCase();
        });
        this.calendar.setAlertsYear(alertas);
      }).catch(err => {
      console.error(err);
      this.commonService.ShowInfo(this.labels["PANT007_MSG_ERRALT"]);
    });
  }

  private adjustHeightSlides(): void {
    let slides = document.querySelectorAll(".calendario.equi-content-slide-scroll");
    for (let i = 0; i < slides.length; i++) {
      let element: any = slides[i];
      element.style.height = (window.innerHeight - this.HEIGHT_FOR_REMOVE) + "px";
    }
  }

  private loadAlerts(): void {
    this.calendar.reloadAlertsCurrentYear();
  }

  private loadAlertTypes(): void {
    //****************************CAMBIAR LOS LABEEEEEEEEEEEEELS!!!! ******************
    let alertTypes: Array<any> = [{name: this.labels["PANT013_LBL_TODS"], checked: true},
      {id: ConstantsConfig.ALERTA_TIPO_EVENTOS, name: this.labels["PANT013_LBL_EVTS"], checked: true},
      {id: ConstantsConfig.ALERTA_TIPO_HERRAJE, name: this.labels["PANT013_LBL_HERR"], checked: true},
      {id: ConstantsConfig.ALERTA_TIPO_DESPARACITACION, name: this.labels["PANT013_LBL_DESP"], checked: true},
      {id: ConstantsConfig.ALERTA_TIPO_DENTISTA, name: this.labels["PANT013_LBL_DENT"], checked: true},
      {id: ConstantsConfig.ALERTA_TIPO_NOTASVARIAS, name: this.labels["PANT013_LBL_NOTS"], checked: true}];
    this.optionsTypeAlerts = {modified: false, alertTypes: alertTypes};
  }

  private addEvents(): void {
    this.events.subscribe("calendario:refresh", () => {
      this.calendar.reloadAlertsCurrentYear();
    });
    this.events.subscribe("calendario:alerta:refresh", () => {
      if (this.calendarOptions.step == this.CALENDAR_STEP_ALERT) { //si no esta en la vista detalle no tiene caaso refrescar!
        this.calendar.reloadCurrentAlert();
      }
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("calendario:refresh");
    this.events.unsubscribe("calendario:alerta:refresh");
  }
}
