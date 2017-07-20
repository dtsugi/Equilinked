import { Component, OnInit, OnDestroy } from "@angular/core";
import { AlertController, Events, NavController, NavParams } from "ionic-angular";
import { AlertaGrupoService } from "../../../../../../services/alerta-grupo.service";
import { CommonService } from "../../../../../../services/common.service";
import { SecurityService } from "../../../../../../services/security.service";
import { EdicionNotaPage } from "./edicion-nota/edicion-nota";
import { DetalleNotaPage } from "./detalle-nota/detalle-nota";
import { UserSessionEntity } from "../../../../../../model/userSession";
import { ConstantsConfig } from "../../../../../../app/utils"
import moment from "moment";

@Component({
    templateUrl: "./notas-ficha.html",
    providers: [AlertaGrupoService, CommonService, SecurityService]
})
export class NotasFichaPage implements OnInit, OnDestroy {

    private grupo: any;
    private tipoAlerta: number;
    private session: UserSessionEntity;
    private notasRespaldo: Array<any>;

    notas: Array<any>;
    modoEdicion: boolean;

    constructor(
        private alertController: AlertController,
        private alertaGrupoService: AlertaGrupoService,
        private commonService: CommonService,
        private events: Events,
        private navController: NavController,
        private navParams: NavParams,
        private securityService: SecurityService
    ) {
        this.grupo = {};
        this.notas = new Array<any>();
        this.notasRespaldo = new Array<any>();
        this.modoEdicion = false; //para activar la eliminacion
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.grupo = this.navParams.get("grupo");
        this.tipoAlerta = this.navParams.get("tipoAlerta");

        this.getNotasByGrupo(true); //listar las notas!
        this.addEvents();
    }

    ngOnDestroy(): void {
        this.removeEvents();
    }

    goBack(): void {
        this.navController.pop();
    }

    filter(evt: any): void {
        this.notas = this.alertaGrupoService.filterNota(evt.target.value, this.notasRespaldo);
    }

    create(): void {
        let alertaGrupo: any = { //Ya cremos la alerta!
            Grupo_ID: this.grupo.ID,
            Alerta: {
                Tipo: this.tipoAlerta,
                AlertaCaballo: [],
                Propietario_ID: this.session.PropietarioId
            }
        };

        let params: any = {
            grupoId: this.grupo.ID,
            tipoAlerta: this.tipoAlerta,
            alertaGrupo: alertaGrupo
        };
        this.navController.push(EdicionNotaPage, params);
    }

    select(n: any): void {
        if (this.modoEdicion) {
            n.seleccion = !n.seleccion;
        } else {
            this.view(n.nota);
        }
    }

    activeDelete(): void {
        this.notasRespaldo.forEach(n => {
            n.seleccion = false;
        });
        this.modoEdicion = true;
    }

    selectAll(): void {
        let selectAll: boolean = this.getCountSelected() !== this.notasRespaldo.length;
        this.notasRespaldo.forEach(n => {
            n.seleccion = selectAll;
        });
    }

    getCountSelected(): number {
        return this.notasRespaldo.filter(n => n.seleccion).length;
    }

    confirmDelete(): void {
        this.alertController.create({
            title: "Alerta!",
            message: "Se eliminarán las notas seleccionadas",
            buttons: [
                {
                    text: "Cancelar",
                    role: "cancel"
                },
                {
                    text: "Aceptar",
                    handler: () => {
                        this.commonService.showLoading("Procesando..");
                        this.alertaGrupoService.deleteAlertasByIds(
                            this.grupo.ID, this.notasRespaldo.filter(e => e.seleccion).map(e => e.nota.ID)
                        ).then(() => {
                            this.getNotasByGrupo(false);//Refrescar los establos!
                            this.commonService.hideLoading();
                            this.modoEdicion = false;
                        }).catch(err => {
                            this.commonService.ShowErrorHttp(err, "Error al eliminar los establos");
                        });
                    }
                }
            ]
        }).present();
    }

    private view(nota: any): void {
        let params: any = { grupoId: this.grupo.ID, alertaGrupoId: nota.ID };
        this.navController.push(DetalleNotaPage, params);
    }

    private getNotasByGrupo(showLoading: boolean): void {
        if (showLoading)
            this.commonService.showLoading("Procesando...");

        this.alertaGrupoService.getAlertasByGrupo(this.grupo.ID, this.tipoAlerta, ConstantsConfig.ALERTA_FILTER_ALL)
            .then(notas => {
                if (showLoading)
                    this.commonService.hideLoading();

                this.notasRespaldo = notas.map(nota => {
                    nota.Fecha = moment(nota.Alerta.FechaNotificacion).format("DD/MM/YYYY");
                    return { seleccion: false, nota: nota };
                });
                this.notas = this.notasRespaldo;
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error al consultar el grupo");
            });
    }

    private addEvents(): void {
        this.events.subscribe("notas:refresh", () => {
            this.getNotasByGrupo(false);
        });
    }

    private removeEvents(): void {
        this.events.unsubscribe("notas:refresh");
    }
}