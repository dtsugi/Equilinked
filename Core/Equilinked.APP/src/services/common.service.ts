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
        this.loader.dismissAll();
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

}