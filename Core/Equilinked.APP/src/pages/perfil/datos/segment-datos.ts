import { Component, OnInit, OnDestroy } from "@angular/core";
import { Events, NavController, NavParams } from "ionic-angular";
import { CommonService } from "../../../services/common.service";
import { SecurityService } from "../../../services/security.service";
import { PropietarioService } from "../../../services/propietario.service";
import { UserSessionEntity } from "../../../model/userSession";
import { Propietario } from "../../../model/propietario";
import { ListadoEstablosPage } from "../establos/establos";

@Component({
    selector: "segment-datos",
    templateUrl: "segment-datos.html",
    providers: [CommonService, SecurityService, PropietarioService]
})
export class SegmentDatos implements OnInit, OnDestroy {

    session: UserSessionEntity;
    propietarioEntity: Propietario;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public events: Events,
        private commonService: CommonService,
        private securityService: SecurityService,
        private propietarioService: PropietarioService
    ) {
    }

    ngOnInit() {
        this.propietarioEntity = new Propietario();
        this.session = this.securityService.getInitialConfigSession();
        this.getPerfilPropietarioId(this.session.PropietarioId, true);
        this.registerEvents();
    }

    ngOnDestroy(): void {
        this.unregistredEvents();
    }

    getPerfilPropietarioId(idPropietario: number, showLoading: boolean) {
        if (showLoading)
            this.commonService.showLoading("Procesando..");

        this.propietarioService.getSerializedById(idPropietario)
            .subscribe(res => {
                this.propietarioEntity = res;

                if (showLoading)
                    this.commonService.hideLoading();
            }, error => {
                this.commonService.ShowErrorHttp(error, "Error obteniendo el perfil del usuario");
            });
    }

    private registerEvents(): void {
        this.events.subscribe("perfil:refresh", () => {
            this.getPerfilPropietarioId(this.session.PropietarioId, false);
        });
    }

    private unregistredEvents(): void {
        this.events.unsubscribe("perfil:refresh");
    }
}