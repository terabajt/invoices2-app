import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
    {
        name: 'Dashboard',
        url: '/dashboard',
        iconComponent: { name: 'cil-speedometer' },
        badge: {
            color: 'info',
            text: 'NEWs'
        }
    },
    {
        name: 'Faktury',
        url: '/invoices',
        iconComponent: { name: 'cil-notes' },
        children: [
            {
                name: 'Lista faktur',
                url: '/invoices',
                iconComponent: { name: 'cil-notes' }
            },
            {
                name: 'Dodaj fakturę',
                url: '/invoices/form',
                iconComponent: { name: 'cilNoteAdd' }
            }
        ]
    },
    {
        name: 'Klienci',
        url: '/customers',
        iconComponent: { name: 'cil-user' },
        children: [
            {
                name: 'Lista klientów',
                url: '/customers',
                iconComponent: { name: 'cil-list' }
            },
            {
                name: 'Dodaj klienta',
                url: '/customers/form',
                iconComponent: { name: 'cil-user-plus' }
            }
        ]
    },
    {
        name: 'Ustawienia',
        url: '/user/form',
        iconComponent: { name: 'cil-settings' },
        children: [
            {
                name: 'Ustawienia użytkownika',
                url: '/user/form',
                iconComponent: { name: 'cilApplicationsSettings' }
            }
        ]
    },

    {
        name: 'Wyloguj',
        url: '/logout',
        iconComponent: { name: 'cil-account-logout' }
    }
];
