import {Component, Input, EventEmitter, OnInit, Output} from '@angular/core';
import moment from "moment";
import "moment/locale/es";

@Component({
  selector: "equi-calendar",
  templateUrl: "./equi-calendar.html"
})
export class EquiCalendar implements OnInit {
  private currentDate: any;
  protected selectedDate: any;
  protected selectedWeek: any;
  private alerts: Array<any>;
  @Output("changeMonth") changeMonth = new EventEmitter();
  @Output("deleteAlert") deleteAlert = new EventEmitter();
  @Output("viewAlert") viewAlert = new EventEmitter();
  monthCalendar: any;

  constructor() {
    this.monthCalendar = {
      year: 0,
      nameMonth: "",
      weeksMonth: new Array<Array<any>>(),
      daysMonth: new Map<string, any>()
    }
  }

  ngOnInit(): void {
    this.currentDate = moment(new Date());
    this.selectedDate = {id: this.currentDate.format("DD-MM-YYYY")};
    this.currentDate.startOf("month");
  }

  refreshCalendar(): void {
    this.monthCalendar = this.buildCalendarMonth();
    this.callChangeMonth();
  }

  removeAlert(alert: any): void {
    console.info("comenzare a remover de la vista la alerta");
    if (alert) {
      this.selectedDate.alerts = this.selectedDate.alerts.filter(a => a.ID != alert.ID);
      this.selectedDate.alerts = this.selectedDate.alerts.length > 0 ? this.selectedDate.alerts : null;
      this.selectedDate.week.hasAlerts = false;
      let i = 0;
      while(i < this.selectedDate.week.days.length) {
        if(this.selectedDate.week.days[i].alerts) {
          this.selectedDate.week.hasAlerts = true;
          break;
        }
      }
    }
  }

  /*
  Asigna la fecha del mes a visualizar
   */
  setDay(date: string): void {
    this.currentDate = moment(date);
    this.selectedDate = {id: this.currentDate.format("DD-MM-YYYY")};
    this.currentDate.startOf("month");//inicio del mes
    //this.monthCalendar = this.buildCalendarMonth();//Construir calendario
    this.callChangeMonth();
  }

  /*
  Lista las alertas para el mes correspondiente a currentDate
   */
  refreshAlertsCalendar(alerts: Array<any>): void {
    this.monthCalendar = this.buildCalendarMonth();
    this.alerts = alerts;
    let fecha: string;
    if (this.alerts) {
      //A cada dia le pegamos sus alertas
      this.alerts.forEach(alert => {
        alert.canDelete = true;
        fecha = moment(alert.FechaNotificacion).format("DD-MM-YYYY");
        let day = this.monthCalendar.daysMonth.get(fecha);
        if (!day.alerts) {
          day.alerts = [];
        }
        day.alerts.push(alert);
      });
      //analizamos si cada semana tiene alertas
      this.monthCalendar.weeksMonth.forEach(week => {
        let i = 0;
        while (i < week.days.length) {
          if (week.days[i].alerts) {
            week.hasAlerts = true;
            break;
          }
          i++;
        }
      });
      //hay alguna seleccion?
      if(this.selectedWeek) {
        let day = this.monthCalendar.daysMonth.get(this.selectedDate.id);
        this.selectedDate = day;
        this.selectedWeek = day.week;
        this.selectedWeek.selectedDay = day;
        this.selectedWeek.hasAlerts = day.alerts != null;
      }
    }
  }

  protected selectDate(week: any, date: any): void {
    this.selectedDate = date;
    if (date.id) {
      console.info("Si es un día correcto")
      if (week.selectedDay) {
        console.info("Ya tiene un dia asignado la semana");
        if (week.selectedDay.id == date.id) {
          console.info("El dia que seleccionaron es el mismo que ya tenia, ocultamos alertas");
          week.selectedDay = null;
          this.selectedWeek = null;
        } else {
          console.info("El dia seleccionado es distinto al que tenia, mostramos alertas");
          week.selectedDay = date;
          this.selectedWeek = week;
        }
      } else {
        console.info("la asemana no tenia seleccion aun, mostramos alertas");
        week.selectedDay = date;
        this.selectedWeek = week;
      }
    }
  }

  protected callDeleteAlert(alert: any): void {
    alert.canDelete = false;
    this.deleteAlert.emit({alert: alert});
  }

  protected callViewAlert(alert: any): void {
    this.viewAlert.emit({alert: alert});
  }

  /*
  Permite construir el calendario que se visualiza en pantalla
   */
  private buildCalendarMonth(): any {
    //Inicalizamos el calendario de acuerdo a la fecha actual
    let calendar: any = {
      year: this.currentDate.year(),
      nameMonth: this.currentDate.format("MMMM"),
      weeksMonth: new Array<Array<any>>(),
      daysMonth: new Map<string, any>()
    };
    let weeksMonth: Array<Array<any>> = calendar.weeksMonth;
    let mapDaysMonth: Map<string, any> = calendar.daysMonth;
    let day = moment(this.currentDate);
    let numberMonth: number = day.get("month");
    let daysMonth: Array<any> = new Array();
    //Creamos la lista de dias
    do {
      let dayMonth: any = {
        id: day.format("DD-MM-YYYY"),
        numberDate: day.date(),
        numberDay: day.day(),
        week: null
      };
      daysMonth.push(dayMonth);
      mapDaysMonth.set(dayMonth.id, dayMonth);
      day.add(1, "days");
    } while (day.get("month") == numberMonth);
    //dividimos por semana
    //let daysWeek: Array<any> = new Array();
    let daysWeek: any = {
      days: new Array(),
      selectedDay: null,
      hasAlerts: false
    };
    daysMonth.forEach(dayMonth => {
      daysWeek.days.push(dayMonth);
      dayMonth.week = daysWeek;
      if (dayMonth.numberDay == 0) {
        weeksMonth.push(daysWeek);
        daysWeek = {
          days: new Array(),
          selectedDay: null
        };
      }
    });
    if (daysWeek.days.length > 0) {//La ultima semana tiene algunos dias
      weeksMonth.push(daysWeek);
    }
    //Ajustamos la primera semana
    let week: any = weeksMonth[0];
    let countDays: number = week.days.length;
    if (countDays < 7) {
      for (let i = 0; i < 7 - countDays; i++) {//Acompletamos la primera semana con null
        week.days.unshift({});
      }
    }
    //Acompletamos la ultima semana
    week = weeksMonth[weeksMonth.length - 1];
    countDays = week.days.length;
    if (countDays < 7) {
      for (let i = 0; i < 7 - countDays; i++) {//Acompletamos la primera semana con null
        week.days.push({});
      }
    }
    return calendar;
  }

  /*
  Navega al siguiente mes para obtener sus alertas
   */
  protected nextMonth(): void {
    this.selectedWeek = null;
    this.currentDate.add(1, "months");
    this.callChangeMonth();
  }

  /*
  Navega al mes anterior para obtener sus alertas
   */
  protected lastMonth(): void {
    this.selectedWeek = null;
    this.currentDate.subtract(1, "months");
    this.callChangeMonth();
  }

  private callChangeMonth(): void {
    //Mandamos a ejecutar la funcion que nos pasaron
    let inicio: string = moment(this.currentDate).startOf("month").format("YYYY-MM-DD HH:mm:ss");
    let fin: string = moment(this.currentDate).endOf("month").format("YYYY-MM-DD HH:mm:ss");
    this.changeMonth.emit({inicio: inicio, fin: fin});
  }
}
