import {Injectable} from '@angular/core';
import {ConstantsConfig} from '../app/utils';
import {UserSessionEntity} from '../model/userSession';
import {Facebook} from "@ionic-native/facebook";
import {GooglePlus} from "@ionic-native/google-plus";

@Injectable()
export class SecurityService {
  userSession: UserSessionEntity;

  constructor(private facebook: Facebook, private googlePlus: GooglePlus) {
  }

  getValidSession(): boolean {
    let session: string = localStorage.getItem(ConstantsConfig.USER_SESSION);
    return session && session.length > 0;
  }

  setInitialConfigSession(userSessionEntity: UserSessionEntity) {
    localStorage.setItem(ConstantsConfig.USER_SESSION, JSON.stringify(userSessionEntity));
  }

  getInitialConfigSession() {
    this.userSession = JSON.parse(localStorage.getItem(ConstantsConfig.USER_SESSION));
    return this.userSession;
  }

  logout() {
    this.userSession = JSON.parse(localStorage.getItem(ConstantsConfig.USER_SESSION));
    if (this.userSession.TipoIdentificacion == 2) {//facebook
      this.facebook.logout()
        .then(response => {
          this.removeUserData();
        }).catch(err => {
        console.error(JSON.stringify(err));
        this.removeUserData();
      });
    } else if (this.userSession.TipoIdentificacion == 3) { //google
      this.googlePlus.logout()
        .then(response => {
          this.removeUserData();
        }).catch(err => {
        console.error(JSON.stringify(err));
        this.removeUserData();
      });
    } else {
      this.removeUserData();
    }
  }

  private removeUserData(): void {
    localStorage.removeItem(ConstantsConfig.USER_SESSION);
  }
}
