import {EquiCalWeek} from "./equi-cal-week";
import moment from "moment";

export class EquiCalDay {
  public id: string;
  public numberDay: number;
  public date: string;
  public alerts: Array<any>;
  public showAlerts: boolean;
  //atributos de referencias
  public week: EquiCalWeek;

  constructor(id: string) {
    this.id = id;
    this.showAlerts = false;
    this.alerts = new Array<any>();
  }

  public static buildDay(date: string, week: EquiCalWeek): EquiCalDay {
    let day: any = moment(date);
    let calDay: EquiCalDay = new EquiCalDay(day.format("YYYY-MM-DD"));
    calDay.week = week;
    calDay.numberDay = day.date();
    calDay.date = day.format("YYYY-MM-DD");
    return calDay;
  }
}
