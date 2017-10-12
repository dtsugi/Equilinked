import {Injectable} from '@angular/core';
import {Http, RequestOptions, URLSearchParams} from '@angular/http';
import {Platform} from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import {LocalNotifications} from '@ionic-native/local-notifications';
import {AppConfig} from '../app/app.config';
import {ConstantsConfig, Utils} from '../app/utils';
import moment from "moment";

@Injectable()
export class NotificacionLocalService {

  private TITULO_NOTIFICACION: string = "Notificación";
  private TITULO_NOTIFICACION_DIA: string = "Actividades del día";
  private TITULO_NOTIFICACION_ANTICIPADA: string = "Recordatorio";

  private TEXTO_NOTIFICACION: string = "En este momento: {0}";
  private TEXTO_NOTIFICACION_DIA: string = "Hoy cuenta con 1 actividad";
  private TEXTO_NOTIFICACION_DIA_N: string = "Hoy cuenta con {0} actividades";
  private TEXTO_NOTIFICACION_ANTICIPADA: string = "{0} - {1}";

  private database: SQLiteObject;

  constructor(private http: Http,
              private localNotifications: LocalNotifications,
              private platform: Platform,
              private sqlite: SQLite) {
  }

  public async initDataBase() {
    try {
      this.database = await this.sqlite.create({
        name: AppConfig.DATABASE_NAME,
        location: 'default'
      });
      await this.database.executeSql("CREATE TABLE IF NOT EXISTS notificacion (id INTEGER PRIMARY KEY AUTOINCREMENT, id_alerta INTEGER NOT NULL, id_notificacion_local INTEGER NOT NULL, fecha_notificacion TIMESTAMP NOT NULL)", []);
      await this.database.executeSql("CREATE TABLE IF NOT EXISTS notificacion_anticipada (id INTEGER PRIMARY KEY AUTOINCREMENT,id_alerta INTEGER NOT NULL,id_notificacion_local INTEGER NOT NULL,fecha_notificacion TIMESTAMP NOT NULL)", []);
      await this.database.executeSql("CREATE TABLE IF NOT EXISTS notificacion_diaria (id INTEGER PRIMARY KEY AUTOINCREMENT,id_notificacion_local INTEGER NOT NULL,fecha_notificacion TIMESTAMP NOT NULL,cantidad_alertas INTEGER NOT NULL)", []);
    } catch (err) {
      console.error(JSON.stringify(err));
    }
  }

