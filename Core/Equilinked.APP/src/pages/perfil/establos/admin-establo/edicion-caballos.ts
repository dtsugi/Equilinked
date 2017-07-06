import { Component, OnInit } from "@angular/core";
import { Events, NavController, NavParams, ToastController } from "ionic-angular";
import { FichaCaballoPage } from "../../../home/ficha-caballo/ficha-caballo-home";
import { CaballoService } from "../../../../services/caballo.service";
import { CommonService } from "../../../../services/common.service";
import { EstablosService } from "../../../../services/establos.service";

@Component({
    templateUrl: "./edicion-caballos.html",
    providers: [CaballoService, CommonService, EstablosService]
})
export class EdicionEstabloCaballosPage implements OnInit {

    private establoCaballosRespaldo: Array<any>;
    private establoCaballosEdicionResp: Array<any>;
    private eventList: string;
    private eventItem: string;

    establoCabllos: Array<any>;
    establoCaballosEdicion: Array<any>;

    establo: any;
    grupo: any;
    modoEdicion: boolean; 

    constructor(
        private caballoService: CaballoService,
        private commonService: CommonService,
        private establosService: EstablosService,
        private events: Events,
        private navController: NavController,
        private navParams: NavParams
    ) {
        this.modoEdicion = false;
        this.establoCabllos = new Array<any>();
    }

    ngOnInit(): void {
        this.establo = this.navParams.get("establo");
        this.grupo = this.navParams.get("grupo");
        this.eventList = this.navParams.get("eventRefreshList");
        this.eventItem = this.navParams.get("eventRefreshItem");

        this.listCaballosByEstabloId(true); //Listamos los caballos del establo
    }

    goBack(): void {
        this.navController.pop();
    }

    edit(): void {
        this.modoEdicion = true;
        this.listCaballosByPropietario(); //Listamos los caballos disponibles
    }

    viewDetail(caballo: any): void {
        this.navController.push(FichaCaballoPage, {
            caballoSelected: caballo
        });
    }

    selectAll(): void {
        let countSeleted = this.establoCaballosEdicion.filter(ec => ec.seleccion).length;
        let selectAll: boolean = countSeleted !== this.establoCaballosEdicionResp.length;
        this.establoCaballosEdicionResp.forEach(ec => {
            ec.seleccion = selectAll
        })
    }

    filterCaballos(evt: any): void {
        this.establoCabllos = this.establosService.filterEstabloCaballosByNombre(
            evt.target.value, this.establoCaballosRespaldo
        );
    }

    filterCaballosForEdition(evt: any): void {
        this.establoCaballosEdicion = this.establosService.filterEstabloCaballosForEdition(
            evt.target.value, this.establoCaballosEdicionResp
        );
    }

    save(): void {
        this.establo.Caballo = this.establoCaballosEdicionResp
            .filter(ec => ec.seleccion)
            .map(ec => ec.caballo);

        this.commonService.showLoading("Procesando...");
        this.establosService.updateEstablo(this.establo)
            .then(() => {
                if (this.eventItem) {
                    this.events.publish(this.eventItem); //Refresco el detalle o ubicacion 
                }
                if (this.eventList) {
                    this.events.publish(this.eventList); //Refrescar la lista de ubicaciones
                }
                this.listCaballosByEstabloId(false); //Refresco la lista actual
                this.modoEdicion = false;
                this.commonService.hideLoading();
            }).catch(err => {
                console.error(err);
                this.commonService.ShowErrorHttp(err, "Error al actualizar los caballos seleccionados para el establo");
            });
    }

    private listCaballosByPropietario(): void {
        let mapEstabloCaballos: Map<number, any> = new Map<number, any>();
        this.establoCaballosRespaldo.forEach(ec => {
            mapEstabloCaballos.set(ec.ID, ec);
        });

        this.commonService.showLoading("Procesando...");
        this.establosService.getCaballosByEstablo(this.establo.ID, 1)
            .then(caballos => {
                this.commonService.hideLoading();
                this.establoCaballosEdicion = caballos.map(c => {
                    return {
                        seleccion: mapEstabloCaballos.has(c.ID),
                        caballo: mapEstabloCaballos.has(c.ID) ?
                            mapEstabloCaballos.get(c.ID) : c
                    };
                });
                this.establoCaballosEdicionResp = this.establoCaballosEdicion;
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error obteniendo los caballos del propietario");
                console.error(err);
            });
    }

    private listCaballosByEstabloId(showLoading: boolean): void {
        if (showLoading)
            this.commonService.showLoading("Procesando...");
        this.establosService.getCaballosByEstablo(this.establo.ID, 2)
            .then(establoCaballos => {
                this.establoCabllos = establoCaballos;
                this.establoCaballosRespaldo = establoCaballos;

                if (showLoading)
                    this.commonService.hideLoading();
            }).catch(err => {
                console.error(err);
                this.commonService.ShowErrorHttp(err, "Error obteniendo los caballos del establo");
            });
    }
}