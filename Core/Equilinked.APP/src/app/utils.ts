import {DateObject} from '../model/alerta';

export class Utils {

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

    static USER_ID_LS = "userIdLS";
    static USER_NAME_LS = "usernameLS";
    static USER_PASSWORD_LS = "userPasswordLS";
    static USER_TOKEN_LS = "userTokenLS";
    static USER_PROPIETARIO_ID_LS = "userPropietarioIdLS";

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
}