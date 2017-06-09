import { Component, OnInit } from "@angular/core";
import { NavController, ModalController, NavParams, ToastController, AlertController } from "ionic-angular";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { CommonService } from "../../../../services/common.service";
import { SecurityService } from "../../../../services/security.service";
import { CaballoService } from '../../../../services/caballo.service';
import { EstablosService } from "../../../../services/establos.service";
import { TipoNumeroService } from "../../../../services/tipo-numero.service";
import { UserSessionEntity } from "../../../../model/userSession";
import { ListadoEstablosPage } from "../establos";
import { CaballosEstabloModal } from "./caballos-establo/caballos-establo-modal";
import { InfoEstabloPage } from "./info-establo";

@Component({
    templateUrl: "./admin-establo.html",
    providers: [CaballoService, CommonService, EstablosService, SecurityService, TipoNumeroService],
    styles: [`
    .icon-hidden {
        visibility: hidden;
    }

    .icon-input {
        font-size: 2.8rem;
        line-height: 1;
        margin-top: 11px;
        margin-bottom: 10px;
    }

    .col-center {
        text-align: center;
    }
    .item-md {
        padding-left: 0px;
    }
    `]
})
export class AdminEstablosPage implements OnInit {

    private session: UserSessionEntity;
    private establosPage: ListadoEstablosPage;
    private infoEstabloPage: InfoEstabloPage;

    establoForm: FormGroup;

    //informacion del establo
    private establo: any;
    //Lista de caballos (List<EstabloCaballo>)
    private caballos: Array<any>;
    tiposTelefono: Array<any>; //Aqui esta el catalogo de tipos de telefono

    tipoTelefonoPorTelefono: Array<any>;

    constructor(
        private alertController: AlertController,
        private caballoService: CaballoService,
        private commonService: CommonService,
        private establosService: EstablosService,
        private formBuilder: FormBuilder,
        public modalController: ModalController,
        private navController: NavController,
        private navParams: NavParams,
        private securityService: SecurityService,
        private tipoNumeroService: TipoNumeroService,
        public toastController: ToastController
    ) {
        this.caballos = new Array<any>();
        this.tiposTelefono = new Array<any>();
    }

    ngOnInit(): void {
        this.tipoTelefonoPorTelefono = [{ tipoTelefono: null }];

        this.session = this.securityService.getInitialConfigSession();
        this.establosPage = this.navParams.get("establosPage");
        this.infoEstabloPage = this.navParams.get("infoEstabloPage");
        this.establo = this.navParams.get("establo");

        this.initEstabloForm();
        this.listAllTipoNumeros();

        if (!this.establo) {
            this.establo = {
                Propietario_ID: this.session.PropietarioId,
                Nombre: null,
                Manager: null,
                Direccion: null,
                EstabloCaballo: null,
                EstabloCorreo: [{ CorreoElectronico: null }],
                EstabloTelefono: [{ Tipo_Numero_ID: null, Numero: null }]
            };
        }
    }

    private listAllTipoNumeros(): void {
        this.tipoNumeroService.getAll()
            .then(tiposTelefono => {
                this.tiposTelefono = tiposTelefono;
                if (!this.establo.ID) {
                    this.tipoTelefonoPorTelefono[0].tipoTelefono = this.tiposTelefono[0].ID.toString();
                }
            }).catch(err => {
                console.error(err);
            });
    }

    selectTipoTelefono(tipoTelefono: any): void {
        let inputs: Array<any> = this.tiposTelefono.map(tt => {
            let option: any = {
                type: "radio", label: tt.Descripcion, value: tt.ID.toString()
            };
            if (tt.ID.toString() == tipoTelefono.tipoTelefono) {
                option.checked = true;
            }
            return option;
        });

        let alert = this.alertController.create({
            inputs: inputs,
            buttons: [
                { text: "Cancelar", role: "cancel" },
                {
                    text: "Aceptar", handler: data => {
                        tipoTelefono.tipoTelefono = data.toString();
                    }
                }
            ]
        });
        alert.present();
    }

    getLabelTipoTelefoById(id: number): string {
        let tts: any = this.tiposTelefono.filter(tt => tt.ID == id);
        return tts && tts.length > 0 ? tts[0].Descripcion : "";
    }

    addOtherCorreo(): void {
        let correos: FormArray = this.establoForm.get("Correos") as FormArray;
        correos.push(new FormControl("", [Validators.required]));
        this.establo.EstabloCorreo.push({ CorreoElectronico: null });
    }

