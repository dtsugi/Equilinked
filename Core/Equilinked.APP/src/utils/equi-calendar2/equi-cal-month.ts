import {EquiCalWeek} from "./equi-cal-week";
import {EquiCalYear} from "./equi-cal-year";
import moment from "moment";

export class EquiCalMonth {
  public id: string;
  public nameMonth: string;
  public numberMonth: number;//0-11
  public start: string;
  public end: string;
  public weeks: Array<EquiCalWeek>;
  public mapWeeks: Map<string, EquiCalWeek>;
  public hideWeeks: boolean;
  //guardar referencia
  public year: EquiCalYear;

  constructor(monthId: string) {
    this.id = monthId;
    this.weeks = new Array<EquiCalWeek>();
    this.mapWeeks = new Map<string, EquiCalWeek>();
    this.hideWeeks = false;
  }

  public static buildMonth(startMonth: string, year?: EquiCalYear): EquiCalMonth {
    let calMonth: EquiCalMonth;//objeto mes
    let firstDayWeek: any = moment(startMonth);
    calMonth = new EquiCalMonth(firstDayWeek.format("YYYY-MM"));
    calMonth.nameMonth = firstDayWeek.format("MMMM");
    calMonth.numberMonth = firstDayWeek.month();
    calMonth.start = moment(startMonth).startOf("month").format("YYYY-MM-DD HH:mm:ss");
    calMonth.end = moment(startMonth).endOf("month").format("YYYY-MM-DD HH:mm:ss");
    calMonth.year = year;
    let numberMonth: number = firstDayWeek.month(); //Guardamos el numero del mes
    firstDayWeek.startOf("week"); //Lo regresamos a domingo
    let monthh: number;
    do {
      let week = EquiCalWeek.buildWeek(firstDayWeek.format("YYYY-MM-DD"), numberMonth);
      calMonth.weeks.push(week);
      calMonth.mapWeeks.set(week.id, week);
      firstDayWeek.add(7, "day");//lo recorremos una semana
      monthh = firstDayWeek.month();
    } while (monthh == numberMonth);
    return calMonth;
  }
}
