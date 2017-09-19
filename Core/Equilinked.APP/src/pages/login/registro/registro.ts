import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {CommonService} from '../../../services/common.service';
import {TabsPage} from '../../tabs/tabs';
import {PropietarioService} from "../../../services/propietario.service";
import {UsuarioService} from '../../../services/usuario.service';
import {SecurityService} from '../../../services/security.service';
import {LanguageService} from '../../../services/language.service';
import {Facebook} from "@ionic-native/facebook";
import {GooglePlus} from "@ionic-native/google-plus";
import {AppConfig} from "../../../app/app.config";

@Component({
  templateUrl: 'registro.html',
  providers: [CommonService, LanguageService, PropietarioService, UsuarioService, SecurityService]
})
export class RegistroPage {
  private FACEBOOK_APP_ID: number = AppConfig.FACEBOOK_APP_ID;
  private WEB_CLIENT_ID: string = AppConfig.GOOGLE_WEB_CLIENT_ID;
  propietario: any;
  labels: any = {};

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public facebook: Facebook,
              public googlePlus: GooglePlus,
              private commonService: CommonService,
              private propietarioService: PropietarioService,
              private usuarioService: UsuarioService,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.propietario = {Usuario: {}};
    this.facebook.browserInit(this.FACEBOOK_APP_ID, "v2.8");//2.8
  }

  ngOnInit() {
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
    });
  }

  saveUsuario() {
    this.commonService.showLoading("Procesando..");
    this.propietarioService.savePropietario(this.propietario)
      .then(() => {
        this.commonService.hideLoading();
        this.navCtrl.pop().then(() => {
          this.commonService.ShowInfo("La cuenta de usuario fue creada con éxito");
        });
      }).catch(err => {
      console.error(JSON.stringify(err));
      if (err.status === 400) {
        let body = JSON.parse(err._body);
        if (body.Message == 1) {
          this.commonService.ShowErrorHttp(err, "El nombre de usuario ya se encuentra en uso");
        } else {
          this.commonService.ShowErrorHttp(err, "El correo electrónico ya se encuentra en uso");
        }
      } else {
        this.commonService.ShowErrorHttp(err, "Error al crear la cuenta");
      }
    });
  }

  loginWithFacebook(): void {
    let userLogin: any = {};
    let userId;
    this.commonService.showLoading(this.labels["PANT001_ALE_LOA"]);
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
      this.commonService.hideLoading();
      console.error("Error al intentar iniciar sesion con cuenta de facebook");
      console.error(err);
    });
  }

  loginWithGoogle(): void {
    let userLogin: any = {};
    this.commonService.showLoading(this.labels["PANT001_ALE_LOA"]);
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
      this.commonService.hideLoading();
      console.error("Error al intentar iniciar sesion con cuenta de Google");
      console.error(err);
    });
  }

  private loginWithToken(user: any): void {
    this.usuarioService.loginWithToken(user)
      .then(this.accessHome)
      .catch(err => {
        this.commonService.hideLoading();
        console.error("Error al intentar acceder via token");
        console.error(JSON.stringify(err));
      });
  }

  accessHome = response => {
    this.securityService.setInitialConfigSession(response);
    this.commonService.hideLoading();
    this.navCtrl.setRoot(TabsPage);
  };
}
