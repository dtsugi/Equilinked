import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, ToastController } from "ionic-angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserSessionEntity } from "../../../../../model/userSession";
import { CommonService } from "../../../../../services/common.service";
import { UsuarioService } from "../../../../../services/usuario.service";
import { SecurityService } from "../../../../../services/security.service";
import { LoginPage } from '../../../../login/login';

@Component({
    templateUrl: "./eliminacion-cuenta.html",
    providers: [CommonService, SecurityService, UsuarioService],
    styles: [`
    .ion-item {
        padding-left: 0px;
    }
    .title-text {
        font-size: 1.6rem;
        font-weight: normal;
    }
    `]
})
export class EliminacionCuentaPage implements OnInit {

    private session: UserSessionEntity;
    private navCtrlMenu: NavController;
    cuentaForm: FormGroup;

    constructor(
        private commonService: CommonService,
        private navController: NavController,
        private navParams: NavParams,
        private securityService: SecurityService,
        private usuarioService: UsuarioService
    ) {
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.navCtrlMenu = this.navParams.get("navCtrlMenu");
        this.initForm();
    }

    deleteAcount(): void {
        let valuesForm: any = this.cuentaForm.value;

        this.commonService.showLoading("Procesando..");
        this.usuarioService.deleteAccount(
            this.session.IdUser,
            valuesForm["Correo"],
            valuesForm["Password"]
        ).then((cuenta) => {
            this.commonService.hideLoading();
            if (cuenta && cuenta.Status) {
                this.commonService.ShowInfo("La cuenta ha sido eliminada");
                this.securityService.logout(); //salir!
                this.navCtrlMenu.setRoot(LoginPage).then(() => {
                    this.navCtrlMenu.push(LoginPage);
                });
            } else {
                this.commonService.ShowInfo("El correo y/o password es incorrecto");
            }
        }).catch(err => {
            this.commonService.ShowErrorHttp(err, "Error al eliminar la cuenta");
        });
    }

    private initForm(): void {
        this.cuentaForm = new FormGroup({
            Correo: new FormControl("", [Validators.required]),
            Password: new FormControl("", [Validators.required])
        });
    }
}

