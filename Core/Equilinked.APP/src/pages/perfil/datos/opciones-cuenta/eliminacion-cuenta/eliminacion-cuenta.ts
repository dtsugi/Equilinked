import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, ToastController } from "ionic-angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserSessionEntity } from "../../../../../model/userSession";
import { CommonService } from "../../../../../services/common.service";
import { UsuarioService } from "../../../../../services/usuario.service";
import { SecurityService } from "../../../../../services/security.service";
import { LoginPage } from '../../../../login/login';
import { LanguageService } from '../../../../../services/language.service';

@Component({
    templateUrl: "./eliminacion-cuenta.html",
    providers: [LanguageService, CommonService, SecurityService, UsuarioService],
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
    labels: any = {};

    constructor(
        private commonService: CommonService,
        private navController: NavController,
        private navParams: NavParams,
        private securityService: SecurityService,
        private usuarioService: UsuarioService,
        private languageService: LanguageService
    ) {
        languageService.loadLabels().then(labels => this.labels = labels);
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.navCtrlMenu = this.navParams.get("navCtrlMenu");
        this.initForm();
    }

    deleteAcount(): void {
        let valuesForm: any = this.cuentaForm.value;

        this.commonService.showLoading(this.labels["PANT032_ALT_PRO"]);
        this.usuarioService.deleteAccount(
            this.session.IdUser,
            valuesForm["Correo"],
            valuesForm["Password"]
        ).then((cuenta) => {
            this.commonService.hideLoading();
            if (cuenta && cuenta.Status) {
                this.commonService.ShowInfo(this.labels["PANT032_MSG_CUEOK"]);
                this.securityService.logout(); //salir!
                this.navCtrlMenu.setRoot(LoginPage).then(() => {
                    this.navCtrlMenu.push(LoginPage);
                });
            } else {
                this.commonService.ShowInfo(this.labels["PANT032_MSG_ERREL"]);
            }
        }).catch(err => {
            this.commonService.ShowErrorHttp(err, this.labels["PANT032_MSG_ERR"]);
        });
    }

    private initForm(): void {
        this.cuentaForm = new FormGroup({
            Correo: new FormControl("", [Validators.required]),
            Password: new FormControl("", [Validators.required])
        });
    }
}

