import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import {Utils} from '../../app/utils'
import { CommonService } from '../../services/common.service';
import { TabsPage } from '../tabs/tabs';
import {UserSessionEntity} from '../../model/UserSessionEntity';
import { UsuarioService} from '../../services/usuario.service';


@Component({
    templateUrl: 'login.html',
    providers: [CommonService, UsuarioService]
})
export class LoginPage {
    form: any;
    userSession: UserSessionEntity;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private _commonService: CommonService,
        private formBuilder: FormBuilder,
        private _usuarioService: UsuarioService) {
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
        this._commonService.showLoading("Cargando..");
        console.log(this.form.value);
        this._usuarioService.login(this.form.value)
            .subscribe(res => {
                console.log(res);
                this._commonService.hideLoading();
                this.navCtrl.setRoot(TabsPage);
            }, error => {
                console.log(error);
                this._commonService.hideLoading();
                this._commonService.ShowErrorHttp(error, "Nombre de usuario o contraseña incorrectas ");
            },
            () => console.log("FINISHED LOGIN"));
    }
}