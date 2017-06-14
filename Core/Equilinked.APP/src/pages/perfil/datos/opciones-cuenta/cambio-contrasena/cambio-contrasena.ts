import { Component, OnInit } from "@angular/core";
import { NavController, ToastController } from "ionic-angular";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { UserSessionEntity } from "../../../../../model/userSession";
import { passwordMatcher } from "./password-validator";
import { CommonService } from "../../../../../services/common.service";
import { SecurityService } from "../../../../../services/security.service";
import { UsuarioService } from "../../../../../services/usuario.service";

@Component({
    templateUrl: "./cambio-contrasena.html",
    providers: [CommonService, SecurityService, UsuarioService]
})
export class CambioContrasenaPage implements OnInit {

    private session: UserSessionEntity;

    formCambioPass: FormGroup;

    constructor(
        private commonService: CommonService,
        private navController: NavController,
        private securityService: SecurityService,
        private usuarioService: UsuarioService
    ) {
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.initForm();
    }

    changePassword(): void {
        let valuesForm: any = this.formCambioPass.value;
        this.commonService.showLoading("Procesando..");
        this.usuarioService.changePassword(
            this.session.IdUser,
            valuesForm["ContrasenaActual"],
            valuesForm["NuevaContrasena"]
        ).then(resp => {
            this.commonService.hideLoading();
            if (resp.StatusCambio) {
                this.navController.pop().then(() => {
                    this.commonService.ShowInfo("El cambio de contraseña fue exitoso");
                });
            } else {
                this.commonService.ShowInfo("La contraseña actual ingresa es incorrecta");
            }
        }).catch(err => {
            this.commonService.ShowErrorHttp(err, "Error al actualizar la contraseña");
        });
    }

    private initForm(): void {
        this.formCambioPass = new FormGroup({
            ContrasenaActual: new FormControl("", [Validators.required]),
            NuevaContrasena: new FormControl("", [Validators.required]),
            ConfirmacionNuevaContrasena: new FormControl("", [Validators.required])
        }, passwordMatcher);
    }
}

