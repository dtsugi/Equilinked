import {Component} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NavController, NavParams} from 'ionic-angular';
import {CommonService} from '../../services/common.service';
import {TabsPage} from '../tabs/tabs';
import {UserSessionEntity} from '../../model/UserSessionEntity';
import {UsuarioService} from '../../services/usuario.service';
import {SecurityService} from '../../services/security.service';
import {LanguageService} from '../../services/language.service';
import {Facebook} from "@ionic-native/facebook";
import {GooglePlus} from "@ionic-native/google-plus";
import {AppConfig} from "../../app/app.config";
import {RegistroPage} from "./registro/registro";

@Component({
  templateUrl: 'login.html',
  providers: [CommonService, LanguageService, UsuarioService, SecurityService]
})
export class LoginPage {
  private FACEBOOK_APP_ID: number = AppConfig.FACEBOOK_APP_ID;
  private WEB_CLIENT_ID: string = AppConfig.GOOGLE_WEB_CLIENT_ID;
  labels: any = {};
  form: any;
  userSession: UserSessionEntity;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public facebook: Facebook,
              public googlePlus: GooglePlus,
              private _commonService: CommonService,
              private formBuilder: FormBuilder,
              private _usuarioService: UsuarioService,
              private _securityService: SecurityService,
              private languageService: LanguageService) {
    this.facebook.browserInit(this.FACEBOOK_APP_ID, "v2.8");//2.8
  }

  ngOnInit() {
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      this.initForm();
    });
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
      .subscribe(this.accessHome, error => {
        console.log(error);
        this._commonService.ShowErrorHttp(error, this.labels["PANT001_MSG_ERR_SES"]);
      });
  }

  loginWithFacebook(): void {
    let userLogin: any = {};
    let userId;
    this._commonService.showLoading(this.labels["PANT001_ALE_LOA"]);
    this.facebook.login(["public_profile", "email"])
      .then(response => {
        userLogin.Token = response.authResponse.accessToken;
        userId = response.authResponse.userID;
        return this.facebook.api("/me?fields=name,email", [])
      }).then(user => {
      userLogin.Nombre = user.name;
      userLogin.TipoIdentificacion = 2;//facebook
      this.loginWithToken(userLogin);
    }).catch(err => {
      console.error("Error al intentar iniciar sesion con cuenta de facebook");
      console.error(JSON.stringify(err));
      this._commonService.hideLoading();
    });
  }

  loginWithGoogle(): void {
    let userLogin: any = {};
    this._commonService.showLoading(this.labels["PANT001_ALE_LOA"]);
    this.googlePlus.login({
      "scopes": "",
      "webClientId": this.WEB_CLIENT_ID,
      "offline": true
    }).then(user => {
      userLogin.Token = user.idToken;
      userLogin.Nombre = user.displayName;
      userLogin.TipoIdentificacion = 3;//Google
      this.loginWithToken(userLogin);
    }, err => {
      console.error("Error al intentar iniciar sesion con cuenta de Google");
      console.error(JSON.stringify(err));
      this._commonService.hideLoading();
    });
  }

  createAccount(): void {
    this.navCtrl.push(RegistroPage);
  }

  private loginWithToken(user: any): void {
    this._usuarioService.loginWithToken(user)
      .then(this.accessHome)
      .catch(err => {
        this._commonService.hideLoading();
        console.error("Error al intentar acceder via token");
      });
  }

  accessHome = response => {
    this._securityService.setInitialConfigSession(response);
    this._commonService.hideLoading();
    this.navCtrl.setRoot(TabsPage);
  };
}
