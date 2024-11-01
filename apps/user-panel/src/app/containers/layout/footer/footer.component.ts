import { Component } from '@angular/core';
import { FooterComponent } from '@coreui/angular';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styles: ``
})
export class MainFooterComponent extends FooterComponent {
    constructor() {
        super();
    }
}
