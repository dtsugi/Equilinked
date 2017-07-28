import { Component, OnDestroy, OnInit } from "@angular/core";
import { Events, NavController, NavParams } from "ionic-angular";
import { CommonService } from "../../../../../../services/common.service";
import { CaballoService } from "../../../../../../services/caballo.service";
import { EstablosService } from "../../../../../../services/establos.service";
import { SecurityService } from "../../../../../../services/security.service";
import { UserSessionEntity } from "../../../../../../model/userSession";
import { DetalleEstabloPage } from "./detalle-establo/detalle-establo";
import { EdicionEstabloCaballosPage } from "../../../../../perfil/establos/admin-establo/edicion-caballos";
import { AdminEstablosPage } from "../../../../../perfil/establos/admin-establo/admin-establo";
import { CaballosSinUbicacionPage } from "./caballos-sin-ubicacion/caballos-sin-ubicacion";
import { LanguageService } from "../../../../../../services/language.service";

@Component({
    templateUrl: "./ubicaciones.html",
    providers: [LanguageService, CaballoService, CommonService, EstablosService, SecurityService]
})
export class UbicacionesGrupoPage implements OnDestroy, OnInit {

    private REFRESH_LIST_EVENT_NAME: string = "ubicaciones:refresh";
    private session: UserSessionEntity;

    labels: any = {};
    grupo: any;
    ubicaciones: Array<any>;

    constructor(
        private caballoService: CaballoService,
        private commonService: CommonService,
        private events: Events,
        private establosService: EstablosService,
        private navController: NavController,
        private navParams: NavParams,
        private securityService: SecurityService,
        private languageService: LanguageService
    ) {
        this.ubicaciones = new Array<any>();
        languageService.loadLabels().then(labels => this.labels = labels);
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.grupo = this.navParams.get("grupo");
        this.getListUbicaciones(true);
        this.addEvents();
    }

    ngOnDestroy(): void {
        this.removeEvents();
    }

    goBack(): void {
        this.navController.pop();
    }

    selectUbicacion(ubicacion: any): void {
        if (ubicacion.establo.ID) {
            this.view(ubicacion);
        } else {
            this.viewCaballosSinEstablo();
        }
    }

    selectCaballos(ubicacion: any): void {
        if (ubicacion.establo.ID) {
            this.editCaballos(ubicacion);
        } else {
            this.viewCaballosSinEstablo();
        }
    }

    private viewCaballosSinEstablo(): void {
        this.navController.push(CaballosSinUbicacionPage);
    }

    private view(ubicacion: any): void {
        let params: any = {
            establoId: ubicacion.establo.ID,
            grupo: this.grupo
        }
        this.navController.push(DetalleEstabloPage, params);
    }

    private editCaballos(ubicacion: any): void {
        let params: any = {
            establo: JSON.parse(JSON.stringify(ubicacion.establo)),
            grupo: this.grupo,
            eventRefreshList: this.REFRESH_LIST_EVENT_NAME
        };
        this.navController.push(EdicionEstabloCaballosPage, params);
    }

    private getListUbicaciones(loading: boolean): void {
        if (loading)
            this.commonService.showLoading(this.labels["PANT015_ALT_PRO"]);
        let establosPropietario: Array<any>;
        this.establosService.getEstablosByPropietarioId(this.session.PropietarioId)
            .then(establos => {
                establosPropietario = establos;
                return this.caballoService.getAllSerializedByPropietarioId(this.session.PropietarioId).toPromise()
            }).then(caballos => {
                let mapEstablos: Map<number, any> = new Map<number, any>();
                for (let est of establosPropietario) {
                    mapEstablos.set(est.ID, { establo: est, caballos: 0 });
                }
                mapEstablos.set(-1, { establo: { Nombre: this.labels["PANT015_LBL_SINUB"] }, caballos: 0 }); //-1 es el "(+) Agregar ubicacion"

                let ubicacion: any;
                for (let cab of caballos) {
                    ubicacion = mapEstablos.get(cab.Establo_ID != null ? cab.Establo_ID : -1);
                    ubicacion.caballos += 1;
                }

                this.ubicaciones = Array.from(mapEstablos.values()).filter(u => u.caballos > 0);

                if (loading)
                    this.commonService.hideLoading();
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, this.labels["PANT015_MSG_ERRES"]);
            });
    }

    private addEvents(): void {
        this.events.subscribe("grupo-ubicaciones:refresh", () => {
            this.getListUbicaciones(false);
        });
    }

    private removeEvents(): void {
        this.events.unsubscribe("grupo-ubicaciones:refresh");
    }
}