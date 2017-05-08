import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { CommonService } from '../../services/common.service';
import { AlertaService } from '../../services/alerta.service';
import { CaballoService } from '../../services/caballo.service';
import { Alerta } from '../../model/alerta';
import { Caballo } from '../../model/caballo';
import { NotificacionesPage } from './notificaciones';
// import { PopoverNotificacionesViewPage } from './pop-over/pop-over-view-notificacion';

@Component({
    templateUrl: 'notificaciones-view.html',
    providers: [CommonService, AlertaService, CaballoService]
})

export class NotificacionesViewPage {
    alertaEntity: Alerta;
    fecha: string;
    caballoEntity: Caballo = new Caballo();
    grupoDescripcion: string = "";

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public popoverCtrl: PopoverController,
        private _commonService: CommonService,
        private _alertaService: AlertaService,
        private _caballoService: CaballoService) {
    }

    // ionViewDidLoad() { console.log("ionViewDidLoad"); }
    // ionViewWillEnter() { console.log("ionViewWillEnter"); }
    // ionViewDidEnter() {
    //     console.log("ionViewDidEnter");
    // }
    // ionViewWillLeave() { console.log("ionViewWillLeave"); }
    // ionViewWillUnload() { console.log("ionViewWillUnload"); }
    // ionViewCanEnter() { console.log("ionViewCanEnter"); }
    // ionViewCanLeave() { console.log("ionViewCanLeave"); }

    ngOnInit() {
        console.log("ngOnInit");
        this.alertaEntity = this.navParams.get("notificacionSelected");
        // let fechaNotificacion = this.navParams.get("fecha");
        this.getCaballoInfo(this.alertaEntity.CaballoId, this.alertaEntity.FechaNotificacion);
    }

    getCaballoInfo(caballoId: number, fechaNotificacion: string) {
        // this._caballosService.getById(caballoId.toString())
        //     .subscribe(res => {
        //         this._commonService.showLoading("Procesando..");
        //         console.log(res);
        //         this.caballoEntity = res;
        //         this.grupoDescripcion = this.getDescGrupoCaballo(this.caballoEntity);
        //         this.getCurrentDate(fechaNotificacion);
        //     }, error => {
        //         this._commonService.ShowErrorHttp(error, "Error al obtener la informacion del caballo");
        //     });

        // this.caballoEntity = this.alertaEntity.Caballo;
        // this._commonService.showLoading("Procesando..");
        // this.grupoDescripcion = this.getDescGrupoCaballo(this.caballoEntity);
        // this.getCurrentDate(fechaNotificacion);
    }

    getCurrentDate(fecha: string) {
        this._alertaService.getCurrentDateString(fecha, null)
            .subscribe(res => {
                console.log(res);
                this.fecha = res;
                this._commonService.hideLoading();
            }, error => {
                this._commonService.ShowErrorHttp(error, "Error al obtener la fecha de la notificacion");
            });
    }

    // OBTENER NOMBRE DEL GRUPO DE CABALLO, SI LO POSEE
    getDescGrupoCaballo(caballo: Caballo): string {
        if (caballo.Grupo != null)
            return caballo.Grupo.Descripcion;
        else
            return "";
        // return "Grupo del caballo";
    }

    presentPopover(ev) {
        // let popover = this.popoverCtrl.create(PopoverNotificacionesViewPage, {
        //     alertaEntity: this.alertaEntity
        // });
        // popover.present({
        //     ev: ev
        // });
    }



}

