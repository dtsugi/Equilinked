import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from 'ionic-angular'


@Injectable()
export class CommonService {
    loader: any;
    TOAST_POSITION = { top: 'top', middle: 'middle', bottom: 'bottom' };

    constructor(private loadingCtrl: LoadingController,
        public toastCtrl: ToastController) { }

    // Mostrar la animación de 'Loading'
    showLoading(mje: string) {
        this.loader = this.loadingCtrl.create({
            content: mje
        });
        this.loader.present();
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

    // IsValidParams(data, params) {
    //     console.log(data,params)
    //     let isValid: boolean = true;
    //     let dataJson = JSON.stringify(data);
    //     this.ShowTypeObject(dataJson);
    //     for (var index = 0; index < params.length; index++) {
    //         if (!dataJson.includes(params[index])) {
    //             isValid = false;
    //             break;
    //         }
    //     }
    //     if(!isValid){
    //         this.ShowInfo("No se encontraron todos los parametros");
    //     }        
    //     return isValid;
    // }

    IsValidParams(navParams, params) {
        let isValid: boolean = true;
        console.log("PARAMS:",params)
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
}