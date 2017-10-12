import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {SecurityService} from '../services/security.service';
import {TranslateService} from "@ngx-translate/core";
import {LoginPage} from '../pages/login/login';
import {TabsPage} from '../pages/tabs/tabs';
import {NotificacionLocalService} from '../services/notificacion-local.service';

@Component({
  templateUrl: 'app.html',
  providers: [SecurityService]
})
export class MyApp {
  rootPage: any = LoginPage;

  constructor(private notificacionLocalService: NotificacionLocalService,
              platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              translate: TranslateService,
              private securityService: SecurityService) {
    translate.setDefaultLang("es");
    if (this.securityService.getValidSession()) {
      this.rootPage = TabsPage;
    } else {
      this.rootPage = LoginPage;
    }
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.notificacionLocalService.initDataBase();//init the database
    });
  }
}

