import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Title } from '@angular/platform-browser';
import { UsersService } from '@invoice2-team/users';

@Component({
    selector: 'app-root',
    template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
    title = 'Invoices2 - Twoje nowoczesne fakturowanie.';

    constructor(
        private router: Router,
        private titleService: Title,
        private iconSetService: IconSetService,
        private usersServices: UsersService
    ) {
        titleService.setTitle(this.title);
        // iconSet singleton
        iconSetService.icons = { ...iconSubset };
    }

    ngOnInit(): void {
        this.usersServices.initAppSession();
    }
}
