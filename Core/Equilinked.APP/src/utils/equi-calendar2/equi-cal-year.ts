import {EquiCalMonth} from "./equi-cal-month";
import moment from "moment";

export class EquiCalYear {
  public id: string;
  public startYear: string;
  public endYear: string;
  public months: Array<EquiCalMonth>;
  public mapMonths: Map<string, EquiCalMonth>;

  constructor(year: number) {
    this.id = year.toString();
    this.months = new Array<EquiCalMonth>();
    this.mapMonths = new Map<string, EquiCalMonth>();
  }

  public static buildYear(year: number): EquiCalYear {
    let calYear: EquiCalYear = new EquiCalYear(year);
    let monthYear: any = moment([year]);
    calYear.startYear = moment([year]).startOf("year").format("YYYY-MM-DD HH:mm:ss");
    calYear.endYear = moment([year]).endOf("year").format("YYYY-MM-DD HH:mm:ss");
    do {
      let month = EquiCalMonth.buildMonth(monthYear.format("YYYY-MM-DD"), calYear);
      calYear.months.push(month);
      calYear.mapMonths.set(month.id, month);
      monthYear.add(1, "month");
    } while (monthYear.year() == year);
    return calYear;
  }
}
