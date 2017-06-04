import { Component, OnInit } from "@angular/core";
import { CommonService } from "../../../services/common.service";
import { NavController } from "ionic-angular";
import { UserSessionEntity } from "../../../model/userSession";
import { SecurityService } from "../../../services/security.service";
import { EstablosService } from "../../../services/establos.service";
import { PerfilDatosPage } from "../datos/perfil-datos";
import { AdminEstablosPage } from "./admin-establo/admin-establo";
import { InfoEstabloPage } from "./admin-establo/info-establo";

@Component({
    selector: "listado-establos",
    templateUrl: "./establos.html",
    providers: [CommonService, EstablosService, SecurityService]
})
export class ListadoEstablosPage implements OnInit {

    session: UserSessionEntity;
    selectedTab: string;
    establos: any[];
    establosRespaldo: any[];

    constructor(
        private commonService: CommonService,
        private establosService: EstablosService,
        private navCtrl: NavController,
        private securityService: SecurityService
    ) {
        this.selectedTab = "establos";
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.listEstablosByPropietarioId(); //Listar establos del propietario
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

    listEstablosByPropietarioId(): void {
        this.commonService.showLoading("Procesando..");
        this.establosService.getEstablosByPropietarioId(this.session.PropietarioId)
            .then(establos => {
                this.establos = establos;
                this.establosRespaldo = establos;
                this.commonService.hideLoading();
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error obteniendo los establos del propietario");
            });
    }

    filter(evt: any): void {
        this.establos = this.establosService
            .filterEstablosByNombreOrDireccion(evt.target.value, this.establosRespaldo);
    }

    newEstablo(): void {
        //acceder a la pantalla de creacion
        let params: any = { establosPage: this };
        this.navCtrl.push(AdminEstablosPage, params);
    }

    viewEstablo(establo: any): void {
        console.info(establo);
        let params: any = { establo: establo };
        this.navCtrl.push(InfoEstabloPage, params);
    }
}