import { DashboardPage } from '../enums/dashboard-pages';
import { Menu } from '../types/menu';

export const dashboardNavbarMenus: Menu[] = [
    [
        {
            title: DashboardPage.Layout,
            icon: 'edit-image.png',
        },
        {
            title: DashboardPage.Soundboard,
            icon: 'speaker.png',
        },
        {
            title: DashboardPage.Notifications,
            icon: 'bell.png',
        },
        {
            title: DashboardPage.Resources,
            icon: 'photo-gallery.png',
        },
    ],
    [
        {
            title: DashboardPage.Settings,
            icon: 'gear.png',
        },
    ],
];
