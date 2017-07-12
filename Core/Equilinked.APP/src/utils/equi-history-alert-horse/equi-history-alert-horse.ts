import { Component, EventEmitter, Output, Input } from "@angular/core";

@Component({
    selector: "equi-history-alert-horse",
    templateUrl: "equi-history-alert-horse.html"
})
export class EquiHistoryAlertHorse {


    @Input("alert")
    alert: any;
    @Input("professionPerson")
    professionPerson: string;
    @Input("labelDelete")
    labelDelete: string;

    @Output("actionDeleteItem")
    actionDelete: EventEmitter<any>;
    @Output("actionEditItem")
    actionEdit: EventEmitter<any>;


    constructor() {
        this.actionDelete = new EventEmitter();
        this.actionEdit = new EventEmitter();
    }

    displayDetail(): void {
        if (this.alert) {
            this.alert.ShowDetail = true;
        }
    }

    hideDetail(): void {
        if (this.alert) {
            this.alert.ShowDetail = false;
        }
    }

    executeActionDelete(): void {
        if (this.actionDelete.observers.length > 0) {
            this.actionDelete.emit();
        }
    }

    executeActionEdit(): void {
        if (this.actionEdit.observers.length > 0) {
            this.actionEdit.emit();
        }
    }
}