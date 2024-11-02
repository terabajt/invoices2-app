import { Component, Input, OnInit } from '@angular/core';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { User, UsersService } from '@invoice2-team/users';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styles: ``
})
export class MainHeaderComponent extends HeaderComponent implements OnInit {
    @Input() sidebarId: string = 'sidebar';

    public newMessages = new Array(4);
    public newTasks = new Array(5);
    public newNotifications = new Array(5);
    public currentUser!: User;

    constructor(
        private classToggler: ClassToggleService,
        private usersService: UsersService
    ) {
        super();
    }

    ngOnInit(): void {
        this.usersService.initAppSession();
        this.usersService.observeCurrentUser().subscribe((user) => {
            if (user) this.currentUser = user;
        });
    }
}
