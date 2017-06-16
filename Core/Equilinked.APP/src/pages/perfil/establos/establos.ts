import { Component, OnInit } from "@angular/core";
import { CommonService } from "../../../services/common.service";
import { NavController, AlertController } from "ionic-angular";
import { UserSessionEntity } from "../../../model/userSession";
import { SecurityService } from "../../../services/security.service";
import { EstablosService } from "../../../services/establos.service";
import { PerfilDatosPage } from "../datos/perfil-datos";
import { AdminEstablosPage } from "./admin-establo/admin-establo";
import { InfoEstabloPage } from "./admin-establo/info-establo";

@Component({
    selector: "listado-establos",
    templateUrl: "./establos.html",
    providers: [CommonService, EstablosService, SecurityService],
    styles: [`
    .color-checks {
        color: #00A7A5 !important;
    }
    `]
})
export class ListadoEstablosPage implements OnInit {

    session: UserSessionEntity;
    selectedTab: string;
    establos: any[];
    establosRespaldo: any[];
    modoEdicion: boolean;

    constructor(
        private alertController: AlertController,
        private commonService: CommonService,
        private establosService: EstablosService,
        private navCtrl: NavController,
        private securityService: SecurityService
    ) {
        this.modoEdicion = false;
        this.selectedTab = "establos";
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.listEstablosByPropietarioId(true); //Listar establos del propietario
    }

    goBack(): void {
        this.navCtrl.pop();
    }

    changeTab(): void {
        if (this.selectedTab === "datos") {
            if (this.navCtrl.getViews().length > 1) {
                this.navCtrl.pop({ animate: false, duration: 0 }).then(() => {
                    this.navCtrl.push(PerfilDatosPage, {}, { animate: false, duration: 0 });
                });
            } else {
                this.navCtrl.push(PerfilDatosPage, {}, { animate: false, duration: 0 });
            }
        }
    }

    listEstablosByPropietarioId(showLoading: boolean): void {
        if (showLoading) {
            this.commonService.showLoading("Procesando..");
        }
        this.establosService.getEstablosByPropietarioId(this.session.PropietarioId)
            .then(establos => {
                this.establos = establos.map(e => {
                    return {
                        seleccion: false,
                        establo: e
                    };
                });
                this.establosRespaldo = this.establos;
                if (showLoading) {
                    this.commonService.hideLoading();
                }
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error obteniendo los establos del propietario");
            });
    }

    filter(evt: any): void {
        this.establos = this.establosService
            .filterEstablosByNombreOrDireccion(evt.target.value, this.establosRespaldo);
    }

    edit(): void {
        this.modoEdicion = true;
    }

    cancelEdit(): void {
        this.establosRespaldo.forEach(e => {
            e.seleccion = false;
        });
        this.modoEdicion = false;
    }

    selectAll(): void {
        let selectAll: boolean = this.getCountSelected() !== this.establosRespaldo.length;
        this.establosRespaldo.forEach(e => {
            e.seleccion = selectAll;
        });
    }

    getCountSelected(): number {
        return this.establosRespaldo.filter(e => e.seleccion).length;
    }

    delete(): void {
        this.alertController.create({
            title: "Alerta!",
            message: "Se eliminarán los establos seleccionados",
            buttons: [
                {
                    text: "Cancelar",
                    role: "cancel"
                },
                {
                    text: "Aceptar",
                    handler: () => {
                        this.commonService.showLoading("Procesando..");
                        this.establosService.deleteEstablosByIds(
                            this.establosRespaldo.filter(e => e.seleccion).map(e => e.establo.ID)
                        ).then(() => {
                            this.listEstablosByPropietarioId(false);//Refrescar los establos!
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

    countEstablosForDelete(): number {
        return this.establosRespaldo.filter(e => e.seleccion).length;
    }

    newEstablo(): void {
        //acceder a la pantalla de creacion
        let params: any = { establosPage: this };
        this.navCtrl.push(AdminEstablosPage, params);
    }

    selectEstablo(establo): void {
        if (this.modoEdicion) {
            establo.seleccion = !establo.seleccion;
        } else {
            this.viewEstablo(establo.establo);
        }
    }

    private viewEstablo(establo: any): void {
        let params: any = {
            establoId: establo.ID,
            establosPage: this
        };
        this.navCtrl.push(InfoEstabloPage, params);
    }
}