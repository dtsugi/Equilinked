import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { AlertController, Events, NavController, NavParams } from "ionic-angular";
import { CommonService } from "../../../../../../services/common.service";
import { GruposCaballosService } from "../../../../../../services/grupos-caballos.service";
import { FichaCaballoPage } from "../../../../ficha-caballo/ficha-caballo-home";
import { EdicionCaballosGrupoPage } from "./edicion-caballos/edicion-caballos";

@Component({
    selector: "segment-caballos-grupo",
    templateUrl: "./segment-caballos.html",
    providers: [CommonService, GruposCaballosService]
})
export class SegmentCaballosGrupo implements OnDestroy, OnInit {

    private caballosGrupo: Array<any>;

    @Input("grupo")
    grupo: any;
    @Input("parametros")
    parametrosCaballos: any;

    caballosGrupoRespaldo: Array<any>;

    constructor(
        private alertController: AlertController,
        private commonService: CommonService,
        private events: Events,
        private gruposCaballosService: GruposCaballosService,
        private navController: NavController,
        private navParams: NavParams,
    ) {
        this.caballosGrupo = new Array<any>();
        this.caballosGrupoRespaldo = new Array<any>();
    }

    ngOnDestroy(): void {
        this.unregistredEvents();
    }

    ngOnInit(): void {
        this.getAllCaballosGrupo(true);
        this.registredEvents();
        this.parametrosCaballos.getCountSelected = () => this.getCountSelected();
    }

    filter(evt: any): void {
        this.caballosGrupo = this.gruposCaballosService.filterCaballosByNombreOrGrupo(evt.target.value, this.caballosGrupoRespaldo);
    }

    addCaballos(): void {
        this.navController.push(EdicionCaballosGrupoPage, { grupo: this.grupo });
    }

    select(cg: any): void {
        if (!this.parametrosCaballos.modoEdicion) {
            this.navController.push(FichaCaballoPage, {
                caballoSelected: cg.caballoGrupo.Caballo
            });
        } else {
            cg.seleccion = !cg.seleccion;
        }
    }

    getCountSelected(): number {
        return this.caballosGrupoRespaldo.filter(c => c.seleccion).length;
    }

    selectAll(): void {
        let selectAll: boolean = this.getCountSelected() !== this.caballosGrupoRespaldo.length;
        this.caballosGrupoRespaldo.forEach(n => {
            n.seleccion = selectAll;
        });
    }

    private getAllCaballosGrupo(loading: boolean): void {
        if (loading)
            this.commonService.showLoading("Procesando...");
        this.gruposCaballosService.getCaballosByGroupId(this.grupo.ID)
            .then(caballosGrupo => {
                if (loading)
                    this.commonService.hideLoading();

                this.caballosGrupoRespaldo = caballosGrupo.map(cg => {
                    return {
                        seleccion: false,
                        caballoGrupo: cg
                    };
                });
                this.caballosGrupo = this.caballosGrupoRespaldo;
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error al consultar los caballos");
            });
    }

    private enabledDelete(): void {
        this.caballosGrupoRespaldo.forEach(c => {
            c.seleccion = false;
        });
    }

    private confirmDeleteCaballos(): void {
        this.alertController.create({
            title: "Alerta!",
            message: "Se eliminarán los caballos del grupo",
            buttons: [
                {
                    text: "Cancelar",
                    role: "cancel"
                },
                {
                    text: "Aceptar",
                    handler: () => {
                        this.commonService.showLoading("Procesando..");
                        this.gruposCaballosService.deleteAlertasByIds(
                            this.grupo.ID, this.caballosGrupoRespaldo.filter(c => c.seleccion).map(c => c.caballoGrupo.ID)
                        ).then(() => {
                            this.getAllCaballosGrupo(false);
                            this.events.publish("grupos:refresh");
                            this.commonService.hideLoading();
                            this.parametrosCaballos.modoEdicion = false;
                        }).catch(err => {
                            this.commonService.ShowErrorHttp(err, "Error al eliminar los caballos del grupo");
                        });
                    }
                }
            ]
        }).present();
    }

    private registredEvents(): void {
        this.events.subscribe("caballos-grupo:refresh", () => {
            this.getAllCaballosGrupo(false);
        });
        this.events.subscribe("caballos-grupo:eliminacion:enabled", () => {
            this.enabledDelete();
        });
        this.events.subscribe("caballos-grupo:eliminacion:confirmed", () => {
            this.confirmDeleteCaballos();
        });
    }

    private unregistredEvents(): void {
        this.events.unsubscribe("caballos-grupo:updated");
        this.events.unsubscribe("caballos-grupo:eliminacion:enabled");
        this.events.unsubscribe("caballos-grupo:eliminacion:confirmed");
    }
}