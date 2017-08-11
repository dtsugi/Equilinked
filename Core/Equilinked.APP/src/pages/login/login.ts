import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { CommonService } from '../../services/common.service';
import { TabsPage } from '../tabs/tabs';
import { UserSessionEntity } from '../../model/UserSessionEntity';
import { UsuarioService } from '../../services/usuario.service';
import { SecurityService } from '../../services/security.service';
import { LanguageService } from '../../services/language.service';

@Component({
    templateUrl: 'login.html',
    providers: [CommonService, LanguageService, UsuarioService, SecurityService]
})
export class LoginPage {

    labels: any = {};
    form: any;
    userSession: UserSessionEntity;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private _commonService: CommonService,
        private formBuilder: FormBuilder,
        private _usuarioService: UsuarioService,
        private _securityService: SecurityService,
        private languageService: LanguageService
    ) {
        languageService.loadLabels().then(labels => this.labels = labels);
    }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.userSession = new UserSessionEntity();
        this.form = this.formBuilder.group({
            UserName: [this.userSession.UserName, Validators.required],
            Password: [this.userSession.Password, Validators.required]
        });
    }

    Login() {
        this._commonService.showLoading(this.labels["PANT001_ALE_LOA"]);
        console.log(this.form.value);
        this._usuarioService.login(this.form.value)
            .subscribe(res => {
                console.log(res);
                this._securityService.setInitialConfigSession(res);
                this._commonService.hideLoading();
                this.navCtrl.setRoot(TabsPage);
            }, error => {
                console.log(error);
                this._commonService.ShowErrorHttp(error, this.labels["PANT001_MSG_ERR_SES"]);
            });
    }
}
