import {EquiCalDay} from "./equi-cal-day";
import {EquiCalMonth} from "./equi-cal-month";
import moment from "moment";

export class EquiCalWeek {
  public id: string;
  public days: Array<EquiCalDay>;
  public mapDays: Map<string, EquiCalDay>;
  public hasAlerts: boolean;
  //guardado de referencias
  public month: EquiCalMonth;

  constructor(id: string) {
    this.id = id;
    this.days = new Array<EquiCalDay>();
    this.mapDays = new Map<string, EquiCalDay>();
  }

  public static buildWeek(startWeek: string, numberMonth: number, month?: EquiCalMonth): EquiCalWeek {
    let dayWeek: any = moment(startWeek);
    let calWeek: EquiCalWeek = new EquiCalWeek(dayWeek.format("YYYY-MM-DD"));
    calWeek.month = month;
    let countDay = 0;
    do {
      let calDay: EquiCalDay = null;
      if (dayWeek.month() == numberMonth) {
        calDay = EquiCalDay.buildDay(dayWeek.format("YYYY-MM-DD"), calWeek);
        calWeek.mapDays.set(calDay.id, calDay);
      }
      calWeek.days.push(calDay);
      dayWeek.add(1, "day");
      countDay++;
    } while (countDay < 7);
    return calWeek;
  }
}
