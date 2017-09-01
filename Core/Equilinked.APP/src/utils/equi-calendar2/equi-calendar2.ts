import {Component, Input, EventEmitter, OnInit, Output} from '@angular/core';
import {LanguageService} from '../../services/language.service';
import {EquiCalYear} from "./equi-cal-year";
import {EquiCalMonth} from "./equi-cal-month";
import {EquiCalWeek} from "./equi-cal-week";
import {EquiCalDay} from "./equi-cal-day";
import moment from "moment";
import "moment/locale/es";

@Component({
  selector: "equi-calendar2",
  templateUrl: "./equi-calendar2.html",
  providers: [LanguageService]
})
export class EquiCalendar2 implements OnInit {
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

  constructor(private languageService: LanguageService,) {
    this.years = new Map<string, EquiCalYear>();
    this.languageService.loadLabels().then(labels => this.labels = labels);
  }

  ngOnInit(): void {
    this.options.step = 1;//Pantalla de mes
    let now = moment();
    let year = this.createYear(now.year());
    this.selectedYear = year;
    this.selectedMonth = year.mapMonths.get(now.format("YYYY-MM"));
    this.selectedWeek = this.selectedMonth.mapWeeks.get(moment().startOf("week").format("YYYY-MM-DD"));
    this.selectedDate = this.selectedWeek.mapDays.get(now.format("YYYY-MM-DD"));
    this.years.set(now.year().toString(), year);
    this.changeMonth.emit({
      start: this.selectedMonth.start,
      end: this.selectedMonth.end
    });
  }

  /*Permite asignar las alertas que se desean visualizar para el mes seleccionado*/
  public setAlerts(alerts: Array<any>): void {
    //this.options.step = 1; //vista del mes
    //this.selectedMonth.hideWeeks = false;
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
        let date = moment(new Date(alert.FechaNotificacion));
        let dayId = date.format("YYYY-MM-DD");
        let weekId = date.startOf("week").format("YYYY-MM-DD");
        let week = this.selectedMonth.mapWeeks.get(weekId);
        week.hasAlerts = true;
        week.mapDays.get(dayId).alerts.push(alert);
      });
    }
  }

  /*Permite asignar una alerta que se ha seleccionar para ver su detalle*/
  public setAlert(alert: any): void {
    this.options.step = 3; //Vista de la alerta!
    this.selectedAlert = alert;
  }

  public back(): void {
    if (this.options.step == 3) {//si esta en la vista de detalle alerta regresamos a la vista de semana
      this.options.step = 2;
    } else if (this.options.step == 2) { //si esta en la vista de semana regresamos a la vista mensual
      this.options.step = 1; //vista de mes de nuevo
      this.selectedDate.showAlerts = false;//se ocultan las alertas
      this.selectedMonth.hideWeeks = false;// se visualizan de nuevo las semanas
    }
  }

  public reloadAlertsCurrentMonth(): void {
    this.changeMonth.emit({
      start: this.selectedMonth.start,
      end: this.selectedMonth.end
    });
    //this.selectedMonth.hideWeeks = false;
  }

  public reloadCurrentAlert(): void {
    this.viewAlert.emit({alert: this.selectedAlert});//le mandamos la seleccionada al fin que solo necesitan del otro lado el ID
  }

  public getCurrentAlert(): any {
    return this.selectedAlert;
  }

  protected selectDate(week: EquiCalWeek, day: EquiCalDay): void {
    if (day.id == this.selectedDate.id) { //volvio a seleccionar el mismo
      this.options.step = 1; //vista de mes de nuevo
      this.selectedDate.showAlerts = !this.selectedDate.showAlerts;
      this.selectedMonth.hideWeeks = this.selectedDate.showAlerts;
    } else { //Selecciono distinto
      this.options.step = 2; //Vista de semana
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
      this.selectedMonth = this.selectedYear.mapMonths.get(moment([this.selectedYear.id, 0]).format("YYYY-MM"));
    }
    this.changeMonth.emit({
      start: this.selectedMonth.start,
      end: this.selectedMonth.end
    });
  }

  /*Visualizar el mes anterior */
  protected lastMonth(): void {
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
      this.selectedMonth = this.selectedYear.mapMonths.get(moment([this.selectedYear.id, 11]).format("YYYY-MM"));
    }
    this.changeMonth.emit({
      start: this.selectedMonth.start,
      end: this.selectedMonth.end
    });
  }

  private createYear(yearNumber: number): EquiCalYear {
    let year: EquiCalYear = EquiCalYear.buildYear(yearNumber);
    return year;
  }
}
