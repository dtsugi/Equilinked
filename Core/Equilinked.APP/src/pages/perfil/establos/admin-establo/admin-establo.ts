import { Component, OnInit } from "@angular/core";
import { NavController, ModalController, NavParams, ToastController } from "ionic-angular";
import { FormBuilder, Validators } from "@angular/forms";
import { CommonService } from "../../../../services/common.service";
import { SecurityService } from "../../../../services/security.service";
import { CaballoService } from '../../../../services/caballo.service';
import { EstablosService } from "../../../../services/establos.service";
import { UserSessionEntity } from "../../../../model/userSession";
import { ListadoEstablosPage } from "../establos";
import { CaballosEstabloModal } from "./caballos-establo/caballos-establo-modal";


@Component({
    templateUrl: "./admin-establo.html",
    providers: [CaballoService, CommonService, EstablosService, SecurityService]
})
export class AdminEstablosPage implements OnInit {

    private session: UserSessionEntity;
    private establosPage: ListadoEstablosPage;

    establoForm: any;

    //informacion del establo
    private establo: any;
    //Lista de caballos (List<EstabloCaballo>)
    private caballos: Array<any>;

    constructor(
        private caballoService: CaballoService,
        private commonService: CommonService,
        private establosService: EstablosService,
        private formBuilder: FormBuilder,
        public modalController: ModalController,
        private navController: NavController,
        private navParams: NavParams,
        private securityService: SecurityService,
        public toastController: ToastController
    ) {
        this.caballos = new Array<any>();
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.establosPage = this.navParams.get("establosPage");
        this.initEstabloForm();
    }

    showSelectionModal(): void {
        let modal = this.modalController.create(CaballosEstabloModal, {
            session: this.session,
            caballos: this.caballos
        }); 
        modal.onDidDismiss(data => {
            if (data) {
                this.caballos = data.caballos;
            }
        });
        modal.present(); //Abrir!
    }

    save(): void {
        console.info(this.establoForm.value);
        let establo: any = this.establoForm.value;
        establo.Propietario_ID = this.session.PropietarioId;
        establo.EstabloCaballo = this.caballos;

        this.commonService.showLoading("Procesando..");
        this.establosService.saveEstablo(establo)
            .then(r => {
                this.commonService.hideLoading();
                this.navController.pop().then(() => {
                    this.establosPage.listEstablosByPropietarioId();
                });
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error al guardar el establo");
            });
    }

    private initEstabloForm(): void {
        this.establoForm = this.formBuilder.group({
            Nombre: ["", Validators.required],
            Manager: ["", Validators.required],
            CorreoElectronico: ["", Validators.required],
            Telefono: ["", Validators.required],
            Direccion: ["", Validators.required],
        });
    }
}