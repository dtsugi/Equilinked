import {Component, Input, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {DateTime} from 'ionic-angular';
import {LanguageService} from '../../services/language.service';
import {EquiCalYear} from "./equi-cal-year";
import {EquiCalMonth} from "./equi-cal-month";
import {EquiCalWeek} from "./equi-cal-week";
import {EquiCalDay} from "./equi-cal-day";
import moment from "moment";
import "moment/locale/es";
import {ConstantsConfig, Utils} from "../../app/utils";

@Component({
  selector: "equi-calendar2",
  templateUrl: "./equi-calendar2.html",
  providers: [LanguageService]
})
export class EquiCalendar2 implements OnInit {
  public CALENDAR_STEP_YEAR: number = ConstantsConfig.CALENDAR_STEP_YEAR;
  public CALENDAR_STEP_MONTH: number = ConstantsConfig.CALENDAR_STEP_MONTH;
  public CALENDAR_STEP_WEEK: number = ConstantsConfig.CALENDAR_STEP_WEEK;
  public CALENDAR_STEP_ALERT: number = ConstantsConfig.CALENDAR_STEP_ALERT;
  public MAX_YEAR_CALENDAR: string = (new Date().getFullYear() + 20).toString();
  public MIN_YEAR_CALENDAR: string = (new Date().getFullYear() - 20).toString();
  protected yearCalendar: string = new Date().getFullYear().toString();
  public years: Map<string, EquiCalYear>;
  public selectedYear: EquiCalYear;
  public selectedMonth: EquiCalMonth;
  public selectedWeek: EquiCalWeek;
  public selectedDate: EquiCalDay;
  protected labels: any;
  protected selectedAlert: any;
  @Input("options") options: any;//aqui tenemos control de la seccion de pantalla que se visualiza para dar posibilida de saber que botones se deben mostrar en otras pantalas
  @Output("changeMonth") changeMonth = new EventEmitter();
  @Output("viewAlert") viewAlert = new EventEmitter();
  @Output("changeYear") changeYear = new EventEmitter();
  @ViewChild(DateTime) yearComponent: DateTime;

  constructor(private languageService: LanguageService,) {
    this.years = new Map<string, EquiCalYear>();
    this.languageService.loadLabels().then(labels => this.labels = labels);
  }

  ngOnInit(): void {
    //this.options.step = ConstantsConfig.CALENDAR_STEP_YEAR;//Pantalla de mes
    console.info("El step del calendar es: ", this.options.step);
    let now = moment();
    let year = this.createYear(now.year());
    this.selectedYear = year;
    this.selectedMonth = year.mapMonths.get(now.format("YYYY-MM"));
    this.selectedWeek = this.selectedMonth.mapWeeks.get(moment().startOf("week").format("YYYY-MM-DD"));
    this.selectedDate = this.selectedWeek.mapDays.get(now.format("YYYY-MM-DD"));
    this.years.set(now.year().toString(), year);
    if (this.options.step == this.CALENDAR_STEP_MONTH) {
      this.changeMonth.emit({
        start: this.selectedMonth.start,
        end: this.selectedMonth.end
      });
    } else if (this.options.step == this.CALENDAR_STEP_YEAR) {
      this.changeYear.emit({
        year: this.selectedYear.id,
        start: this.selectedYear.startYear,
        end: this.selectedYear.endYear
      });
    }
  }

  /*Permite asignar las alertas que se desean visualizar para el mes seleccionado*/
  public setAlerts(alerts: Array<any>): void {
    this.selectedMonth.weeks.forEach(week => {
      week.hasAlerts = false;
      week.days.forEach(day => {
        if (day) {
          day.alerts = new Array<any>();
        }
      });
    });
    if (alerts != null) {
      alerts.forEach(alert => {
        let date = Utils.getMomentFromAlertDate(alert.FechaNotificacion);
        //let date = moment(new Date(alert.FechaNotificacion));
        let dayId = date.format("YYYY-MM-DD");
        let weekId = date.startOf("week").format("YYYY-MM-DD");
        let week = this.selectedMonth.mapWeeks.get(weekId);
        week.hasAlerts = true;
        week.mapDays.get(dayId).alerts.push(alert);
      });
    }
  }

  /*Permite asignar las alertas que se desean visualizar para el mes seleccionado*/
  public setAlertsYear(alerts: Array<any>): void {
    this.selectedYear.months.forEach(month => {
      month.weeks.forEach(week => {
        week.hasAlerts = false;
        week.days.forEach(day => {
          if (day) {
            day.alerts = new Array<any>();
          }
        });
      });
    });
    if (alerts != null) {
      let monthSelected: EquiCalMonth;
      alerts.forEach(alert => {
        //let date = moment(new Date(alert.FechaNotificacion));
        let date = Utils.getMomentFromAlertDate(alert.FechaNotificacion);
        let dayId = date.format("YYYY-MM-DD");
        let monthId = date.format("YYYY-MM");
        let weekId = date.startOf("week").format("YYYY-MM-DD");
        if (!monthSelected || (monthSelected && monthSelected.id != monthId)) {
          monthSelected = this.selectedYear.mapMonths.get(monthId);
        }
        let week = monthSelected.mapWeeks.get(weekId);
        week.hasAlerts = true;
        week.mapDays.get(dayId).alerts.push(alert);
      });
    }
  }

  /*Permite asignar una alerta que se ha seleccionar para ver su detalle*/
  public setAlert(alert: any): void {
    this.options.step = this.CALENDAR_STEP_ALERT; //Vista de la alerta!
    this.selectedAlert = alert;
  }

  public showYear(): void {
    if (this.options.disabledYearView) {
      return;
    }
    this.back();
  }

  public back(): void {
    if (this.options.step == this.CALENDAR_STEP_ALERT) {//si esta en la vista de detalle alerta regresamos a la vista de semana
      this.options.step = this.CALENDAR_STEP_WEEK;
    } else if (this.options.step == this.CALENDAR_STEP_WEEK) { //si esta en la vista de semana regresamos a la vista mensual
      this.options.step = this.CALENDAR_STEP_MONTH; //vista de mes de nuevo
      this.selectedDate.showAlerts = false;//se ocultan las alertas
      this.selectedMonth.hideWeeks = false;// se visualizan de nuevo las semanas
    } else if (this.options.step == this.CALENDAR_STEP_MONTH) {
      this.options.step = this.CALENDAR_STEP_YEAR; //vista de año
      this.selectedDate.showAlerts = false;//se ocultan las alertas
      this.selectedMonth.hideWeeks = false;// se visualizan de nuevo las semanas
    } else if (this.options.step == this.CALENDAR_STEP_YEAR) {
      this.yearComponent.open();
      this.selectedDate.showAlerts = false;//se ocultan las alertas
      this.selectedMonth.hideWeeks = false;// se visualizan de nuevo las semanas
    }
  }

  public reloadAlertsCurrentMonth(): void {
    this.changeMonth.emit({
      start: this.selectedMonth.start,
      end: this.selectedMonth.end
    });
  }

  public reloadAlertsCurrentYear(): void {
    this.changeYear.emit({
      year: this.selectedYear.id,
      start: this.selectedYear.startYear,
      end: this.selectedYear.endYear
    });
  }

  public reloadCurrentAlert(): void {
    this.viewAlert.emit({alert: this.selectedAlert});//le mandamos la seleccionada al fin que solo necesitan del otro lado el ID
  }

  public getCurrentAlert(): any {
    return this.selectedAlert;
  }

  protected selectYear(year: string): void {
    if (year != this.selectedYear.id) {
      if (!this.years.has(year)) {
        let selectedYear: EquiCalYear = this.createYear(+year);
        this.years.set(selectedYear.id, selectedYear);
      }
      this.selectedYear = this.years.get(year);
      this.executeChangeYear();
    }
  }

  protected selectMonth(month: EquiCalMonth): void {
    this.selectedMonth = month;
    this.options.step = this.CALENDAR_STEP_MONTH;
    this.changeMonth.emit({
      start: this.selectedMonth.start,
      end: this.selectedMonth.end
    });
  }

  protected selectDate(week: EquiCalWeek, day: EquiCalDay): void {
    if (day.id == this.selectedDate.id) { //volvio a seleccionar el mismo
      this.options.step = this.CALENDAR_STEP_MONTH; //vista de mes de nuevo
      this.selectedDate.showAlerts = !this.selectedDate.showAlerts;
      this.selectedMonth.hideWeeks = this.selectedDate.showAlerts;
    } else { //Selecciono distinto
      this.options.step = this.CALENDAR_STEP_WEEK; //Vista de semana
      this.selectedWeek = week;
      this.selectedDate = day;
      this.selectedDate.showAlerts = true;
      this.selectedMonth.hideWeeks = true;
    }
  }

  protected view(alert: any): void {
    this.viewAlert.emit({alert: alert});
  }

  /*Visualizar el siguiente mes*/
  protected nextMonth(): void {
    this.options.step = this.CALENDAR_STEP_MONTH;
    this.selectedDate.showAlerts = false;
    this.selectedMonth.hideWeeks = false;
    if (this.selectedMonth.numberMonth < 11) {
      let nexMonthId = moment([this.selectedYear.id, this.selectedMonth.numberMonth + 1]).format("YYYY-MM");
      this.selectedMonth = this.selectedYear.mapMonths.get(nexMonthId);
    } else {
      let yearId = +this.selectedYear.id + 1;
      if (!this.years.has(yearId.toString())) {
        let nextYear = this.createYear(yearId);
        this.years.set(nextYear.id, nextYear);
      }
      this.selectedYear = this.years.get(yearId.toString());
      this.executeChangeYear();
      this.selectedMonth = this.selectedYear.mapMonths.get(moment([this.selectedYear.id, 0]).format("YYYY-MM"));
    }
  }

  /*Visualizar el mes anterior */
  protected lastMonth(): void {
    this.options.step = this.CALENDAR_STEP_MONTH;
    this.selectedDate.showAlerts = false;
    this.selectedMonth.hideWeeks = false;
    if (this.selectedMonth.numberMonth > 0) {
      let lastMonthId = moment([this.selectedYear.id, this.selectedMonth.numberMonth - 1]).format("YYYY-MM");
      this.selectedMonth = this.selectedYear.mapMonths.get(lastMonthId);
    } else {
      let yearId = +this.selectedYear.id - 1;
      if (!this.years.has(yearId.toString())) {
        let lastYear = this.createYear(yearId);
        this.years.set(lastYear.id, lastYear);
      }
      this.selectedYear = this.years.get(yearId.toString());
      this.executeChangeYear();
      this.selectedMonth = this.selectedYear.mapMonths.get(moment([this.selectedYear.id, 11]).format("YYYY-MM"));
    }
  }

  protected getNow(): string {
    return moment().format("YYYY-MM-DD");
  }

  private createYear(yearNumber: number): EquiCalYear {
    let year: EquiCalYear = EquiCalYear.buildYear(yearNumber);
    return year;
  }

  private executeChangeYear(): void {
    this.yearCalendar = this.selectedYear.id;
    this.changeYear.emit({
      year: this.selectedYear.id,
      start: this.selectedYear.startYear,
      end: this.selectedYear.endYear
    });
  }
}