  public getRegNotificacionDia(day: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let sql = "SELECT id, id_notificacion_local, fecha_notificacion, cantidad_alertas FROM notificacion_diaria WHERE fecha_notificacion = ?";
      let date = moment(day, 'YYYY-MM-DD');
      this.database.executeSql(sql, [date.format("YYYY-MM-DD")])
        .then(result => {
          let regNotificacion: any = null;
          if (result && result.rows.length > 0) {
            let data = result.rows.item(0);
            regNotificacion = {
              id: data.id, idNotificacionLocal: data.id_notificacion_local,
              fechaNotificacion: data.fecha_notificacion, cantidadAlertas: data.cantidad_alertas
            };
          }
          resolve(regNotificacion);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  private getRegNotificacion(alertaId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let sql = "SELECT id, id_alerta, id_notificacion_local, fecha_notificacion FROM notificacion WHERE id_alerta = ? order by id desc limit 1";
      this.database.executeSql(sql, [alertaId])
        .then(result => {
          let regNotificacion: any = null;
          if (result && result.rows.length > 0) {
            let data = result.rows.item(0);
            regNotificacion = {
              id: data.id, idAlerta: data.id_alerta, idNotificacionLocal: data.id_notificacion_local,
              fechaNotificacion: data.fecha_notificacion
            };
          }
          resolve(regNotificacion);
        }).catch(err => {
        reject(err);
      });
    });
  }

  private getRegNotificacionAnticipada(alertaId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let sql = "SELECT id, id_alerta, id_notificacion_local, fecha_notificacion FROM notificacion_anticipada WHERE id_alerta = ? order by id desc limit 1";
      this.database.executeSql(sql, [alertaId])
        .then(result => {
          let regNotificacion: any = null;
          if (result && result.rows.length > 0) {
            let data = result.rows.item(0);
            regNotificacion = {
              id: data.id, idAlerta: data.id_alerta, idNotificacionLocal: data.id_notificacion_local,
              fechaNotificacion: data.fecha_notificacion
            };
          }
          resolve(regNotificacion);
        }).catch(err => {
        reject(err);
      });
    });
  }

  private getNotificacionLocal(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.localNotifications.get(id)
        .then((notification: any) => {
          let noti: any = null;
          if (notification && !isNaN(notification.at)) {
            noti = notification;
          }
          resolve(noti);
        }).catch(err => {
        reject(err);
      });
    });
  }

  private getRegsNotificaciones(ids: Array<number>): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      let sql = "SELECT id, id_alerta, id_notificacion_local, fecha_notificacion FROM notificacion WHERE id_alerta in(";
      ids.forEach(id => {
        sql += id + ",";
      });
      sql = sql.substr(0, sql.length - 1) + ")";
      this.database.executeSql(sql, [])
        .then(result => {
          let regNotifications: Array<any> = new Array();
          if (result && result.rows.length > 0) {
            for (let i = 0; i < result.rows.length; i++) {
              let data = result.rows.item(i);
              regNotifications.push({
                id: data.id, idAlerta: data.id_alerta, idNotificacionLocal: data.id_notificacion_local,
                fechaNotificacion: data.fecha_notificacion
              });
            }
          }
          resolve(regNotifications);
        }).catch(err => {
        reject(err);
      });
    });
  }

  private getRegNotificacionesAnticipadas(ids: Array<number>): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      let sql = "SELECT id, id_alerta, id_notificacion_local, fecha_notificacion FROM notificacion_anticipada WHERE id_alerta in(";
      ids.forEach(id => {
        sql += id + ",";
      });
      sql = sql.substr(0, sql.length - 1) + ")";
      this.database.executeSql(sql, [])
        .then(result => {
          let regNotifications: Array<any> = new Array();
          if (result && result.rows.length > 0) {
            for (let i = 0; i < result.rows.length; i++) {
              let data = result.rows.item(i);
              regNotifications.push({
                id: data.id, idAlerta: data.id_alerta, idNotificacionLocal: data.id_notificacion_local,
                fechaNotificacion: data.fecha_notificacion
              });
            }
          }
          resolve(regNotifications);
        }).catch(err => {
        reject(err);
      });
    });
  }

  private getRegsNotificacionesDia(fechas: Array<string>): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      let sql = "SELECT id, id_notificacion_local, fecha_notificacion, cantidad_alertas FROM notificacion_diaria WHERE fecha_notificacion in(";
      fechas.forEach(id => {
        sql += "'" + id + "',";
      });
      sql = sql.substr(0, sql.length - 1) + ")";
      this.database.executeSql(sql, [])
        .then(result => {
          let regNotifications: Array<any> = new Array();
          if (result && result.rows.length > 0) {
            for (let i = 0; i < result.rows.length; i++) {
              let data = result.rows.item(i);
              regNotifications.push({
                id: data.id, idNotificacionLocal: data.id_notificacion_local,
                fechaNotificacion: data.fecha_notificacion, cantidadAlertas: data.cantidad_alertas
              });
            }
          }
          resolve(regNotifications);
        }).catch(err => {
        reject(err);
      });
    });
  }

  public async deleteLocalNotificationAlert(ids: Array<number>) {
    let queries: Array<any> = new Array();
    let notificacionesEliminar: Array<any> = new Array();
    let notificacionesActualizar: Array<any> = new Array();
    let notificacionesGuardar: Array<any> = new Array();

    try {
      let regNotificaciones = await this.getRegsNotificaciones(ids);
      let regNotificacionesAnticipadas = await this.getRegNotificacionesAnticipadas(ids);
      let idsNotificacionesLocales: Array<number> = new Array();
      if (regNotificaciones && regNotificaciones.length > 0) {
        console.log("Hay registros de notificaciones encontrados");
        let mapDias: Map<string, any> = new Map();
        regNotificaciones.forEach(reg => {
          queries.push({
            query: "DELETE FROM notificacion WHERE id = ?",
            params: [reg.id]
          });
          console.log("Los registros fueron marcados para eliminar");

          idsNotificacionesLocales.push(reg.idNotificacionLocal);
          console.log("Se agregaron algunos ids para consultar su notificacion local");

          //vamos a ver la fecha del dia
          let fecha = Utils.getMomentFromAlertDate(reg.fechaNotificacion);
          let idDia = fecha.format("YYYY-MM-DD");
          if (!mapDias.has(idDia)) {
            mapDias.set(idDia, {
              dia: idDia,
              contador: 0
            });
          }
          let elementDia = mapDias.get(idDia);
          elementDia.contador = elementDia.contador + 1;
        });
        console.log("Se construyo el registro de notificaciones por dia que seran eliminadas");
        console.log(JSON.stringify(mapDias));

        console.log("Consultando notificaciones para las fechas de los dias");
        let regNotificacionesDia = await this.getRegsNotificacionesDia(Array.from(mapDias.values()).map(reg => reg.dia));
        console.log(JSON.stringify(regNotificacionesDia));

        if (regNotificacionesDia && regNotificacionesDia.length > 0) {
          console.log("Hay reg de notificaciones de dia");

          for (let i = 0; i < regNotificacionesDia.length; i++) {
            let f: string = Utils.getMomentFromAlertDate(regNotificacionesDia[i].fechaNotificacion).format("YYYY-MM-DD");
            let elementDia = mapDias.get(f);
            elementDia.registro = regNotificacionesDia[i];

            let notiLocalDia = await this.localNotifications.get(regNotificacionesDia[i].idNotificacionLocal);
            if (notiLocalDia) {
              elementDia.notificacionLocal = notiLocalDia;
            }
          }
          console.log("El mapa ahora cuenta con referencia a notifiacion local y el registro de bd");
          console.log(JSON.stringify(mapDias));

          mapDias.forEach((value, key) => {
            if (value.notificacionLocal) {
              console.log("EL dia " + key + " cuenta con notificacion local");
              value.notificacionLocal.badge = value.notificacionLocal.badge - value.contador;
              if (value.notificacionLocal.badge < 1) {
                queries.push({
                  query: "DELETE FROM notificacion_diaria WHERE id = ?", params: [value.registro.id]
                });
                notificacionesEliminar.push(value.notificacionLocal);
                console.log("El dia " + key + " se marco para eliminar solo tiene 1 actividad");
              } else {
                notificacionesEliminar.push(value.notificacionLocal);

                let notificacionnn: any = {
                  id: new Date().getTime(), at: moment(value.dia, "YYYY-MM-DD").toDate(),
                  title: this.TITULO_NOTIFICACION_DIA,
                  text: value.notificacionLocal.badge == 1 ?
                    this.TEXTO_NOTIFICACION_DIA
                    : Utils.stringFormat(this.TEXTO_NOTIFICACION_DIA_N, value.notificacionLocal.badge),
                  badge: value.notificacionLocal.badge
                };
                notificacionesGuardar.push(notificacionnn);
                queries.push({
                  query: "UPDATE notificacion_diaria SET cantidad_alertas = ?, id_notificacion_local = ? WHERE id = ?",
                  params: [notificacionnn.badge, notificacionnn.id, value.registro.id]
                });
              }
            } else {
              console.log("El dia " + key + " no cuenta con notificacion local");
              queries.push({
                query: "DELETE FROM notificacion_diaria WHERE id = ?", params: [value.registro.id]
              });
            }
          });
        }

      }

      if (regNotificacionesAnticipadas && regNotificacionesAnticipadas.length > 0) {
        console.log("Se detectaron noti anticipadas para eliminar, se agregaran sus ids");
        queries.concat(regNotificacionesAnticipadas.map(reg => {
          return {
            query: "DELETE FROM notificacion_anticipada WHERE id = ?",
            params: [reg.id]
          }
        }));
        idsNotificacionesLocales.concat(regNotificacionesAnticipadas.map(reg => reg.idNotificacionLocal));
      }

      console.log("Consultando noti locales de notificaciones y alertas ant");
      for (let i = 0; i < idsNotificacionesLocales.length; i++) {
        let notificacionLocal = await this.localNotifications.get(idsNotificacionesLocales[i]);
        if (notificacionLocal) {
          notificacionesEliminar.push(notificacionLocal);
        }
      }

      console.log("Comienza la masacre!");
      if (queries.length > 0) {
        await this.database.transaction(sql => {
          queries.forEach(q => {
            console.log("SQL: " + q.query + " - " + JSON.stringify(q.params));
            sql.executeSql(q.query, q.params);
          });
        });
      }
      if (notificacionesGuardar.length > 0) {
        for (let i = 0; i < notificacionesGuardar.length; i++) {
          console.log("Guardando - " + JSON.stringify(notificacionesGuardar[i]));
          this.localNotifications.schedule(notificacionesGuardar[i]);
        }
      }
      if (notificacionesActualizar.length > 0) {
        for (let i = 0; i < notificacionesActualizar.length; i++) {
          console.log("Actualizando - " + JSON.stringify(notificacionesActualizar[i]));
          this.localNotifications.update(notificacionesActualizar[i]);
        }
      }
      if (notificacionesEliminar.length > 0) {
        console.log("Eliminando: " + JSON.stringify(notificacionesEliminar.map(n => n.id)));
        await this.localNotifications.cancel(notificacionesEliminar.map(n => n.id));
      }
    } catch (err) {
      console.log("Error al eliminar");
      console.log(JSON.stringify(err));
      throw  err;
    }
  }

  public async saveLocalNotificacionAlert(alertaAct: any, alertaAnt: any) {
    let now = moment();
    console.log("Fecha actual: " + now.format("YYYY-MM-DD HH:mm:ss"));
    let notificationId: number = new Date().getTime();
    let sound: string = !this.platform.is('ios') ? 'file://sound.mp3' : 'file://beep.caf';
    let queries: Array<any> = new Array<any>();
    let notificacionesGuardar: Array<any> = new Array();
    let notificacionesActualizar: Array<any> = new Array();
    let notificacionesEliminar: Array<any> = new Array();

    try {
      if (!alertaAnt) { //si viene null alerta ant es que es nueva .-.
        console.log("[Ok] Alerta nueva a registrar");
        let fechaAlertaAct = Utils.getMomentFromAlertDate(alertaAct.FechaNotificacion);
        console.log("[Ok] La fecha de la alerta actual es: " + fechaAlertaAct.format("YYYY-MM-DD HH:mm:ss"));
        if (fechaAlertaAct.isAfter(now)) { //fecha not es mayor fecha actual
          console.log("[Ok] La fecha de la alerta es mayor a la fecha actual")
          let regNotificacionDiaAct: any = await this.getRegNotificacionDia(fechaAlertaAct.format("YYYY-MM-DD"));
          if (regNotificacionDiaAct) {
            console.log("[Ok] El dia de la alerta ya existe");
            console.log(JSON.stringify(regNotificacionDiaAct));
            let notificacionLocalDiaAct: any = await this.getNotificacionLocal(regNotificacionDiaAct.idNotificacionLocal);
            if (notificacionLocalDiaAct) {
              console.log("[Ok] La notificacion local del dia si existe");
              console.log(JSON.stringify(notificacionLocalDiaAct));
              notificationId++;
              notificacionesEliminar.push(notificacionLocalDiaAct);
              notificacionLocalDiaAct = {
                id: notificationId, at: moment(fechaAlertaAct.format("YYYY-MM-DD")).toDate(),
                title: this.TITULO_NOTIFICACION_DIA,
                text: Utils.stringFormat(this.TEXTO_NOTIFICACION_DIA_N, (+regNotificacionDiaAct.cantidadAlertas + 1)),
                badge: (+regNotificacionDiaAct.cantidadAlertas + 1)
              };
              notificacionesGuardar.push(notificacionLocalDiaAct);
              queries.push({
                query: "UPDATE notificacion_diaria SET cantidad_alertas = ?, id_notificacion_local = ? WHERE id = ?",
                params: [notificacionLocalDiaAct.badge, notificationId, regNotificacionDiaAct.id]
              });
              console.log("[Ok] La notificacion local se actualizara");
            }
          } else {
            if (fechaAlertaAct.format("YYYY-MM-DD") != now.format("YYYY-MM-DD")) {
              console.log("[Ok] Se registrara una nueva alerta del dia")
              notificationId++;
              queries.push({
                query: "INSERT INTO notificacion_diaria(id_notificacion_local, fecha_notificacion, cantidad_alertas) VALUES(?, ?, ?)",
                params: [notificationId, fechaAlertaAct.format("YYYY-MM-DD"), 1]
              });
              notificacionesGuardar.push({
                id: notificationId, at: moment(fechaAlertaAct.format("YYYY-MM-DD")).toDate(),
                text: this.TEXTO_NOTIFICACION_DIA, badge: 1,
                title: this.TITULO_NOTIFICACION_DIA
              });
            } else {
              console.log("La notificacion de dia es de hoy, no se creara");
            }
          }

          //registrar alerta
          notificationId++;
          notificacionesGuardar.push({
            id: notificationId, at: fechaAlertaAct.toDate(),
            text: Utils.stringFormat(this.TEXTO_NOTIFICACION, alertaAct.Titulo),
            title: this.TITULO_NOTIFICACION
          });
          queries.push({
            query: "INSERT INTO notificacion(id_alerta, id_notificacion_local, fecha_notificacion) VALUES(?, ?, ?)",
            params: [alertaAct.ID, notificationId, fechaAlertaAct.format('YYYY-MM-DD HH:mm:ss')]
          });
          console.log("[Ok] Se registrara una nueva alerta")

          //Registrar notificacion anticipada
          if (alertaAct.AlertaRecordatorio && alertaAct.AlertaRecordatorio.length > 0) {
            notificationId++;
            let alertaAnticipadaAct = alertaAct.AlertaRecordatorio[0];
            console.log("[Ok] Info alerta anticipada:");
            console.log(JSON.stringify(alertaAnticipadaAct));
            let fechaAnt = Utils.getMomentFromAlertDate(alertaAct.FechaNotificacion);
            fechaAnt.subtract(alertaAnticipadaAct.UnidadTiempo.EquivalenciaMinutos * alertaAnticipadaAct.ValorTiempo, 'minutes');
            notificacionesGuardar.push({
              id: notificationId, at: fechaAnt.toDate(),
              text: Utils.stringFormat(this.TEXTO_NOTIFICACION_ANTICIPADA, fechaAlertaAct.format("DD/MM/YYYY HH:mm"), alertaAct.Titulo),
              title: this.TITULO_NOTIFICACION_ANTICIPADA, sound: sound
            });
            queries.push({
              query: "INSERT INTO notificacion_anticipada(id_alerta, id_notificacion_local, fecha_notificacion) VALUES(?, ?, ?)",
              params: [alertaAct.ID, notificationId, fechaAnt.format("YYYY-MM-DD HH:mm:ss")]
            });
            console.log("[Ok] se registrara una nueva alerta anticipada");
          } else {
            console.log("[Ok] No hay alerta anticipada");
          }
        }
      } else { //ACTUALIZACION!!!!!
        console.log("[Ok] Se actualizara una alerta");
        let fechaAlertaAct = Utils.getMomentFromAlertDate(alertaAct.FechaNotificacion);
        let fechaAlertaAnt = Utils.getMomentFromAlertDate(alertaAnt.FechaNotificacion);
        if (fechaAlertaAct.format("YYYY-MM-DD") != fechaAlertaAnt.format("YYYY-MM-DD")) {
          let regNotificacionDiaAnt: any = await this.getRegNotificacionDia(fechaAlertaAnt.format("YYYY-MM-DD"));
          console.log("El registro de dia de la fecha anterior");
          console.log(JSON.stringify(regNotificacionDiaAnt));
          //Aqui un ajuste... podria! tal vez... en un mundo lejano venir null regNotificacionDiaAnt :S
          let notificacionLocalDiaAnt: any = regNotificacionDiaAnt ? await this.getNotificacionLocal(regNotificacionDiaAnt.idNotificacionLocal) : null;
          if (regNotificacionDiaAnt && notificacionLocalDiaAnt) {
            console.log("[Ok] Hay una alerta de dia para la fecha anterior");
            if (notificacionLocalDiaAnt.badge == 1) {
              queries.push({
                query: "DELETE FROM notificacion_diaria WHERE id = ?",
                params: [regNotificacionDiaAnt.id]
              });
              notificacionesEliminar.push(notificacionLocalDiaAnt);
              console.log("[Ok] Se eliminara registro y notificacion para el dia de fecha anterior");
            } else {
              notificacionesEliminar.push(notificacionLocalDiaAnt);
              notificationId++;
              let cantidadAct = regNotificacionDiaAnt.cantidadAlertas - 1;
              notificacionLocalDiaAnt = {
                id: notificationId, at: moment(fechaAlertaAnt.format("YYYY-MM-DD")).toDate(),
                badge: cantidadAct, title: this.TITULO_NOTIFICACION_DIA,
                text: cantidadAct == 1 ?
                  this.TEXTO_NOTIFICACION_DIA :
                  Utils.stringFormat(this.TEXTO_NOTIFICACION_DIA_N, cantidadAct)
              };
              notificacionesGuardar.push(notificacionLocalDiaAnt);
              queries.push({
                query: "UPDATE notificacion_diaria SET cantidad_alertas = ?, id_notificacion_local = ? WHERE id = ?",
                params: [cantidadAct, notificationId, regNotificacionDiaAnt.id]
              });
              console.log("[Ok] Se actualizara alerta del dia para fecha anterior");
            }
          }
          //consultar reg bd de dia para alerta act
          let regNotificacionDiaAct: any = await this.getRegNotificacionDia(fechaAlertaAct.format("YYYY-MM-DD"));
          if (regNotificacionDiaAct) {
            let notificacionLocalDiaAct: any = await this.getNotificacionLocal(regNotificacionDiaAct.idNotificacionLocal);
            console.log("[Ok] Hay registro para alerta dia fecha actualizada");
            if (notificacionLocalDiaAct) {
              notificacionesEliminar.push(notificacionLocalDiaAct);
              notificationId++;
              let cantAler = regNotificacionDiaAct.cantidadAlertas + 1;
              notificacionLocalDiaAct = {
                id: notificationId, at: moment(fechaAlertaAct.format("YYYY-MM-DD"), "YYYY-MM-DD").toDate(),
                badge: cantAler, title: this.TITULO_NOTIFICACION_DIA,
                text: Utils.stringFormat(this.TEXTO_NOTIFICACION_DIA_N, cantAler)
              }
              console.log("[Ok] Se actualizara alerta de dia de fecha actual");
              notificacionesGuardar.push(notificacionLocalDiaAct);
              queries.push({
                query: "UPDATE notificacion_diaria SET cantidad_alertas = ?, id_notificacion_local = ? WHERE id = ?",
                params: [notificacionLocalDiaAct.badge, notificationId, regNotificacionDiaAct.id]
              });
            }
          } else {
            if (fechaAlertaAct.format("YYYY-MM-DD") != now.format("YYYY-MM-DD") && fechaAlertaAct.isAfter(now)) {
              notificationId++;
              queries.push({
                query: "INSERT INTO notificacion_diaria(id_notificacion_local, fecha_notificacion, cantidad_alertas) VALUES(?, ?, ?)",
                params: [notificationId, fechaAlertaAct.format("YYYY-MM-DD"), 1]
              });
              notificacionesGuardar.push({
                id: notificationId, at: moment(fechaAlertaAct.format("YYYY-MM-DD")).toDate(),
                text: this.TEXTO_NOTIFICACION_DIA,
                title: this.TITULO_NOTIFICACION_DIA, badge: 1
              });
              console.log("[Ok] Se actualizara alerta de dia para fecha actual");
            }
          }
        }

        console.log("[Ok] Se intentara actualizar info de alerta act");
        //consultar reg bd de notificaicon actual
        let regNotificacion: any = await this.getRegNotificacion(alertaAct.ID);
        console.log(JSON.stringify(regNotificacion));
        let notificacionLocal: any = regNotificacion ? await this.getNotificacionLocal(regNotificacion.idNotificacionLocal) : null;
        console.log(JSON.stringify(notificacionLocal));
        if (notificacionLocal) {
          console.log("[Ok] Hay notificacion local de alerta act");
          console.log(JSON.stringify(notificacionLocal));
          if (fechaAlertaAct.isAfter(now)) {
            notificacionesEliminar.push(notificacionLocal);
            notificationId++;
            notificacionLocal = {
              id: notificationId, at: fechaAlertaAct.toDate(),
              text: Utils.stringFormat(this.TEXTO_NOTIFICACION, alertaAct.Titulo),
              title: this.TITULO_NOTIFICACION
            };
            notificacionesGuardar.push(notificacionLocal);
            queries.push({
              query: "UPDATE notificacion SET fecha_notificacion = ?, id_notificacion_local = ? WHERE id = ?",
              params: [fechaAlertaAct.format("YYYY-MM-DD HH:mm:ss"), notificationId, regNotificacion.id]
            });
            console.log("[Ok] Se actualizara reg y alerta not local de alerta act");
          } else {
            queries.push({
              query: "DELETE FROM notificacion WHERE id = ?",
              params: [regNotificacion.id]
            });
            notificacionesEliminar.push(notificacionLocal);
            console.log("[Ok] Se eliminara reg y not local de alerta act");
          }
        } else {
          console.log("[Ok] No se detecto notificacion local de alerta act");
          if (fechaAlertaAct.isAfter(now)) {
            console.log("[Ok] Se creara notificacion de alerta act");
            notificationId++;
            notificacionesGuardar.push({
              id: notificationId, at: fechaAlertaAct.toDate(),
              text: Utils.stringFormat(this.TEXTO_NOTIFICACION, alertaAct.Titulo),
              title: this.TITULO_NOTIFICACION
            });
            queries.push({
              query: "INSERT INTO notificacion(id_alerta, id_notificacion_local, fecha_notificacion) values(?, ?, ?)",
              params: [alertaAct.ID, notificationId, fechaAlertaAct.format('YYYY-MM-DD HH:mm:ss')]
            });
          }
        }

        let regNotificacionAnticipada: any = await this.getRegNotificacionAnticipada(alertaAct.ID);
        if (regNotificacionAnticipada) {
          console.log("[Ok] se detecto reg de alerta anticipada de alerta anterior");
          console.log(JSON.stringify(regNotificacionAnticipada));
          let notificacionLocalAnticipada = await this.getNotificacionLocal(regNotificacionAnticipada.idNotificacionLocal);
          if (notificacionLocalAnticipada) {
            console.log("[Ok] Se eliminara not local de alerta anterior");
            notificacionesEliminar.push(notificacionLocalAnticipada);
          }
          queries.push({
            query: "DELETE FROM notificacion_anticipada WHERE id = ?",
            params: [regNotificacionAnticipada.id]
          });
          console.log("[Ok] Se eliminara reg de alerta de alerta anterior");
        }
        //Registrar notificacion anticipada
        if (alertaAct.AlertaRecordatorio && alertaAct.AlertaRecordatorio.length > 0) {
          console.log("[Ok] Se detecto una not anticipada para alerta act");
          let alertaAnticipadaAct = alertaAct.AlertaRecordatorio[0];
          let fechaAnt = Utils.getMomentFromAlertDate(alertaAct.FechaNotificacion);
          fechaAnt.subtract(alertaAnticipadaAct.UnidadTiempo.EquivalenciaMinutos * alertaAnticipadaAct.ValorTiempo, 'minutes');
          if (fechaAnt.isAfter(now)) {
            notificationId++;
            notificacionesGuardar.push({
              id: notificationId, at: fechaAnt.toDate(),
              text: Utils.stringFormat(this.TEXTO_NOTIFICACION_ANTICIPADA, fechaAlertaAct.format("DD/MM/YYYY HH:mm"), alertaAct.Titulo),
              title: this.TITULO_NOTIFICACION_ANTICIPADA, sound: sound
            });
            queries.push({
              query: "INSERT INTO notificacion_anticipada(id_alerta, id_notificacion_local, fecha_notificacion) VALUES(?, ?, ?)",
              params: [alertaAct.ID, notificationId, fechaAnt.format("YYYY-MM-DD HH:mm:ss")]
            });
            console.log("[Ok] Se registrara alerta anticipada para alerta atc");
          }
        } else {
          console.log("[Ok] No hay alerta anticipada para alerta act");
        }
      }

      console.log("[War] Se comenzará a guardar la informacion...");
      await this.database.transaction(sql => {
        queries.forEach(q => {
          console.log("SQL: " + q.query + " - " + JSON.stringify(q.params));
          sql.executeSql(q.query, q.params);
        });
      });
      if (notificacionesGuardar.length > 0) {
        notificacionesGuardar.forEach(notificacion => {
          console.log("[Guardando] - " + JSON.stringify(notificacion));
          this.localNotifications.schedule(notificacion);
        });
      }
      if (notificacionesActualizar.length > 0) {
        notificacionesActualizar.forEach(notificacion => {
          console.log("[Actualizando] - " + JSON.stringify(notificacion));
          this.localNotifications.update(notificacion);
        });
      }
      if (notificacionesEliminar.length > 0) {
        notificacionesEliminar.forEach(notificacion => {
          console.log("[Eliminando] - " + JSON.stringify(notificacion));
          this.localNotifications.cancel(notificacion.id);
        });
      }
      console.log("Proceso finalizado ...");
    } catch (ex) {
      console.log("Error: " + JSON.stringify(ex));
      throw ex;
    }
  }

  public async removeAllLocalNotificacions() {
    try {
      localStorage.removeItem(ConstantsConfig.KEY_BADGE_ALERTS);
      await this.database.executeSql("DELETE FROM notificacion", []);
      await this.database.executeSql("DELETE FROM notificacion_anticipada", []);
      await this.database.executeSql("DELETE FROM notificacion_diaria", []);
      await this.localNotifications.clearAll();
      await this.localNotifications.cancelAll();
    } catch (ex) {
      console.log(JSON.stringify(ex));
      throw ex;
    }
  }

  public saveLocalNotifications(propietarioId: number, inicio: string): Promise<any> {
    let now: any = moment();
    let url: string = AppConfig.API_URL + "api/propietarios/" + propietarioId + "/alertas/dia";
    let params = new URLSearchParams();
    params.set("inicio", inicio);
    return new Promise((resolve, reject) => {
      this.http.get(url, new RequestOptions({search: params}))
        .timeout(AppConfig.REQUEST_TIMEOUT)
        .map(alertas => alertas.json())
        .toPromise()
        .then(alertasDia => {
          let notificacionId = new Date().getTime();
          let notificaciones: Array<any> = new Array<any>();//notificaciones para el servicio
          let notificacionesbd: Array<any> = new Array<any>();//notificaciones para la bd
          let sound: string = !this.platform.is('ios') ? 'file://sound.mp3' : 'file://beep.caf';

          if (alertasDia && alertasDia.length > 0) {
            alertasDia.forEach(notificacionDia => {
              let fechaDiaa = Utils.getMomentFromAlertDate(notificacionDia.Fecha);
              //primero la notificacion diaria de media noche
              let notificacionDiaLocal = {
                id: notificacionId,
                at: fechaDiaa.toDate(),
                text: notificacionDia.Alertas.length == 1 ?
                  this.TEXTO_NOTIFICACION_DIA :
                  Utils.stringFormat(this.TEXTO_NOTIFICACION_DIA_N, notificacionDia.Alertas.length),
                title: this.TITULO_NOTIFICACION_DIA,
                badge: notificacionDia.Alertas.length
              };
              notificacionId++;
              notificaciones.push(notificacionDiaLocal);
              notificacionesbd.push({
                query: "INSERT INTO notificacion_diaria(id_notificacion_local, fecha_notificacion, cantidad_alertas) VALUES(?, ?, ?)",
                params: [notificacionDiaLocal.id, fechaDiaa.format("YYYY-MM-DD"), notificacionDiaLocal.badge]
              });

              //Ahora las notificaciones del dia
              notificacionDia.Alertas.forEach(alerta => {
                let fechaNotificacionn: any = Utils.getMomentFromAlertDate(alerta.FechaNotificacion);
                if (fechaNotificacionn.isAfter(now)) {
                  let notificacionLocal = {
                    id: notificacionId,
                    at: fechaNotificacionn.toDate(),
                    text: Utils.stringFormat(this.TEXTO_NOTIFICACION, alerta.Titulo),
                    title: this.TITULO_NOTIFICACION
                  };
                  notificacionId++;
                  notificaciones.push(notificacionLocal);
                  notificacionesbd.push({
                    query: "INSERT INTO notificacion(id_alerta, id_notificacion_local, fecha_notificacion) VALUES(?, ?, ?)",
                    params: [alerta.ID, notificacionLocal.id, fechaNotificacionn.format("YYYY-MM-DD HH:mm:ss")]
                  });

                  //Ahora las notificaciones anticipadas
                  if (alerta.AlertaRecordatorio && alerta.AlertaRecordatorio.length > 0) {
                    alerta.AlertaRecordatorio.forEach(alertaAnticipada => {
                      let fechaAnt = Utils.getMomentFromAlertDate(alerta.FechaNotificacion);
                      fechaAnt.subtract(alertaAnticipada.UnidadTiempo.EquivalenciaMinutos * alertaAnticipada.ValorTiempo, 'minutes');
                      if (fechaAnt.isAfter(now)) {
                        let notificacionAnticipada = {
                          id: notificacionId,
                          at: fechaAnt.toDate(),
                          text: Utils.stringFormat(this.TEXTO_NOTIFICACION_ANTICIPADA, fechaNotificacionn.format("DD/MM/YYYY HH:mm"), alerta.Titulo),
                          title: this.TITULO_NOTIFICACION_ANTICIPADA,
                          sound: sound
                        };
                        notificaciones.push(notificacionAnticipada);
                        notificacionId++;
                        notificacionesbd.push({
                          query: "INSERT INTO notificacion_anticipada(id_alerta, id_notificacion_local, fecha_notificacion) VALUES(?, ?, ?)",
                          params: [alerta.ID, notificacionAnticipada.id, fechaAnt.format("YYYY-MM-DD HH:mm:ss")]
                        });
                      }
                    });
                  }
                }
              });
            });
          }

          if (notificacionesbd.length > 0) {
            this.database.transaction(sql => {
              //mandar a guardar cada notificacion a bd y al notificar
              notificacionesbd.forEach(nbd => {
                sql.executeSql(nbd.query, nbd.params);
                console.log("SQL: " + nbd.query + " - " + JSON.stringify(nbd.params));
              });
            }).then(() => {
              notificaciones.forEach(n => {
                this.localNotifications.schedule(n);
                console.log("Notificacion: " + JSON.stringify(n));
              });
            }).catch(err => {
              console.log("Error:" + JSON.stringify(err));
              reject("Error al guardar en base de datos las notificaciones")
            });
          }
          resolve();//fin ok
        }).catch(err => {
        console.log("Error: " + JSON.stringify(err));
        reject("Error al consultar la informacion de la api");//fin con error
      });
    });
  }
}
