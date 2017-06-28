import { Component, OnInit } from "@angular/core";
import { Events, NavController, ModalController, NavParams, ToastController, AlertController } from "ionic-angular";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { CommonService } from "../../../../services/common.service";
import { SecurityService } from "../../../../services/security.service";
import { CaballoService } from '../../../../services/caballo.service';
import { EstablosService } from "../../../../services/establos.service";
import { TipoNumeroService } from "../../../../services/tipo-numero.service";
import { UserSessionEntity } from "../../../../model/userSession";
import { CaballosEstabloModal } from "./caballos-establo/caballos-establo-modal";

@Component({
    templateUrl: "./admin-establo.html",
    providers: [CaballoService, CommonService, EstablosService, SecurityService, TipoNumeroService],
    styles: [`
    .item-md {
        padding-left: 0px;
    }
    `]
})
export class AdminEstablosPage implements OnInit {

    private session: UserSessionEntity;

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
        private events: Events,
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

    goBack(): void {
        this.navController.pop();
    }

    private listAllTipoNumeros(): void {
        this.tipoNumeroService.getAll()
            .then(tiposTelefono => {
                this.tiposTelefono = tiposTelefono;
                if (!this.establo.ID || this.establo.EstabloTelefono.Numero == null) {
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
        (this.establoForm.get("Telefonos") as FormArray).controls
            .forEach((telefono, index) => {
                establo.EstabloTelefono[index].Numero = telefono.value;
                establo.EstabloTelefono[index].Tipo_Numero_ID = +this.tipoTelefonoPorTelefono[index].tipoTelefono;
            });

        (this.establoForm.get("Correos") as FormArray).controls
            .forEach((correo, index) => {
                establo.EstabloCorreo[index].CorreoElectronico = correo.value;
            });

        //Limpiamos los que van vacios!
        establo.EstabloTelefono = establo.EstabloTelefono.filter(et => et.Numero != "");
        establo.EstabloCorreo = establo.EstabloCorreo.filter(ec => ec.CorreoElectronico != "");

        this.commonService.showLoading("Procesando..");
        let prom: Promise<any>;
        if (establo.ID) {
            prom = this.establosService.updateEstablo(establo);
        } else {
            prom = this.establosService.saveEstablo(establo);
        }
        prom.then(r => {
            this.commonService.hideLoading();
            if (establo.ID) {
                this.events.publish("establo:refresh"); //Refrescamos el detalle del establo
            }
            this.events.publish("establos:refresh"); //Refrescamos la lista de establos!
            this.navController.pop()
        }).catch(err => {
            this.commonService.ShowErrorHttp(err, "Error al guardar el establo");
        });
    }

    private initEstabloForm(): void {
        this.establoForm = new FormGroup({
            Nombre: new FormControl("", [Validators.required]),
            Manager: new FormControl("", []),
            Correos: new FormArray([
                new FormControl("", [])
            ]),
            Telefonos: new FormArray([
                new FormControl("", [])
            ]),
            Direccion: new FormControl("", [])
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

        if (this.establo.EstabloCorreo.length > 0) {
            this.establoForm.get("Correos").setValue(
                this.establo.EstabloCorreo.map(c => c.CorreoElectronico)
            );
        } else {
            this.establo.EstabloCorreo = [{ CorreoElectronico: null }];
        }

        if (this.establo.EstabloTelefono.length > 0) {
            this.establoForm.get("Telefonos").setValue(
                this.establo.EstabloTelefono.map(t => t.Numero)
            );
            this.tipoTelefonoPorTelefono = this.establo.EstabloTelefono.map(
                t => {
                    return { tipoTelefono: t.Tipo_Numero_ID.toString() }
                }
            );
        } else {
            this.establo.EstabloTelefono = [{ Tipo_Numero_ID: null, Numero: null }];
        }

        this.caballos = this.establo.EstabloCaballo;
    }
}