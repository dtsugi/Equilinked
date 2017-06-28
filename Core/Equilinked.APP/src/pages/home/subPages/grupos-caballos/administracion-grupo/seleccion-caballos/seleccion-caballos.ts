import { Component, OnInit } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { AlertaGrupoService } from "../../../../../../services/alerta-grupo.service";
import { GruposCaballosService } from "../../../../../../services/grupos-caballos.service";
import { CommonService } from "../../../../../../services/common.service";

@Component({
    templateUrl: "./seleccion-caballos.html",
    providers: [AlertaGrupoService, CommonService, GruposCaballosService]
})
export class SeleccionCaballosPage implements OnInit {

    private grupoId: any;
    private alertaGrupo: any;

    caballos: Array<any>;
    private caballosRespaldo: Array<any>;

    constructor(
        private alertaGrupoService: AlertaGrupoService,
        private commonService: CommonService,
        private gruposCaballosService: GruposCaballosService,
        private navController: NavController,
        private navParams: NavParams
    ) {
        this.caballos = new Array<any>();
    }

    ngOnInit(): void {
        this.grupoId = this.navParams.get("grupoId");
        this.alertaGrupo = this.navParams.get("alertaGrupo");

        this.getAllCaballosByGrupo();//Listar caballos
    }

    filter(evt: any): void {
        this.caballos = this.alertaGrupoService.filterCaballo(evt.target.value, this.caballosRespaldo);
    }

    goBack(): void {
        this.alertaGrupo.Alerta.AlertaCaballo = this.caballosRespaldo
            .filter(c => c.seleccion)
            .map(c => c.alertaCaballo);
        this.alertaGrupo.AllCaballos = this.alertaGrupo.Alerta.AlertaCaballo.length == this.caballosRespaldo.length;

        this.navController.pop();
    }

    private getAllCaballosByGrupo(): void {
        let mapCaballos: Map<number, any> = new Map<number, any>();
        this.alertaGrupo.Alerta.AlertaCaballo.forEach(alertaCaballo => {
            mapCaballos.set(alertaCaballo.Caballo_ID, alertaCaballo);
        });

        this.commonService.showLoading("Procesando...");
        this.gruposCaballosService.getCaballosByGroupId(this.grupoId)
            .then(caballosGrupo => {
                console.info(caballosGrupo);
                this.caballosRespaldo = caballosGrupo.map(cg => {
                    return {
                        seleccion: mapCaballos.has(cg.Caballo_ID),
                        caballo: cg.Caballo,
                        alertaCaballo: mapCaballos.has(cg.Caballo_ID) ?
                            mapCaballos.get(cg.Caballo_ID) : { Caballo_ID: cg.Caballo_ID }
                    };
                });
                this.caballos = this.caballosRespaldo;
                this.commonService.hideLoading();
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error al listar caballos del grupo");
            });
    }

    /*
    private getAlertasByGrupo(showLoading: boolean): void {
        if (showLoading)
            this.commonService.showLoading("Procesando...");

        this.alertaGrupoService.getAlertasByGrupo(this.grupoId, this.tipoAlerta, ConstantsConfig.ALERTA_FILTER_NEXT)
            .then(alertas => { //Primero las proximas!
                this.proximasAlertas = alertas.map(a => {
                    a.Fecha = moment(a.Alerta.FechaNotificacion).format("D [de] MMMM [de] YYYY");
                    a.Hora = moment(a.Alerta.HoraNotificacion, "HH:mm").format("hh:mm a");
                    //debugger;
                    return a;
                });
                return this.alertaGrupoService.getAlertasByGrupo(this.grupoId, this.tipoAlerta, ConstantsConfig.ALERTA_FILTER_HISTORY);
            }).then(alertas => {
                this.historicoAlertas = alertas.map(a => {
                    a.Fecha = moment(a.Alerta.FechaNotificacion).format("DD/MM/YY");
                    return a;
                });
                if (showLoading)
                    this.commonService.hideLoading();
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error al consultar el grupo");
            });
    }*/

}