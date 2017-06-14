import { Component, OnInit } from "@angular/core";
import { NavController, ToastController } from "ionic-angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserSessionEntity } from "../../../../../model/userSession";
import { CommonService } from "../../../../../services/common.service";
import { RecomendacionService } from "../../../../../services/recomendacion.service";
import { SecurityService } from "../../../../../services/security.service";

@Component({
    templateUrl: "./recomendacion.html",
    providers: [CommonService, RecomendacionService, SecurityService]
})
export class RecomendacionPage implements OnInit {

    private session: UserSessionEntity;
    invitacionForm: FormGroup;

    constructor(
        private commonService: CommonService,
        private navController: NavController,
        private recomendacionService: RecomendacionService,
        private securityService: SecurityService
    ) {
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.initForm();
    }

    sendInvitation(): void {
        let invitacion: any = this.invitacionForm.value;
        invitacion.Propietario_ID = this.session.PropietarioId;

        this.commonService.showLoading("Procesando..");
        setTimeout(() => {
            this.recomendacionService.sendInvitacionAmigo(invitacion)
                .catch(err => {
                    console.error(err);
                });
            this.commonService.hideLoading();
            this.navController.pop().then(() => {
                this.commonService.ShowInfo("La recomendación fue enviada de forma exitosa");
            });
        }, 2000);
    }

    private initForm(): void {
        this.invitacionForm = new FormGroup({
            CorreoDestinatario: new FormControl("", [Validators.required]),
            Mensaje: new FormControl("", [Validators.required])
        });
    }
}

