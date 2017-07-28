import { Component, OnInit } from "@angular/core";
import { Events, NavController, NavParams } from "ionic-angular";
import { CaballoService } from "../../../../../../../services/caballo.service";
import { CommonService } from "../../../../../../../services/common.service";
import { GruposCaballosService } from "../../../../../../../services/grupos-caballos.service";
import { SecurityService } from "../../../../../../../services/security.service";
import { UserSessionEntity } from "../../../../../../../model/userSession";

@Component({
    templateUrl: "./edicion-caballos.html",
    providers: [CaballoService, CommonService, GruposCaballosService, SecurityService]
})
export class EdicionCaballosGrupoPage implements OnInit {

    private grupo: any;
    private session: UserSessionEntity;
    private caballosGrupoRespaldo: Array<any>;

    caballosGrupo: Array<any>;

    constructor(
        private caballoService: CaballoService,
        private commonService: CommonService,
        private events: Events,
        private gruposCaballosService: GruposCaballosService,
        private navController: NavController,
        private navParams: NavParams,
        private securityService: SecurityService
    ) {
        this.caballosGrupoRespaldo = new Array<any>();
        this.caballosGrupo = new Array<any>();
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.grupo = this.navParams.get("grupo");
        console.info("El grupo:");
        console.info(this.grupo);
        this.getCaballosForGrupo();
    }

    goBack(): void {
        this.navController.pop();
    }

    filter(evt: any): void {
        this.caballosGrupo = this.gruposCaballosService.filterCaballo(evt.target.value, this.caballosGrupoRespaldo);
    }

    selectAll(): void {
        let countSeleted = this.caballosGrupoRespaldo.filter(ec => ec.seleccion).length;
        let selectAll: boolean = countSeleted !== this.caballosGrupoRespaldo.length;
        this.caballosGrupoRespaldo.forEach(cg => {
            cg.seleccion = selectAll
        })
    }

    save(): void {
        this.grupo.GrupoCaballo = this.caballosGrupoRespaldo
            .filter(cg => cg.seleccion)
            .map(cg => cg.grupoCaballo);

        this.commonService.showLoading("Procesando...");
        this.gruposCaballosService.updateGrupo(this.grupo)
            .then(() => {
                this.events.publish("caballos-grupo:refresh");//Refresco las asignaciones de caballos
                this.events.publish("grupo:refresh"); //Refresco los detalles del grupo
                this.events.publish("grupos:refresh"); //Refresco la lista de grupos
                this.commonService.hideLoading();
                this.navController.pop();
            }).catch(err => {
                console.error(err);
                this.commonService.ShowErrorHttp(err, "Error al actualizar los caballos seleccionados para el establo");
            });
    }

    private getCaballosForGrupo(): void {
        let mapCaballosGrupo: Map<number, any> = new Map<number, any>();

        this.commonService.showLoading("Procesando...");
        this.caballoService.getAllSerializedByPropietarioId(this.session.PropietarioId).toPromise()
            .then(caballos => {
                this.grupo.GrupoCaballo.forEach(cg => {
                    mapCaballosGrupo.set(cg.Caballo_ID, cg);
                });
                this.caballosGrupoRespaldo = caballos.map(c => {
                    return {
                        caballo: c,
                        seleccion: mapCaballosGrupo.has(c.ID),
                        grupoCaballo: mapCaballosGrupo.has(c.ID) ?
                            mapCaballosGrupo.get(c.ID) : { Caballo_ID: c.ID }
                    }
                });
                this.caballosGrupo = this.caballosGrupoRespaldo;

                this.commonService.hideLoading();
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error al consultar los caballos del grupo");
            });
    }
}