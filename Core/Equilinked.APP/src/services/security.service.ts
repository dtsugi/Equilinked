import {Injectable} from '@angular/core';
import {ConstantsConfig} from '../app/utils';
import {UserSessionEntity} from '../model/userSession';

@Injectable()
export class SecurityService {
  userSession: UserSessionEntity;

  constructor() {
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
    localStorage.removeItem(ConstantsConfig.USER_SESSION);
  }
}
