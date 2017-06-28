import { Component, OnInit } from "@angular/core";
import { AlertController, Events, NavController, NavParams } from "ionic-angular";
import { UserSessionEntity } from "../../../../model/userSession";
import { CommonService } from "../../../../services/common.service";
import { SecurityService } from "../../../../services/security.service";
import { PaisService } from "../../../../services/pais.service";
import { PropietarioService } from "../../../../services/propietario.service";
import { TipoNumeroService } from "../../../../services/tipo-numero.service";

@Component({
    templateUrl: "./edicion-perfil.html",
    providers: [CommonService, PaisService, PropietarioService, SecurityService, TipoNumeroService],
    styles: [`
    .item-md {
        padding-left: 0px;
    }
    `]
})
export class EdicionPerfilPage implements OnInit {

    private navCtrlMenu: NavController;//La referencia del menú
    private session: UserSessionEntity;
    private tiposTelefonos: Array<any>;
    private paises: Array<any>;
    private estados: Array<any>;

    perfil: any;

    constructor(
        private alertController: AlertController,
        private navController: NavController,
        private commonService: CommonService,
        private events: Events,
        private navParams: NavParams,
        private paisService: PaisService,
        private propietarioService: PropietarioService,
        private securityService: SecurityService,
        private tipoNumeroService: TipoNumeroService
    ) {
        this.tiposTelefonos = new Array<any>();
        this.paises = new Array<any>();
        this.estados = new Array<any>();
        this.perfil = {};
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.navCtrlMenu = this.navParams.get("navCtrlMenu");
        this.getInfoPerfil(); //Cargar info del propietario y lista de paises y estados
    }

    goBack(): void {
        this.navController.pop();
    }

    selectTipoTelefono(evt: FocusEvent, telefono: any): void {
        console.log(evt);
        let alert = this.alertController.create({
            inputs: this.tiposTelefonos.map(tt => {
                return {
                    type: "radio",
                    label: tt.Descripcion,
                    value: tt.ID,
                    checked: telefono.TipoNumero_ID == tt.ID
                };
            }),
            buttons: [
                { text: "Cancelar", role: "cancel" },
                {
                    text: "Aceptar", handler: data => {
                        telefono.TipoNumero_ID = data;
                        telefono.TipoTelefono = this.getTipoNumeroById(data)
                    }
                }
            ]
        });
        alert.present();
    }

    removeTelefono(index: number): void {
        this.perfil.PropietarioTelefono.splice(index, 1);
    }

    addOtherTelefono(): void {
        this.perfil.PropietarioTelefono.push({
            Numero: null,
            TipoNumero_ID: this.tiposTelefonos[0].ID,
            TipoTelefono: this.getTipoNumeroById(this.tiposTelefonos[0].ID)
        });
    }

    selectPais(): void {
        let alert = this.alertController.create({
            inputs: this.paises.map(p => {
                return {
                    type: "radio",
                    label: p.Descripcion,
                    value: p.ID,
                    checked: this.perfil.Pais_ID == p.ID
                };
            }),
            buttons: [
                { text: "Cancelar", role: "cancel" },
                {
                    text: "Aceptar", handler: data => {
                        this.estados = new Array<any>();
                        this.perfil.Pais_ID = data;
                        this.perfil.Pais = this.getPaisById(this.perfil.Pais_ID);
                        this.perfil.Estado = null;
                        this.refreshEstados(); //Refrescamos las provincias
                    }
                }
            ]
        });
        alert.present();
    }

    selectEstadoProvincia(): void {
        let alert = this.alertController.create({
            inputs: this.estados.map(ep => {
                return {
                    type: "radio",
                    label: ep.Nombre,
                    value: ep.Id,
                    checked: this.perfil.EstadoProvincia_Id == ep.Id
                };
            }),
            buttons: [
                { text: "Cancelar", role: "cancel" },
                {
                    text: "Aceptar", handler: data => {
                        this.perfil.EstadoProvincia_Id = data;
                        this.perfil.Estado = this.getEstadoProvinciaById(this.perfil.EstadoProvincia_Id);
                    }
                }
            ]
        });
        alert.present();
    }

    save(): void {
        this.commonService.showLoading("Procesando...");
        this.propietarioService.updatePropietario(this.perfil)
            .then(res => {
                this.events.publish("perfil:refresh");
                this.commonService.hideLoading();
                this.navController.pop();
                console.info(res);
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error al actualizar el perfil del usuario");
            });
    }

    private getInfoPerfil(): void {
        this.commonService.showLoading("Procesando...");
        this.propietarioService.getSerializedById(this.session.PropietarioId)
            .toPromise()
            .then(propietario => {
                console.info("El propietario:");
                console.info(propietario);
                this.perfil = propietario;
                return this.tipoNumeroService.getAll();
            }).then(tiposNumeros => {
                this.tiposTelefonos = tiposNumeros;
                if (this.perfil.PropietarioTelefono.length == 0) {
                    this.addOtherTelefono(); //Agregar un teléfono por default
                }
                this.perfil.PropietarioTelefono.forEach(tt => {
                    tt.TipoTelefono = this.getTipoNumeroById(tt.TipoNumero_ID);
                });
                return this.paisService.getAllPaises();
            }).then(paises => {
                console.info("Paises disponibles:");
                console.info(paises);
                this.paises = paises;
                this.perfil.Pais = this.getPaisById(this.perfil.Pais_ID);
                return this.paisService.getAllEstadoProvinciaByPaisId(this.perfil.Pais_ID);
            }).then(estados => {
                console.info("Estados disponibles:");
                console.info(estados);
                this.estados = estados;
                this.perfil.Estado = this.getEstadoProvinciaById(this.perfil.EstadoProvincia_Id);
                this.commonService.hideLoading();
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error al cargar la información del propietario");
            });
    }

    private getTipoNumeroById(id: number): string {
        let tipoos = this.tiposTelefonos.filter(tn => tn.ID == id);
        return tipoos.length > 0 ? tipoos[0].Descripcion : null;
    }

    private getPaisById(id: number): string {
        let paises: Array<any> = this.paises.filter(p => p.ID == id);
        return paises.length > 0 ? paises[0].Descripcion : null;
    }

    private getEstadoProvinciaById(id: number): string {
        let estados: Array<any> = this.estados.filter(e => e.Id == id);
        return estados.length > 0 ? estados[0]["Nombre"] : null;
    }

    private refreshEstados(): void {
        this.paisService.getAllEstadoProvinciaByPaisId(this.perfil.Pais_ID)
            .then(estados => {
                this.estados = estados;
            }).catch(err => {
                console.error(err);
            });
    }
}