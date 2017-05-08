import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { CommonService } from '../../services/common.service';
import { NotificacionesInsertPage } from './notificaciones-insert';
import { NotificacionesViewPage } from './notificaciones-view';
import { AlertaService } from '../../services/alerta.service';
import { SecurityService } from '../../services/security.service';
import { Alerta, DateObject } from '../../model/alerta';
import { UserSessionEntity } from '../../model/userSession';
import { Utils} from '../../app/utils';

@Component({
    selector: 'page-notificaciones',
    templateUrl: 'notificaciones.html',
    providers: [CommonService, AlertaService, SecurityService]
})
export class NotificacionesPage {

    notificacionList = [];
    currentDate: String = "";
    isTomorrowFilter = false;
    isDeleting: boolean = false;
    isFutureNotifications: boolean = false;
    showFechaNotificacion: boolean = false;
    culture = "es-AR";
    session: UserSessionEntity;

    constructor(public navCtrl: NavController,
        public alertController: AlertController,
        private _commonService: CommonService,
        private _alertaService: AlertaService,
        private _securityService: SecurityService) { }

    ngOnInit() {
        this.isFutureNotifications = false;        
        let dateTimeNow: DateObject = Utils.getDateNow();
        this.session = this._securityService.getInitialConfigSession();
        console.log(this.session);
        this.updateNotificationList(dateTimeNow, false);        
    }

    goInsertNotificacion() {
        this.navCtrl.push(NotificacionesInsertPage);
    }

    goViewNotificacion(notificacion: Alerta) {
        /* Flag para determinar que no se este eliminando al mismo tiempo */
        if (!this.isDeleting) {
            console.log(notificacion);
            this.navCtrl.push(NotificacionesViewPage, { notificacionSelected: notificacion, fecha: this.currentDate });
        }
    }

    goTodayNotifications() {
        this.setFutureNotification(false);
        let dateTimeNow: DateObject = Utils.getDateNow();
        this.updateNotificationList(dateTimeNow, false);
    }

    goFutureNotifications() {
        this.setFutureNotification(true);
        let dateTimeNow: DateObject = Utils.getDateNow();
        dateTimeNow.DAY += 1;
        this.updateNotificationList(dateTimeNow, true);
    }

    updateNotificationList(dateObject: DateObject, filterByFuture: boolean) {
        this.clearNotificationList();
        this.getCurrentFecha(dateObject, this.session.PropietarioId, filterByFuture);
    }

    getCurrentFecha(dateObject: DateObject, idPropietario: number, filterByFuture: boolean) {
        console.log(dateObject);
        this._commonService.showLoading("Procesando..");
        this._alertaService.getCurrentDate(dateObject.YEAR.toString(), dateObject.addZeroDate(dateObject.MONTH), dateObject.addZeroDate(dateObject.DAY), this.culture)
            .subscribe(res => {
                console.log(res);
                /* Indicar que se van a mostrar todas las notificaciones futuras */
                if (this.isFutureNotifications) {
                    this.currentDate = "Desde '" + res + "' en adelante";
                }
                else { this.currentDate = res; }
                this.getAllNotificacionesByPropietarioId(idPropietario, filterByFuture);
            }, error => {
                this._commonService.ShowErrorHttp(error, "Error obteniendo la fecha actual");
            });
    }

    getAllNotificacionesByPropietarioId(idPropietario: number, filterByFuture: boolean) {
        this._alertaService.getAllByPropietario(idPropietario, filterByFuture)
            .subscribe(res => {
                console.log(res);
                this.notificacionList = res;
                this._commonService.hideLoading();
            }, error => {
                this._commonService.ShowErrorHttp(error, "Error obteniendo las notificaciones");
            });
    }

    deleteNotification(notificacion: Alerta) {
        this.isDeleting = true;
        this._commonService.showLoading("Eliminando..");
        let listId = new Array<number>();
        listId.push(notificacion.ID);
        this._alertaService.delete(notificacion.ID)
            .subscribe(res => {
                this._commonService.hideLoading();
                console.log(res);
                let dateTimeNow: DateObject = Utils.getDateNow();
                this.updateNotificationList(dateTimeNow, false);
                this.isDeleting = false;
            }, error => {
                this._commonService.ShowErrorHttp(error, "Error al eliminar la notificacion");
                this.isDeleting = false;
            });
    }

    setFutureNotification(isFutureNotification) {
        this.isFutureNotifications = isFutureNotification;
        this.showFechaNotificacion = isFutureNotification;
    }

    clearNotificationList() {
        this.notificacionList = [];
    }
}
