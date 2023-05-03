import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DesktopComponent } from './view/fool/desktop/desktop.component';
import { WindowsButtonComponent } from './view/fool/windows-button/windows-button.component';
import { WindowsMenuComponent } from './view/fool/windows-menu/windows-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HitboxComponent } from './view/hitbox/hitbox.component';
import { MatMenuModule } from '@angular/material/menu';
import { HitboxCoreComponent } from './view/hitbox/core/hitbox-core.component';
import { HitboxSettingsComponent } from './view/hitbox/settings/hitbox-settings.component';
import { HttpClientModule } from '@angular/common/http';
import { DesktopIconComponent } from './view/interaction/desktop-icon/desktop-icon.component';
import { ChildElementsDirective } from './directives/child-elements.directive';
import { RickRollComponent } from './view/interaction/rick-roll/rick-roll.component';
import { AudioPlayerComponent } from './view/interaction/audio-player/audio-player.component';
import { HomePageComponent } from './view/pages/home-page/home-page.component';
import { MasterDashboardPageComponent } from './view/pages/master-dashboard-page/master-dashboard-page.component';
import { FoolHomePageComponent } from './view/pages/fool-home-page/fool-home-page.component';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { DashboardNavbarComponent } from './view/dashboard/dashboard-navbar/dashboard-navbar.component';
import { FoolCardComponent } from './view/cards/fool-card/fool-card.component';
import { SoundboardComponent } from './view/dashboard/soundboard/soundboard.component';
import { SoundboardButtonComponent } from './view/dashboard/soundboard/soundboard-button/soundboard-button.component';
import { CodelockComponent } from './view/codelock/codelock.component';
import { CodelockPageComponent } from './view/pages/codelock-page/codelock-page.component';
import { AssetsGalleryComponent } from './view/dashboard/assets-gallery/assets-gallery.component';
import { FileCardComponent } from './view/cards/file-card/file-card.component';
import { DragDropFileUploadDirective } from './directives/drag-drop-file-upload.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { ContextMenuComponent } from './view/global/context-menu/context-menu.component';
import { CustomSnackbarComponent } from './view/global/custom-snackbar/custom-snackbar.component';
import { LayoutEditorComponent } from './view/dashboard/layout-editor/layout-editor.component';
import { ButtonRaisedComponent } from './view/global/buttons/button-raised/button-raised.component';
import { ResourceBrowserModal } from './view/dialogs/resource-browser/resource-browser.modal';
import { NotificationsBoardComponent } from './view/master-dashboard/notifications-board/notifications-board.component';

@NgModule({
  declarations: [
    AppComponent,
    DesktopComponent,
    WindowsButtonComponent,
    WindowsMenuComponent,
    HitboxComponent,
    HitboxCoreComponent,
    HitboxSettingsComponent,
    DesktopIconComponent,
    ChildElementsDirective,
    RickRollComponent,
    AudioPlayerComponent,
    HomePageComponent,
    MasterDashboardPageComponent,
    FoolHomePageComponent,
    DashboardNavbarComponent,
    FoolCardComponent,
    SoundboardComponent,
    SoundboardButtonComponent,
    CodelockComponent,
    CodelockPageComponent,
    AssetsGalleryComponent,
    FileCardComponent,
    DragDropFileUploadDirective,
    NotificationsBoardComponent,
    ContextMenuComponent,
    CustomSnackbarComponent,
    LayoutEditorComponent,
    ButtonRaisedComponent,
    ResourceBrowserModal
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatDialogModule,
        DragDropModule,
        MatMenuModule,
        HttpClientModule,
        MatSliderModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
