import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Events, NavController, NavParams, PopoverController } from 'ionic-angular';
import { CommonService } from '../../../services/common.service';
import { SecurityService } from '../../../services/security.service';
import { PropietarioService } from '../../../services/propietario.service';
import { UserSessionEntity } from '../../../model/userSession';
import { Propietario } from '../../../model/propietario';
import { PopoverDatosPage } from './pop-over/pop-over-datos';
import { ListadoEstablosPage } from "../establos/establos";

@Component({
    selector: "perfil-datos",
    templateUrl: 'perfil-datos.html',
    providers: [CommonService, SecurityService, PropietarioService]
})
export class PerfilDatosPage {
    form: any;
    session: UserSessionEntity;
    propietarioEntity: Propietario;
    selectedTab: string;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public events: Events,
        public popoverCtrl: PopoverController,
        private _commonService: CommonService,
        private _securityService: SecurityService,
        private _propietarioService: PropietarioService,
        private formBuilder: FormBuilder) {
        this.selectedTab = "datos";
    }

    ngOnInit() {
        this.propietarioEntity = new Propietario();
        this.session = this._securityService.getInitialConfigSession();
        this.getPerfilPropietarioId(this.session.PropietarioId, true);
        this.registerEvents();
    }

    changeTab(): void {
        console.log(this.selectedTab);
        if (this.selectedTab === "establos") {
            if (this.navCtrl.getViews().length > 1) {
                this.navCtrl.pop({ animate: false, duration: 0 }).then(() => {
                    this.navCtrl.push(ListadoEstablosPage, {}, { animate: false, duration: 0 });
                });
            } else {
                this.navCtrl.push(ListadoEstablosPage, {}, { animate: false, duration: 0 });
            }
        }
    }

    getPerfilPropietarioId(idPropietario: number, showLoading: boolean) {
        if (showLoading)
            this._commonService.showLoading("Procesando..");
        this._propietarioService.getSerializedById(idPropietario)
            .subscribe(res => {
                console.log(res);
                this.propietarioEntity = res;
                if (showLoading)
                    this._commonService.hideLoading();
            }, error => {
                this._commonService.ShowErrorHttp(error, "Error obteniendo el perfil del usuario");
            });
    }

    presentPopover(ev) {
        let popover = this.popoverCtrl.create(PopoverDatosPage, {
            navController: this.navCtrl,
            perfilDatosPage: this
        });
        popover.present({
            ev: ev
        });
    }

    private registerEvents(): void {
        this.events.subscribe("perfil:updated", () => {
            console.info("Te mandé a traer de la edición!");
            this.getPerfilPropietarioId(this.session.PropietarioId, false);
        });
    }
}