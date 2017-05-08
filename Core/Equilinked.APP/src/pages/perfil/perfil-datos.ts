import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams, PopoverController} from 'ionic-angular';
import {Utils} from '../../app/utils'
import { CommonService } from '../../services/common.service';
import { SecurityService } from '../../services/security.service';
import { PropietarioService} from '../../services/propietario.service';
import { UserSessionEntity} from '../../model/userSession';
import { Propietario} from '../../model/propietario';
import {PopoverDatosPage} from './pop-over/pop-over-datos';

@Component({
    templateUrl: 'perfil-datos.html',
    providers: [CommonService, SecurityService, PropietarioService]
})
export class PerfilDatosPage {
    form: any;
    session: UserSessionEntity;
    propietarioEntity: Propietario;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public popoverCtrl: PopoverController,
        private _commonService: CommonService,
        private _securityService: SecurityService,
        private _propietarioService: PropietarioService,
        private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.propietarioEntity = new Propietario();
        this.session = this._securityService.getInitialConfigSession();
        this.getPerfilPropietarioId(this.session.PropietarioId);
    }

    getPerfilPropietarioId(idPropietario: number) {
        this._commonService.showLoading("Procesando..");
        this._propietarioService.getSerializedById(idPropietario)
            .subscribe(res => {
                console.log(res);
                this.propietarioEntity = res;
                this._commonService.hideLoading();
            }, error => {
                this._commonService.ShowErrorHttp(error, "Error obteniendo el perfil del usuario");
            });
    }

    presentPopover(ev) {
        // let popover = this.popoverCtrl.create((PopoverDatosPage, {
        //     alertaEntity: this.alertaEntity
        // });
        let popover = this.popoverCtrl.create(PopoverDatosPage, {});
        popover.present({
            ev: ev
        });
    }
}