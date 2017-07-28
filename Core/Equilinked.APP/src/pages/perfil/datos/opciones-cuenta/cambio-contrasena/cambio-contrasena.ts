import { Component, OnInit } from "@angular/core";
import { NavController, ToastController } from "ionic-angular";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { UserSessionEntity } from "../../../../../model/userSession";
import { passwordMatcher } from "./password-validator";
import { CommonService } from "../../../../../services/common.service";
import { SecurityService } from "../../../../../services/security.service";
import { UsuarioService } from "../../../../../services/usuario.service";
import { LanguageService } from '../../../../../services/language.service';

@Component({
    templateUrl: "./cambio-contrasena.html",
    providers: [LanguageService, CommonService, SecurityService, UsuarioService]
})
export class CambioContrasenaPage implements OnInit {

    private session: UserSessionEntity;
    labels: any = {};
    formCambioPass: FormGroup;

    constructor(
        private commonService: CommonService,
        private navController: NavController,
        private securityService: SecurityService,
        private usuarioService: UsuarioService,
        private languageService: LanguageService
    ) {
        languageService.loadLabels().then(labels => this.labels = labels);
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.initForm();
    }

    changePassword(): void {
        let valuesForm: any = this.formCambioPass.value;
        this.commonService.showLoading(this.labels["PANT029_ALT_PRO"]);
        this.usuarioService.changePassword(
            this.session.IdUser,
            valuesForm["ContrasenaActual"],
            valuesForm["NuevaContrasena"]
        ).then(resp => {
            this.commonService.hideLoading();
            if (resp.StatusCambio) {
                this.navController.pop().then(() => {
                    this.commonService.ShowInfo(this.labels["PANT029_MSG_CAOK"]);
                });
            } else {
                this.commonService.ShowInfo(this.labels["PANT029_MSG_COERR"]);
            }
        }).catch(err => {
            this.commonService.ShowErrorHttp(err, this.labels["PANT029_MSG_ERRCA"]);
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

