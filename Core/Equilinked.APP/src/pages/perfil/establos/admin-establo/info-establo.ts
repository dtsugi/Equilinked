import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, ToastController } from "ionic-angular";

@Component({
    templateUrl: "./info-establo.html",
    providers: []
})
export class InfoEstabloPage implements OnInit {

    private establo: any;

    constructor(
        private navController: NavController,
        private navParams: NavParams,
    ) {
    }

    ngOnInit(): void {
        this.establo = this.navParams.get("establo");
    }
}