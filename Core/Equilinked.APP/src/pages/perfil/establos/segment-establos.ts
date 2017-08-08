import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { CommonService } from "../../../services/common.service";
import { Events, NavController, AlertController } from "ionic-angular";
import { UserSessionEntity } from "../../../model/userSession";
import { SecurityService } from "../../../services/security.service";
import { EstablosService } from "../../../services/establos.service";
import { AdminEstablosPage } from "./admin-establo/admin-establo";
import { InfoEstabloPage } from "./admin-establo/info-establo";
import { LanguageService } from '../../../services/language.service';

@Component({
    selector: "segment-establos",
    templateUrl: "./segment-establos.html",
    providers: [LanguageService, CommonService, EstablosService, SecurityService],
    styles: [`
    .color-checks {
        color: #00A7A5 !important;
    }
    `]
})
export class SegmentEstablos implements OnDestroy, OnInit {

    private REFRESH_LIST_EVENT_NAME: string = "establos:refresh";

    @Input("parametros")
    parametrosEstablos: any;

    session: UserSessionEntity;
    establos: any[];
    establosRespaldo: any[];
    labels: any = {};

    constructor(
        private events: Events,
        private alertController: AlertController,
        private commonService: CommonService,
        private establosService: EstablosService,
        private navCtrl: NavController,
        private securityService: SecurityService,
        private languageService: LanguageService
    ) {
        languageService.loadLabels().then(labels => this.labels = labels);
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.listEstablosByPropietarioId(false); //Listar establos del propietario
        this.addEvents();
        this.parametrosEstablos.getCountSelected = () => this.getCountSelected();
    }

    ngOnDestroy(): void {
        this.removeEvents();
    }

    goBack(): void {
        this.navCtrl.pop();
    }

    listEstablosByPropietarioId(showLoading: boolean): void {
        if (showLoading) {
            this.commonService.showLoading(this.labels["PANT026_ALT_PRO"]);
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
                this.commonService.ShowErrorHttp(err, this.labels["PANT026_MSG_ERRES"]);
            });
    }

    filter(evt: any): void {
        this.establos = this.establosService
            .filterEstablosByNombreOrDireccion(evt.target.value, this.establosRespaldo);
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

    newEstablo(): void {
        let params: any = {
            showConfirmSave: false,
            eventRefreshList: this.REFRESH_LIST_EVENT_NAME
        };
        this.navCtrl.push(AdminEstablosPage, params);
    }

    selectEstablo(establo): void {
        if (this.parametrosEstablos.modoEdicion) {
            establo.seleccion = !establo.seleccion;
        } else {
            this.viewEstablo(establo.establo);
        }
    }

    private enabledDelete(): void {
        this.establosRespaldo.forEach(c => {
            c.seleccion = false;
        });
    }

    private confirmDeleteEstablos(): void {
        this.alertController.create({
            title: this.labels["PANT026_ALT_TIELI"],
            message: this.labels["PANT026_ALT_MSGEL"],
            buttons: [
                {
                    text: this.labels["PANT026_BTN_CAN"],
                    role: "cancel"
                },
                {
                    text: this.labels["PANT026_BTN_ACE"],
                    handler: () => {
                        this.commonService.showLoading(this.labels["PANT026_ALT_PRO"]);
                        this.establosService.deleteEstablosByIds(
                            this.establosRespaldo.filter(e => e.seleccion).map(e => e.establo.ID)
                        ).then(() => {
                            this.listEstablosByPropietarioId(false);//Refrescar los establos!
                            this.commonService.hideLoading();
                            this.parametrosEstablos.modoEdicion = false;
                        }).catch(err => {
                            this.commonService.ShowErrorHttp(err, this.labels["PANT026_MSG_ERRELI"]);
                        });
                    }
                }
            ]
        }).present();
    }

    private viewEstablo(establo: any): void {
        let params: any = {
            establoId: establo.ID
        };
        this.navCtrl.push(InfoEstabloPage, params);
    }

    private addEvents(): void {
        this.events.subscribe("establos:refresh", () => {
            this.listEstablosByPropietarioId(false);
        });
        this.events.subscribe("establos:eliminacion:enabled", () => {
            this.enabledDelete();
        });
        this.events.subscribe("establos:eliminacion:confirmed", () => {
            this.confirmDeleteEstablos();
        });
    }

    private removeEvents(): void {
        this.events.unsubscribe("establos:refresh");
        this.events.unsubscribe("establos:eliminacion:enabled");
        this.events.unsubscribe("establos:eliminacion:confirmed");
    }


}