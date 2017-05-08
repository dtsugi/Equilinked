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

}