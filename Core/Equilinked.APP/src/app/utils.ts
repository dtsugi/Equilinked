import {DateObject} from '../model/alerta';
import moment from "moment";

export class Utils {

  static stringFormat(text: string, ...replacements: any[]) {
    return text.replace(/{(\d+)}/g, function (match, number) {
      return typeof replacements[number] != 'undefined'
        ? replacements[number]
        : match
        ;
    });
  }

  static getMomentFromAlertDate(alertDate: any): any {
    return moment(moment(alertDate).format("YYYY-MM-DD HH:mm:ss"), "YYYY-MM-DD HH:mm:ss");
  }

  static IsValidApiParameter(parameter) {
    if (parameter === undefined || parameter == "null") {
      parameter = null;
    }
    return parameter;
  }

  static SetUrlApiGet(url, parameters: Array<any>) {
    for (var i = 0; i < parameters.length; i++) {
      url += parameters[i] + "/";
    }
    return url;
  }

  static IsEmpty(value) {
    if (value !== undefined && value.length > 0)
      return false;
    else
      return true;
  }

  static IsArrayNotEmpty(object) {
    return (object instanceof Array && object.length > 0);
  }

  static getDateNow() {
    var dateObject: DateObject = new DateObject();
    var date = new Date();
    dateObject.YEAR = date.getFullYear()
    dateObject.MONTH = date.getMonth() + 1;
    dateObject.DAY = date.getDate();
    //var df = year + "-" + month + "-" + day;
    // console.log(df);
    // return df;
    return dateObject;
  }

  static addZeroDate(date) {
    if (date < 10) {
      return "0" + date;
    }
    return date;
  }
}

export class ConstantsConfig {
  static USER_SESSION: string = "userSession";
  static ERR_GNR_APP = "Sucedio un error al comunicarse con el servidor";
  static RES_NN = "Sin valor asignado";
  static RES_SIN_REGISTROS = "No se encontraron registros";
  static ALERTA_TIPO_TODAS = 0;
  static ALERTA_TIPO_HERRAJE = 1;
  static ALERTA_TIPO_DESPARACITACION = 2;
  static ALERTA_TIPO_EVENTOS = 3;
  static ALERTA_TIPO_DENTISTA = 4;
  static ALERTA_TIPO_NOTASVARIAS = 5;
  static ALERTA_FILTER_ALL = 1;
  static ALERTA_FILTER_HISTORY = 2;
  static ALERTA_FILTER_NEXT = 3;
  static ALERTA_FILTER_TODAY = 4;
  static ALERTA_FILTER_AFTER_TODAY = 5;
  static ALERTA_ORDEN_ASCENDENTE = 1;
  static ALERTA_ORDEN_DESCENDENTE = 2;
  //constantes del calendario

  public static CALENDAR_STEP_YEAR: number = 2;
  public static CALENDAR_STEP_MONTH: number = 3;
  public static CALENDAR_STEP_WEEK: number = 4;
  public static CALENDAR_STEP_ALERT: number = 5;

  public static KEY_BADGE_ALERTS: string = "KeyBadgeAlerts";
}
