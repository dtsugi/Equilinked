import { Component, OnInit } from "@angular/core";
import { NavController, ToastController } from "ionic-angular";
import { UserSessionEntity } from "../../../../../model/userSession";
import { CommonService } from "../../../../../services/common.service";
import { ContactoService } from "../../../../../services/contacto.service";
import { SecurityService } from "../../../../../services/security.service";

@Component({
    templateUrl: "./contacto.html",
    providers: [CommonService, ContactoService, SecurityService]
})
export class ContactoPage implements OnInit {

    private session: UserSessionEntity;

    motivos: Array<any>;
    mensaje: any;

    constructor(
        private commonService: CommonService,
        private contactoService: ContactoService,
        private navController: NavController,
        private securityService: SecurityService
    ) {
        this.motivos = new Array<any>();
        this.mensaje = {};
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.listAllMotivoContactos();
    }

    private listAllMotivoContactos(): void {
        this.commonService.showLoading("Procesando..");
        this.contactoService.getAllMotivoContacto()
            .then(motivos => {
                this.commonService.hideLoading();
                this.motivos = motivos;
                this.mensaje.MotivoContacto = motivos[0].ID;
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error al consultar los motivos");
            });
    }

    sendMessage(): void {
        let mensajeContacto: any = {
            Propietario_ID: this.session.PropietarioId,
            Mensaje: this.mensaje.Descripcion,
            MotivoContacto_ID: this.mensaje.MotivoContacto
        };

        this.commonService.showLoading("Procesando..");
        this.contactoService.saveMensajeContacto(mensajeContacto)
            .then(() => {
                this.commonService.hideLoading();
                this.navController.pop().then(() => {
                    this.commonService.ShowInfo("El mensaje fue enviado de forma exitosa");
                });
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error al enviar el mensaje");
            });
    }
}

