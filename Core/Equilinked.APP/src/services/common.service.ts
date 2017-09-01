import {Injectable} from '@angular/core';
import {LoadingController, ToastController, AlertController} from 'ionic-angular'

@Injectable()
export class CommonService {
  loader: any;
  TOAST_POSITION = {top: 'top', middle: 'middle', bottom: 'bottom'};

  constructor(private loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              private alertCtrl: AlertController) {
  }

  // Mostrar la animación de 'Loading'
  showLoading(mje: string): any {
    this.loader = this.loadingCtrl.create({
      content: mje
    });
    this.loader.present();
    return this.loader;
  }

  // Ocultar la animación de 'Loading'
  hideLoading() {
    if (this.loader) {
      this.loader.dismissAll();
    }
  }

  ShowToast(toastCtrl, position: string, message: string, duration: number) {
    let toast = toastCtrl.create({
      message: message,
      duration: duration,
      position: position
    });
    toast.present(toast);
  }

  ShowErrorHttp(error, message) {
    console.log(error);
    this.hideLoading();
    this.ShowToast(this.toastCtrl, this.TOAST_POSITION.bottom, message, 2000);
  }

  ShowInfo(message: string) {
    this.hideLoading();
    this.ShowToast(this.toastCtrl, this.TOAST_POSITION.bottom, message, 2000);
  }

  ShowTypeObject(object) {
    console.log("object:", object, "typeof:", typeof object, "instance of Array:", object instanceof Array);
  }

  IsValidParams(navParams, params) {
    let isValid: boolean = true;
    console.log("PARAMS:", params)
    if (params !== undefined) {
      for (var index = 0; index < params.length; index++) {
        let paramData = navParams.get(params[index]);
        console.log("ParamName:", params[index], "ParamData:", paramData);
        if (paramData === undefined) {
          isValid = false;
          break;
        }
      }
    }
    if (!isValid) {
      this.ShowInfo("No se encontraron todos los parametros");
    }
    return isValid;
  }

  ShowConfirmAlert(title: string, message: string, buttons) {
    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: buttons
    });
    confirm.present();
  }

  NewButtonAlert(buttonId, text: string, callbackCtrl) {
    return {
      text: text,
      handler: () => {
        if (callbackCtrl != null) {
          callbackCtrl._callbackConfirmAlert(buttonId);
        }
      }
    }
  }
}
