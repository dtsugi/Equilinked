import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams} from 'ionic-angular';
import {Utils} from '../../../../app/utils'
import { CommonService } from '../../../../services/common.service';
import { SecurityService} from '../../../../services/security.service';
import { CaballoService } from '../../../../services/caballo.service';
import { ExtendedCaballoService } from '../../../../services/extended.caballo.service';
import { Caballo } from '../../../../model/caballo';
import { UserSessionEntity } from '../../../../model/userSession';
import {AdminCaballosInsertPage} from '../../admin-caballos/admin-caballos-insert';


@Component({
    templateUrl: 'datos-view.html',
    providers: [CommonService, SecurityService, CaballoService, ExtendedCaballoService]
})
export class DatosViewPage {
    form: any;
    idCaballo: number;
    nombreCaballo: string = "";
    caballoEntity: Caballo;
    generoList = [];
    pelajeList = [];
    criadorList = [];
    otrasMarcasList = [];

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
        this.caballoEntity = new Caballo();
        if (this._commonService.IsValidParams(this.navParams, ["idCaballoSelected", "nombreCaballoSelected"])) {
            this.idCaballo = this.navParams.get("idCaballoSelected");
            this.nombreCaballo = this.navParams.get("nombreCaballoSelected");
            this.getCaballo(this.idCaballo);
            this.getPelajeList();
            this.getGeneroList();
            this.getCriadorList();
            this.getOtrasMarcasList();
        }
        this.initForm();
    }

    initForm() {
        console.log("CABALLO:", this.caballoEntity);
        this.form = this.formBuilder.group({
            ID: [this.caballoEntity.ID],
            EstadoFEI: [this.caballoEntity.EstadoFEI],
            ADN: [this.caballoEntity.ADN],
            EstadoFEN: [this.caballoEntity.EstadoFEN],
            Criador_ID: [this.caballoEntity.Criador_ID],
            Establecimiento_ID: [this.caballoEntity.Establecimiento_ID],
            EstadoProvincia_Id: [this.caballoEntity.EstadoProvincia_Id],
            Genero_ID: [this.caballoEntity.Genero_ID],
            Grupo_ID: [this.caballoEntity.Grupo_ID],
            OtrasMarcas_ID: [this.caballoEntity.OtrasMarcas_ID],
            Pedigree_ID: [this.caballoEntity.Pedigree_ID],
            Pelaje_ID: [this.caballoEntity.Pelaje_ID],
            PersonaACargo_ID: [this.caballoEntity.PersonaACargo_ID],
            Propietario_ID: [this.caballoEntity.Propietario_ID]
        });
    }

    getCaballo(caballoId) {
        this._caballoService.getSerializedById(caballoId)
            .subscribe(res => {
                console.log(res);
                this.caballoEntity = res;
                this.reloadForm();
            }, error => {
                console.log(error);
                this._commonService.ShowErrorHttp(error, "Error cargando los datos del caballo");
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

    getCriadorList() {
        this._extendedCaballoService.getAllCriadorComboBox()
            .subscribe(res => {
                console.log(res);
                this.criadorList = res;
                this.reloadForm();
            }, error => {
                console.log(error);
                this._commonService.ShowErrorHttp(error, "Error cargando los criadores del caballo");
            });
    }

    getOtrasMarcasList() {
        this._extendedCaballoService.getAllOtrasMarcasComboBox()
            .subscribe(res => {
                console.log(res);
                this.otrasMarcasList = res;
                this.reloadForm();
            }, error => {
                console.log(error);
                this._commonService.ShowErrorHttp(error, "Error cargando las otras marcas del caballo");
            });
    }

    reloadForm() {
        this.initForm();
    }

    edit() {
        this.navCtrl.push(AdminCaballosInsertPage, {
            caballoEntity: this.caballoEntity,
            isUpdate: true,
            callbackController: this
        });

    }

    goBack() {
        this.navCtrl.pop();
    }

    reloadController() {
        this.getCaballo(this.idCaballo);
    }
}