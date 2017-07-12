import { Component, EventEmitter, Output, Input } from "@angular/core";

@Component({
    selector: "equi-item-list",
    templateUrl: "equi-item-list.html"
})
export class EquiItemList {

    @Input("title")
    title: string;
    @Input("subtitle")
    subtitle: string;
    @Input("subtitleWithCount")
    subtitleWithCount: string;
    @Input("location")
    location: string;
    @Input("image")
    image: string;
    @Input("labelDelete")
    labelDelete: string;

    @Output("actionItemClick")
    actionClick: EventEmitter<any>;
    @Output("actionItemDelete")
    actionDelete: EventEmitter<any>;

    constructor() {
        this.actionClick = new EventEmitter();
        this.actionDelete = new EventEmitter();
    }

    executeActionClick(): void {
        if (this.actionClick.observers.length > 0) {
            this.actionClick.emit();
        }
    }

    executeActionDelete(): void {
        if (this.actionDelete.observers.length > 0) {
            this.actionDelete.emit();
        }
    }
}