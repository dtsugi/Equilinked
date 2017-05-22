import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams} from 'ionic-angular';
import {Utils} from '../../../app/utils'
import { CommonService } from '../../../services/common.service';
import { SecurityService} from '../../../services/security.service';
import { CaballoService } from '../../../services/caballo.service';
import { ExtendedCaballoService } from '../../../services/extended.caballo.service';
import { Caballo } from '../../../model/caballo';
import { UserSessionEntity } from '../../../model/userSession';


@Component({
    templateUrl: 'admin-caballos-insert.html',
    providers: [CommonService, SecurityService, CaballoService, ExtendedCaballoService]
})
export class AdminCaballosInsertPage {
    form: any;
    caballoEntity: Caballo;
    generoList = [];
    pelajeList = [];
    session: UserSessionEntity;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private _commonService: CommonService,
        private _securityService: SecurityService,
        private _caballoService: CaballoService,
        private _extendedCaballoService: ExtendedCaballoService,
        private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.session = this._securityService.getInitialConfigSession();
        this.caballoEntity = new Caballo();
        this.caballoEntity.Propietario_ID = this.session.PropietarioId;
        if (this._commonService.IsValidParams(this.navParams, ["callbackController"])) {
            this.getPelajeList();
            this.getGeneroList();
        }
        this.initForm();
    }

    initForm() {
        console.log("CABALLO:", this.caballoEntity);
        this.form = this.formBuilder.group({
            ID: [this.caballoEntity.ID],
            Nombre: [this.caballoEntity.Nombre, Validators.required],
            FechaNacimiento: [this.caballoEntity.FechaNacimiento],
            NumeroChip: [this.caballoEntity.NumeroChip],
            NumeroFEI: [this.caballoEntity.NumeroFEI],
            EstadoFEI: [this.caballoEntity.EstadoFEI],
            Protector: [this.caballoEntity.Protector],
            Embocadura: [this.caballoEntity.Embocadura],
            ExtrasDeCabezada: [this.caballoEntity.ExtrasDeCabezada],
            ADN: [this.caballoEntity.ADN],
            NumeroFEN: [this.caballoEntity.NumeroFEN],
            EstadoFEN: [this.caballoEntity.EstadoFEN],
            Criador_ID: [this.caballoEntity.Criador_ID],
            Establecimiento_ID: [this.caballoEntity.Establecimiento_ID],
            EstadoProvincia_Id: [this.caballoEntity.EstadoProvincia_Id],
            Genero_ID: [this.caballoEntity.Genero_ID, Validators.required],
            Grupo_ID: [this.caballoEntity.Grupo_ID],
            OtrasMarcas_ID: [this.caballoEntity.OtrasMarcas_ID],
            Pedigree_ID: [this.caballoEntity.Pedigree_ID],
            Pelaje_ID: [this.caballoEntity.Pelaje_ID, Validators.required],
            PersonaACargo_ID: [this.caballoEntity.PersonaACargo_ID],
            Propietario_ID: [this.caballoEntity.Propietario_ID]
        });
    }

    getGeneroList() {
        this._extendedCaballoService.getAllGeneroComboBox()
            .subscribe(res => {
                console.log(res);
                this.generoList = res;
                this.reloadForm();
            }, error => {
                console.log(error);
                this._commonService.ShowErrorHttp(error, "Error cargando los generos del caballo");
            });
    }

    getPelajeList() {
        this._extendedCaballoService.getAllPelajeComboBox()
            .subscribe(res => {
                console.log(res);
                this.pelajeList = res;
                this.reloadForm();
            }, error => {
                console.log(error);
                this._commonService.ShowErrorHttp(error, "Error cargando los generos del caballo");
            });
    }

    save() {
        this._commonService.showLoading("Guardando..");
        console.log(this.form.value);
        this._caballoService.save(this.form.value)
            .subscribe(res => {
                console.log(res);
                this._commonService.hideLoading();
                this._commonService.ShowInfo("El caballo se guardo exitosamente");
                this.updateCallbackController();
                this.navCtrl.pop();
            }, error => {
                console.log(error);
                this._commonService.hideLoading();
                this._commonService.ShowInfo("Error al guardar el caballo");
            });
    }

    reloadForm() {
        this.initForm();
    }

    updateCallbackController() {
        let callbackController = this.navParams.get("callbackController");
        callbackController.reloadController();
    }
}