    removeCorreo(index: number): void {
        let correos: FormArray = this.establoForm.get("Correos") as FormArray;
        correos.removeAt(index);
        this.establo.EstabloCorreo.splice(index, 1);
    }

    addOtherTelefono(): void {
        let telefonos: FormArray = this.establoForm.get("Telefonos") as FormArray;
        telefonos.push(new FormControl("", [Validators.required]));
        this.tipoTelefonoPorTelefono.push({
            tipoTelefono: this.tiposTelefono[0].ID
        });
        this.establo.EstabloTelefono.push({
            Numero: null,
            Tipo_Numero_ID: null
        })
    }

    removeTelefono(index: number): void {
        let telefonos: FormArray = this.establoForm.get("Telefonos") as FormArray;
        telefonos.removeAt(index);
        this.tipoTelefonoPorTelefono.splice(index, 1);
        this.establo.EstabloTelefono.splice(index, 1);
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
        let establo = this.establo;
        establo.Nombre = this.establoForm.get("Nombre").value;
        establo.Manager = this.establoForm.get("Manager").value;
        establo.Direccion = this.establoForm.get("Direccion").value;
        establo.EstabloCaballo = this.caballos;
        (this.establoForm.get("Telefonos") as FormArray).controls.forEach((telefono, index) => {
            establo.EstabloTelefono[index].Numero = telefono.value;
            establo.EstabloTelefono[index].Tipo_Numero_ID = +this.tipoTelefonoPorTelefono[index].tipoTelefono;
        });

        (this.establoForm.get("Correos") as FormArray).controls.forEach((correo, index) => {
            establo.EstabloCorreo[index].CorreoElectronico = correo.value;
        });

        this.commonService.showLoading("Procesando..");
        let prom: Promise<any>;
        if (establo.ID) {
            prom = this.establosService.updateEstablo(establo);
        } else {
            prom = this.establosService.saveEstablo(establo);
        }
        prom.then(r => {
            this.commonService.hideLoading();
            if (this.infoEstabloPage) { //Si venia de editar toca actualizar la info del establo
                this.infoEstabloPage.getInfoEstablo(false);
            }
            this.navController.pop().then(() => {
                this.establosPage.listEstablosByPropietarioId(false);//Listamos de nuevo las paginas
            });
        }).catch(err => {
            this.commonService.ShowErrorHttp(err, "Error al guardar el establo");
        });
    }

    private initEstabloForm(): void {
        this.establoForm = new FormGroup({
            Nombre: new FormControl("", [Validators.required]),
            Manager: new FormControl("", [Validators.required]),
            Correos: new FormArray([
                new FormControl("", [Validators.required])
            ]),
            Telefonos: new FormArray([
                new FormControl("", [Validators.required])
            ]),
            Direccion: new FormControl("", [Validators.required])
        });

        if (this.establo) {
            this.initDataFromEstablo();
        }
    }

    private initDataFromEstablo(): void {
        this.establoForm.get("Nombre").setValue(this.establo.Nombre);
        this.establoForm.get("Manager").setValue(this.establo.Manager);
        this.establoForm.get("Direccion").setValue(this.establo.Direccion);
        let x: number = 1;
        //Con esto se busca acompletar  de tantos controles necesarios para visualizar la lista de correos
        if (this.establo.EstabloCorreo.length > 1) {
            while (x < this.establo.EstabloCorreo.length) {
                (this.establoForm.get("Correos") as FormArray).push(
                    new FormControl("", [Validators.required])
                );
                x++;
            }
        }
        x = 1;
        //Con esto se busca acompletar  de tantos controles necesarios para visualizar la lista de telefonos
        if (this.establo.EstabloTelefono.length > 1) {
            while (x < this.establo.EstabloTelefono.length) {
                (this.establoForm.get("Telefonos") as FormArray).push(
                    new FormControl("", [Validators.required])
                );
                x++;
            }
        }

        this.establoForm.get("Correos").setValue(
            this.establo.EstabloCorreo.map(c => c.CorreoElectronico)
        );
        this.establoForm.get("Telefonos").setValue(
            this.establo.EstabloTelefono.map(t => t.Numero)
        );
        this.tipoTelefonoPorTelefono = this.establo.EstabloTelefono.map(
            t => {
                return { tipoTelefono: t.Tipo_Numero_ID.toString() }
            }
        );
        this.caballos = this.establo.EstabloCaballo;
    }
}